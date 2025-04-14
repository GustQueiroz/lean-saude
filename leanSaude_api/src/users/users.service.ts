import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { Prisma, UserStatus } from "@prisma/client";
import { SqsService } from "../sqs/sqs.service";

interface FilterQuery {
  column: keyof Prisma.UserWhereInput;
  operator: "equals" | "contains" | "gte" | "lte";
  value: string;
  condition?: "AND" | "OR";
}

interface FindAllParams {
  page?: number;
  perPage?: number;
  orderBy?: keyof Prisma.UserOrderByWithRelationInput;
  sort?: "asc" | "desc";
  filters?: FilterQuery[];
}

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly sqsService: SqsService
  ) {}

  async updateStatus(userId: string, status: UserStatus) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException("Usuário não encontrado");
    }

    const updated = await this.prisma.user.update({
      where: { id: userId },
      data: { status },
    });

    this.sqsService.sendMessage({
      event: "USER_STATUS_UPDATED",
      userId: updated.id,
      newStatus: updated.status,
      timestamp: new Date().toISOString(),
    });

    return updated;
  }

  async findAll(params: FindAllParams) {
    const {
      page = 1,
      perPage = 10,
      orderBy = "createdAt",
      sort = "desc",
      filters = [],
    } = params;

    const where: Prisma.UserWhereInput = this.buildWhere(filters);

    const order = (() => {
      if (orderBy === "status") {
        return {
          status: sort,
        };
      }

      return {
        [orderBy]: sort,
      };
    })();

    const [users, total] = await this.prisma.$transaction([
      this.prisma.user.findMany({
        where,
        orderBy: order,
        skip: (page - 1) * perPage,
        take: perPage,
      }),
      this.prisma.user.count({ where }),
    ]);

    return {
      data: users,
      total,
      page,
      perPage,
      lastPage: Math.ceil(total / perPage),
    };
  }

  private buildWhere(filters: FilterQuery[]): Prisma.UserWhereInput {
    if (!filters.length) return {};

    const rawConditions = filters.map((filter) => {
      const { column, operator, value } = filter;

      if (!value?.trim()) return null;

      const condition: Prisma.UserWhereInput = {};

      switch (operator) {
        case "contains":
          condition[column] = {
            contains: value,
            mode: "insensitive",
          } as any;
          break;

        case "equals":
          if (column === "createdAt") {
            if (!value) return null;

            try {
              const [year, month, day] = value.split("-");
              if (!year || !month || !day) return null;

              const start = new Date(
                Date.UTC(Number(year), Number(month) - 1, Number(day), 0, 0, 0)
              );
              const end = new Date(
                Date.UTC(
                  Number(year),
                  Number(month) - 1,
                  Number(day),
                  23,
                  59,
                  59,
                  999
                )
              );

              condition["createdAt"] = {
                gte: start,
                lte: end,
              };
            } catch (error) {
              console.error("Erro ao processar data:", error);
              return null;
            }
          } else {
            condition[column] = {
              equals: value,
              mode: typeof value === "string" ? "insensitive" : undefined,
            } as any;
          }
          break;

        case "gte":
          condition[column] = { gte: new Date(value) } as any;
          break;

        case "lte":
          condition[column] = { lte: new Date(value) } as any;
          break;
      }

      return condition;
    });

    const validConditions = rawConditions.filter(
      (c): c is Prisma.UserWhereInput => c !== null
    );

    if (!validConditions.length) return {};

    const hasOr = filters.some((f) => f.condition === "OR");

    if (hasOr) {
      const orConditions = validConditions.filter(
        (_, i) => filters[i].condition === "OR"
      );
      const andConditions = validConditions.filter(
        (_, i) => !filters[i].condition || filters[i].condition === "AND"
      );

      return {
        AND: [
          ...andConditions,
          ...(orConditions.length > 0 ? [{ OR: orConditions }] : []),
        ],
      };
    }

    return { AND: validConditions };
  }
}

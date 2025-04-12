import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { Prisma, UserStatus } from "@prisma/client";
import { SqsService } from "../sqs/sqs.service";

interface FilterQuery {
  column: keyof Prisma.UserWhereInput;
  operator: "equals" | "contains" | "gte" | "lte";
  value: string;
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

  async findAll(params: FindAllParams) {
    const {
      page = 1,
      perPage = 10,
      orderBy = "createdAt",
      sort = "desc",
      filters = [],
    } = params;

    const where: Prisma.UserWhereInput = this.buildWhere(filters);

    const [users, total] = await this.prisma.$transaction([
      this.prisma.user.findMany({
        where,
        orderBy: { [orderBy]: sort },
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

  private buildWhere(filters: FilterQuery[]): Prisma.UserWhereInput {
    const andConditions: Prisma.UserWhereInput[] = [];

    for (const filter of filters) {
      const { column, operator, value } = filter;

      const condition: Prisma.UserWhereInput = {};

      switch (operator) {
        case "contains":
          condition[column] = {
            contains: value,
            mode: "insensitive",
          } as any;
          break;
        case "equals":
          condition[column] = value as any;
          break;
        case "gte":
          condition[column] = { gte: new Date(value) } as any;
          break;
        case "lte":
          condition[column] = { lte: new Date(value) } as any;
          break;
      }

      andConditions.push(condition);
    }

    return {
      AND: andConditions,
    };
  }
}

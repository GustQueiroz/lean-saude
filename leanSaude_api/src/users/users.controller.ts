import {
  Controller,
  Get,
  Patch,
  Param,
  Query,
  Body,
  ParseUUIDPipe,
} from "@nestjs/common";
import { UsersService } from "./users.service";
import { UserStatus } from "@prisma/client";

@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async findAll(
    @Query("page") page?: number,
    @Query("perPage") perPage?: number,
    @Query("orderBy") orderBy?: string,
    @Query("sort") sort?: "asc" | "desc",
    @Query("filters") filters?: string
  ) {
    return this.usersService.findAll({
      page: Number(page) || 1,
      perPage: Number(perPage) || 10,
      orderBy: orderBy as any,
      sort,
      filters: filters ? JSON.parse(filters) : [],
    });
  }

  @Patch(":id/status")
  async updateStatus(
    @Param("id", new ParseUUIDPipe()) id: string,
    @Body("status") status: UserStatus
  ) {
    return this.usersService.updateStatus(id, status);
  }
}

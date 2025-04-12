import { Module } from "@nestjs/common";
import { UsersService } from "./users.service";
import { UsersController } from "./users.controller";
import { SqsModule } from "../sqs/sqs.module";

@Module({
  imports: [SqsModule],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}

import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import {EmailService} from "../email/email.service";
import {EmailModule} from "../email/email.module";
import {UsersEntity} from "./users.entity";
import {TypeOrmModule} from "@nestjs/typeorm";
import {AuthModule} from "../auth/auth.module";

@Module({
    imports: [EmailModule,AuthModule,
        TypeOrmModule.forFeature([UsersEntity])],
    controllers: [UsersController],
    providers: [UsersService],

})
export class UsersModule {}
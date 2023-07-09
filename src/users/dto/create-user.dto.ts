import {Body, Post} from "@nestjs/common";

export class CreateUserDto {
    readonly name: string;
    readonly email: string;
    readonly password: string;
}
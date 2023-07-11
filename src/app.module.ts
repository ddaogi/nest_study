import { Module } from '@nestjs/common';
import { UsersController } from './users/users.controller';
import {UsersService} from "./users/users.service";
import { EmailService } from './email/email.service';
import {CoreModule} from "./core.module";
import {AppController} from "./app.controller";
import {AppService} from "./app.service";
import {UsersModule} from "./users/users.module";
import { EmailModule } from './email/email.module';
import {ConfigModule, ConfigService} from "@nestjs/config";
import {CommonModule} from "./common.module";
import emailConfig from "./config/emailConfig";
import {validationSchema} from "./config/validation.schema";
import {TypeOrmModule} from "@nestjs/typeorm";
import {UsersEntity} from "./users/users.entity";

// @Module({
//   imports: [ConfigModule.forRoot({
//     envFilePath:(process.env.NODE_ENV === 'production') ? '.production.env'
//         : (process.env.NODE_ENV === 'stage') ? '.stage.env' : '.development.env'
//   })], //[CommonModule]
//   controllers: [AppController],   // [UsersController],
//   providers: [AppService,ConfigService], //[UsersService, EmailService]
// })

@Module({
  imports: [
      ConfigModule.forRoot({
        isGlobal: true,
        envFilePath: [`${__dirname}/config/env/.${process.env.NODE_ENV}.env`],
        load: [emailConfig],
        validationSchema,
      }),
      UsersModule,
      TypeOrmModule.forRoot({
          type: 'mysql',
          host: process.env.DATABASE_HOST, //localhost
          port:3306,
          username: process.env.DATABASE_USERNAME, // 'root'
          password: process.env.DATABASE_PASSWORD, //'test'
          database:'test',
          // entities: [__dirname + '/**/*.entity{.ts,.js}'],
          entities:[UsersEntity],
          synchronize: process.env.DATABASE_SYNCHRONIZE === 'true',

      }),
  ],
  controllers: [],
  providers:[],
})

export class AppModule {}

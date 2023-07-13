import {MiddlewareConsumer, Module, NestModule, RequestMethod} from '@nestjs/common';
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
import { LoggerMiddleware} from "./logger.middleware";
import {Logger2Middleware} from "./logger2.middleware";
import {APP_GUARD} from "@nestjs/core";
import {AuthGuard} from "./auth/auth.guard";
import authConfig from "./auth/auth.config";
import {LoggerModule} from "./logger.module";
import {
    utilities as nestWinstonModuleUtilities,
    WinstonModule,
}from 'nest-winston';
import * as winston from 'winston';
import {LoggingModule} from "./logging.module";
import { TaskService } from './task/task.service';
import {BatchModule} from "./batches/batch.module";
import { BatchesController } from './batches/batches.controller';

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
      BatchModule,
        LoggingModule,
      LoggerModule, UsersModule,

      ConfigModule.forRoot({
        isGlobal: true,
        envFilePath: [`${__dirname}/config/env/.${process.env.NODE_ENV}.env`],
        load: [emailConfig, authConfig],
        validationSchema,
      }),
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
      WinstonModule.forRoot({
          transports:[
              new winston.transports.Console({
                level: process.env.NODE_ENV ==='production'? 'info' : 'silly',
                  format: winston.format.combine(
                      winston.format.timestamp(),
                      nestWinstonModuleUtilities.format.nestLike('MyApp',{prettyPrint: true}),
                  ),
              }),
          ],
      }),
  ],
  controllers: [AppController, BatchesController],
  providers:[AppService,
      {
          provide: APP_GUARD,
          useClass: AuthGuard,
      },


  ],
})


export class AppModule implements NestModule{
    configure(consumer: MiddlewareConsumer): any{
        consumer
            .apply(LoggerMiddleware, Logger2Middleware)
            // .exclude({ path: '/users', method: RequestMethod.GET})
            .forRoutes(UsersController);
    }
}

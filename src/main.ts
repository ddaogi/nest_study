import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {LogLevel, ValidationPipe} from '@nestjs/common'
import {logger3} from "./logger3/logger3.middleware";
import {AuthGuard} from "./auth/auth.guard";
import {MyLogger} from "./my.logger";
import {LoggingInterceptor} from "./intercept/logging.intercept";
import {TransformInterceptor} from "./intercept/transform.intercept";

// async function bootstrap() {
//   const app = await NestFactory.create(AppModule);//, {logger: false,});
//   // app.useGlobalPipes(new ValidationPipe({
//   //   transform: true,
//   // }));
//   // app.use(logger3);
//   app.useGlobalGuards(new AuthGuard());
//   await app.listen(3000);
// }

async function bootstrap() {
  // const app = await NestFactory.create(AppModule,{
  //   logger: process.env.NODE_ENV === 'production'
  //   ? ['error', 'warn', 'log']
  //       : ['error', 'warn', 'log', 'verbose', 'debug']
  // });
  //, {logger: false,});

  const app = await NestFactory.create(AppModule);
  // app.useLogger(app.get(MyLogger));
  app.useGlobalGuards(new AuthGuard());
  app.useGlobalInterceptors(
      // new LoggingInterceptor(),
      new TransformInterceptor());
  await app.listen(3000);
}

const LOG_LEVEL_VALUE: Record<LogLevel, number> = {
  debug:0,
  verbose:1,
  log:2,
  warn:3,
  error:4,
}
bootstrap();

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {ValidationPipe} from '@nestjs/common'
import {logger3} from "./logger3/logger3.middleware";
import {AuthGuard} from "./auth/auth.guard";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // app.useGlobalPipes(new ValidationPipe({
  //   transform: true,
  // }));
  // app.use(logger3);
  app.useGlobalGuards(new AuthGuard());
  await app.listen(3000);
}
bootstrap();

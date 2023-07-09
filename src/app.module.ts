import { Module } from '@nestjs/common';
import { UsersController } from './users/users.controller';
import {UsersService} from "./users/users.service";
import { EmailService } from './email/email.service';
import {CoreModule} from "./core.module";
import {AppController} from "./app.controller";
import {AppService} from "./app.service";
import {UsersModule} from "./users/users.module";
import { EmailModule } from './email/email.module';

@Module({
  imports: [UsersModule, EmailModule],
  controllers: [],   // [UsersController],
  providers: [], //[UsersService, EmailService]
})
export class AppModule {}

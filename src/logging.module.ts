import {Logger, Module} from "@nestjs/common";
import {APP_INTERCEPTOR} from "@nestjs/core";
import {LoggingInterceptor} from "./intercept/logging.intercept";


@Module({
    providers: [
        Logger,
        {provide: APP_INTERCEPTOR, useClass: LoggingInterceptor},
    ],
})
export class LoggingModule{}
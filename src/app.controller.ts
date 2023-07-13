import {Controller, Get, UseGuards} from "@nestjs/common";
import {CommonService} from "./common.service";
import {ConfigService} from '@nestjs/config';
import {AuthGuard} from "./auth/auth.guard";
import {AppService} from "./app.service";
@UseGuards(AuthGuard)
@Controller()
export class AppController{
    // constructor(private readonly commonService: CommonService){}
    //
    // @Get('/common-hello')
    // getCommonHello(): string{
    //     return this.commonService.hello();
    // }
    // constructor(
    //     private readonly configService: ConfigService,
    // ){}

    constructor(private readonly appService: AppService){}

    @Get('/error')
    error(foo: any): string{
        return foo.bar();
    }

    @UseGuards(AuthGuard)
    @Get()
    getHello():string {
        return this.appService.getHello();
    }

    // @Get('/db-host-from-config')
    // getDatabaseHostFromConfigService(): string{
    //     return this.configService.get('DATABASE_HOST');
    // }

    // @Get()
    // getHello(): string{
    //     return process.env.DATABASE_HOST;
    //
    // }
}

import {ConsoleLogger, LoggerService} from "@nestjs/common";


export class MyLogger extends ConsoleLogger{
    // log(message: any, ...optionalParams: any[]){
    //     console.log(message);
    // }
    // error(message: any, ...optionalParams: any[]){
    //     console.log(message);
    // }
    // warn(message: any, ...optionalParams: any[]){
    //     console.log(message);
    // }
    // debug?(message: any, ...optionalParams: any[]){
    //     console.log(message);
    // }
    // verbose?(message: any, ...optionalParams: any[]){
    //     console.log(message);
    //

    error(message: any, stack?: string, context?: string){
        super.error.apply(this, arguments);
        this.doSomething();
    }

    private doSomething(){
        //DB에 저장 등 로깅에 관련된 부가 로직 추가
        console.log("my.logger.ts  error dosomething function 실행")
    }
}
import {Injectable, NestMiddleware, Req, Res} from "@nestjs/common";
import {Request, Response, NextFunction} from "express";

@Injectable()
export class LoggerMiddleware implements NestMiddleware{
    use(req: Request, res: Response, next: NextFunction){
        console.log('Request....');
        // res.send('DONE');
        next();
    }
}


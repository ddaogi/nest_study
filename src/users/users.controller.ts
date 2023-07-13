import {
    Body,
    Controller,
    DefaultValuePipe,
    Delete,
    Get,
    HttpStatus,
    Param,
    ParseIntPipe,
    Post,
    Query,
    Headers, Inject, BadRequestException, HttpException, InternalServerErrorException, UseInterceptors
} from '@nestjs/common';
import {CreateUserDto} from './dto/create-user.dto';
import {VerifyEmailDto} from "./dto/verify-email.dto";
import {UserLoginDto} from "./dto/user-login.dto";
import {UsersService} from "./users.service";
import {ValidationPipe} from "../validation.pipe";
import {AuthService} from "../auth/auth.service";
import {UserInfo} from "./UserInfo";
import {WINSTON_MODULE_PROVIDER, WinstonLogger} from "nest-winston";
import {ErrorsInterceptor} from "../intercept/errors.intercept";


@Controller('users')
export class UsersController {

    constructor(@Inject(WINSTON_MODULE_PROVIDER) private readonly logger:WinstonLogger,
                private usersService: UsersService,
                private authService: AuthService){}

    // @Post()
    // async createUser(@Body() dto: CreateUserDto): Promise<void> {
    //     // console.log(dto);
    //     const {name, email, password } = dto;
    //     await this.usersService.createUser(name,email,password);
    // }


    @Post('/email-verify')
    async verifyEmail(@Query() dto: VerifyEmailDto): Promise<string>{
        const {signupVerifyToken} = dto;

        return await this.usersService.verifyEmail(signupVerifyToken);
    }

    @Post('/login')
    async login(@Body() dto: UserLoginDto): Promise<string> {
        const { email, password } = dto;
        return await this.usersService.login(email,password);
    }

    // @Get('/:id')
    // async getUserInfo(@Param('id') userId: string): Promise<UserInfo> {
    //     return await this.usersService.getUserInfo(userId);
    // }

    // @Get('/:id')
    // findOne(@Param('id', new ValidationPipe) id: number){
    //     return this.usersService.findOne(id);
    // }
    @Get('/getUser/:id')
    async getUserInfo(@Headers() headers: any, @Param('id') userId: string):
    Promise<UserInfo>{
        const jwtString = headers.authroization.split('Bearer ')[1];

        this.authService.verify(jwtString);

        return this.usersService.getUserInfo(userId)
    }

    @UseInterceptors(ErrorsInterceptor)
    @Get('/findOne/:id')
    findOne(@Param('id') id: string){
        throw new InternalServerErrorException();
        // if(+id<1){
        //     throw new HttpException(
        //         {
        //             errorMessage: 'id는 0보다 큰 정수여야 합니다. http',
        //             foo: 'bar'
        //         },
        //         HttpStatus.BAD_REQUEST);
        // }
        // return this.usersService.findOne(+id);
    }

    @Get()
    findAll(
        @Query('offset', new DefaultValuePipe(0), ParseIntPipe) offset: number,
        @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    ){
        console.log(offset,limit);

        return this.usersService.findAll();
    }
    @Delete(':id')
    remove(@Param('id') id: string){
        return this.usersService.remove(+id);
    }

    @Post()
    createUser(@Body(ValidationPipe) createUserDto: CreateUserDto){
        this.printWinstonLog(createUserDto);
        return this.usersService.createUser(createUserDto.name,createUserDto.email,createUserDto.password);
    }
    private printWinstonLog(dto){
        console.log(this.logger.log);

        this.logger.error('error: ',dto);
        this.logger.warn('warn: ', dto);
        this.logger.verbose('info: ', dto);
        this.logger.debug('debug: ' , dto);



    }
}




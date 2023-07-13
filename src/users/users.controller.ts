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
    Headers
} from '@nestjs/common';
import {CreateUserDto} from './dto/create-user.dto';
import {VerifyEmailDto} from "./dto/verify-email.dto";
import {UserLoginDto} from "./dto/user-login.dto";
import {UsersService} from "./users.service";
import {ValidationPipe} from "../validation.pipe";
import {AuthService} from "../auth/auth.service";
import {UserInfo} from "./UserInfo";


@Controller('users')
export class UsersController {

    constructor(private usersService: UsersService,
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
    @Get(':id')
    async getUserInfo(@Headers() headers: any, @Param('id') userId: string):
    Promise<UserInfo>{
        const jwtString = headers.authroization.split('Bearer ')[1];

        this.authService.verify(jwtString);

        return this.usersService.getUserInfo(userId)
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
    create(@Body(ValidationPipe) createUserDto: CreateUserDto){
        return this.usersService.createUser(createUserDto.name,createUserDto.email,createUserDto.password);
    }
}




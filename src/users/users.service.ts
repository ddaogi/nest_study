import {Injectable, InternalServerErrorException, Post, Query, UnprocessableEntityException} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
// import { UpdateUserDto } from './dto/update-user.dto';
import * as uuid from "uuid";
import {EmailService} from 'src/email/email.service';
import {UserInfo} from "./UserInfo";
import {InjectRepository} from "@nestjs/typeorm";
import {UsersEntity} from "./users.entity";
import {UsersModule} from "./users.module";
import {DataSource, Repository} from "typeorm";
import {ulid} from "ulid";
import {query} from "express";


@Injectable()
export class UsersService {
    constructor(private emailService: EmailService,
                private dataSource: DataSource,
                @InjectRepository(UsersEntity) private usersRepository: Repository<UsersEntity>){}
    create(createUserDto: CreateUserDto) {
        return 'This action adds a new user';
    }

    findAll() {
        return `This action returns all users`;
    }

    findOne(id: number) {
        return `This action returns a #${id} user`;
    }

    // update(id: number, updateUserDto: UpdateUserDto) {
    //     return `This action updates a #${id} user`;
    // }

    remove(id: number) {
        return `This action removes a #${id} user`;
    }
    async createUser(name: string, email: string, password: string) {
        const userExist = await this.checkUserExists(email);
        if(userExist){
            throw new UnprocessableEntityException('해당 이메일로는 가입할 수 없습니다.');
        }

        const signupVerifyToken= uuid.v1();

        // await this.saveUser(name, email, password, signupVerifyToken);       // 일반 저장
        // await this.saveUserUsingQueryRunner(name,email,password,signupVerifyToken);   // 롤백쿼리를 사용한 저장
        await this.saveUserUsingTransaction(name,email,password,signupVerifyToken); //transaction을 사용한 저장
        await this.sendMemberJoinEmail(email, signupVerifyToken);
    }

    private async checkUserExists(emailAddress: string){
        const user = await this.usersRepository.findOne({
            where: { email:emailAddress}
        });
        return user != null;
    }


    private async sendMemberJoinEmail(email: string, signupVerifyToken: string){
        await this.emailService.sendMemberJoinVerification(email,signupVerifyToken);
    }

    async verifyEmail(signupVerifyToken: string): Promise<string>{
        // TODO
        // 1. DB에서 signupVerifyToken으로 회원가입처리중인유저가있는지 조회하고 없다면 에러 처리
        // 2. 바로 로그인 상태가 되도록 jwt 발급

        throw new Error('Method not implemented.');
    }

    async login(email: string, password: string): Promise<string>{
        //TODO
        // 1. email, password를 가진 유저가 존재하는지 DB에서 확인하고 없다면 에러 처리
        // 2. JWT를 발급
        throw new Error('Method not implemented');
    }

    async getUserInfo(userId: string): Promise<UserInfo>{
        //TODO
        // 1. userId를 가진 유저가 존재하는지 DB에서 확인하고 없다면 에러 처리
        // 2. 조회된 데이터를 UserInfo 타입으로 응답

        throw new Error('Method not implemented');
    }

    private async saveUser(name: string, email: string, password: string, signupVerifyToken:string){
        const user = new UsersEntity();
        user.id = ulid();
        user.name = name;
        user.email = email;
        user.password = password;
        user.signupVerifyToken = signupVerifyToken;
        await this.usersRepository.save(user);

    }

    private async saveUserUsingQueryRunner(name: string, email: string, password: string, signupVerifyToken: string){
        const queryRunner = this.dataSource.createQueryRunner();

        await queryRunner.connect();
        await queryRunner.startTransaction();
        try{
            const user = new UsersEntity();
            user.id = ulid();
            user.name = name;
            user.email = email;
            user.password = password;
            user.signupVerifyToken = signupVerifyToken;

            await queryRunner.manager.save(user);
            console.log('try')
            // throw new InternalServerErrorException();   // 일부러 에러를 발생시켜본다.
            await queryRunner.commitTransaction();
        }catch(e){
            //에러가 발생하면 롤백
            console.log("catch")
            await queryRunner.rollbackTransaction();
        }finally{
            console.log("finally")
            // 직접 생성한 QueryRunner는 해제시켜주어야 함
            await queryRunner.release();
        }
    }

    private async saveUserUsingTransaction(name: string, email: string, password: string, signupVerifyToken:string){
        await this.dataSource.transaction(async manager =>{
            const user = new UsersEntity();
            user.id = ulid();
            user.name = name;
            user.email = email;
            user.password = password;
            user.signupVerifyToken = signupVerifyToken;
            await manager.save(user);

            // throw new InternalServerErrorException();
        })
    }
}
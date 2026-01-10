import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/createUser.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import { Repository } from 'typeorm';
import { IUserResponse } from './types/userResponse.interface';
import { sign } from 'jsonwebtoken';
import { LoginDto } from './dto/loginUser.dto';
import { compare } from 'bcrypt';
import { UpdateUserDto } from './dto/updateUser.dto';

@Injectable()
export class UserService {
  constructor(@InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>) {}

  // Register User
  async createUser(createUserDto: CreateUserDto): Promise<IUserResponse> {
    const newUser = new UserEntity();
    Object.assign(newUser, createUserDto);


    const userByEmail = await this.userRepository.findOne({
        where: {
            email: createUserDto.email
        }
    })

    const userByUsername = await this.userRepository.findOne({
        where: {
            username: createUserDto.username
        }
    })

    if(userByEmail || userByUsername) {
        throw new HttpException('Email or username is already taken', HttpStatus.UNPROCESSABLE_ENTITY);
    }

    const saveUser = await this.userRepository.save(newUser);
    return this.generatedUserResponse(saveUser);
  }


  // Login User 
   async loginUser(loginUserDto: LoginDto): Promise<UserEntity> {
    const user = await this.userRepository.findOne({
        where: {
            email: loginUserDto.email,
        },
    });


    if (!user) {
        throw new HttpException(
            'Wrong email or password',
            HttpStatus.UNAUTHORIZED,
        );
    }

    const matchPassword = await compare(loginUserDto.password, user.password);

    if(!matchPassword) {
        throw new HttpException(
            'Wrong email or password',
            HttpStatus.UNAUTHORIZED,
        );
    }

    delete user.password;
     
    return user;
   }

   // Update User
   async updateUser(id_user: string, updateUserDto: UpdateUserDto) {
    const user = await this.findById(id_user);
    Object.assign(user, updateUserDto);

    return await this.userRepository.save(user);
   }

   // Find User by ID
   async findById(id_user: string): Promise<UserEntity> {
    const user = await this.userRepository.findOne({
        where: {
            id_user,
        },
    });

    if(!user) {
        throw new HttpException(`User with ID ${id_user} not found`, HttpStatus.NOT_FOUND)
    }

    return user;
   }


  generateToken(user: UserEntity): string {
    // console.log(process.env.JWT_SECRET) 
    return sign(
        {
            id_user: user.id_user,
            username: user.username,
            email: user.email
        },
        process.env.JWT_SECRET,
        // {
        //     expiresIn: '24h',   // ⬅️ TOKEN AKAN EXPIRED DALAM 1 HARI
        // },
    );
  }


  generatedUserResponse(user: UserEntity): IUserResponse {
    // if (!user.id_user) {
    //     throw new HttpException('User data is missing', HttpStatus.BAD_REQUEST);
    // }

    return {
        user: {
            ...user,
            token: this.generateToken(user),
        },
    };
  }   
}

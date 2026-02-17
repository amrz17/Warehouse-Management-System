import { Body, Controller, Get, HttpStatus, Post, Put, Req, Res, UseGuards, UsePipes, ValidationPipe } from "@nestjs/common";
import { type Response } from 'express';
import { UserService } from "./user.service";
import { CreateUserDto } from "./dto/createUser.dto";
import { IUserResponse } from "./types/userResponse.interface";
import { LoginDto } from "./dto/loginUser.dto";
import { User } from "./decorators/user.decorator";
import { AuthGuard } from "./guards/auth.guard";
import { UpdateUserDto } from "./dto/updateUser.dto";
import { type AuthRequest } from "./types/expressRequest.interface";

@Controller()
export class UserContainerOptions {
    constructor(private readonly userService: UserService) {}

    @Post('users')
    @UsePipes(new ValidationPipe())
    async create(@Body() createUserDto: CreateUserDto): Promise<IUserResponse> {
        return await this.userService.createUser(createUserDto);
    }

    @Post('user/login')
    @UsePipes(new ValidationPipe())
    async loginUser(@Body('user') loginUserDto: LoginDto): Promise<IUserResponse> {
        const user = await this.userService.loginUser(loginUserDto);
        console.log(user);
        return this.userService.generatedUserResponse(user);
    }

    @Post('user/logout')
    @UseGuards(AuthGuard) 
    async logout(@Req() req: AuthRequest) {
        const userId = req.user.id_user; 
        
        // Panggil service untuk mencatat log
        await this.userService.logLogout(userId);
    }


    @Put('user')
    @UseGuards(AuthGuard)
    async updateUser(@User('id_user') userId: string, @Body('user') updateUserDto: UpdateUserDto): Promise<IUserResponse> {
        const updatedUser = await this.userService.updateUser(
            userId,
            updateUserDto
        );

        return this.userService.generatedUserResponse(updatedUser);
    }

    @Get('user')
    @UseGuards(AuthGuard)
    async getCurrentUser(@User() user): Promise<IUserResponse> {
        console.log('user', user)
        return this.userService.generatedUserResponse(user);
    }
}
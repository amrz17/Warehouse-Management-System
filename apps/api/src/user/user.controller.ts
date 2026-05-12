import { Body, Controller, Get, HttpStatus, Post, Put, Req, Res, UseGuards, UsePipes, ValidationPipe, UseInterceptors, UploadedFile, BadRequestException } from "@nestjs/common";
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { randomUUID } from 'crypto';
import { UserService } from "./user.service";
import { CreateUserDto } from "./dto/createUser.dto";
import { IUserResponse } from "./types/userResponse.interface";
import { LoginDto } from "./dto/loginUser.dto";
import { User } from "./decorators/user.decorator";
import { AuthGuard } from "./guards/auth.guard";
import { UpdateUserDto } from "./dto/updateUser.dto";
import { type AuthRequest } from "./types/expressRequest.interface";
import { Roles } from "./decorators/roles.decorator";
import { RolesGuard } from "./guards/roles.guard";
import { UserRole } from "./user.entity";


@Controller()
export class UserContainerOptions {
    constructor(private readonly userService: UserService) {}

    @Post('users')
    @UsePipes(new ValidationPipe())
    @UseGuards(RolesGuard)
    @Roles(UserRole.ADMIN, UserRole.MANAGER)
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
    async logout(@Req() req: AuthRequest) {
        const userId = req.user.id_user; 
        
        // Panggil service untuk mencatat log
        await this.userService.logLogout(userId);
    }


    @Put('user')
    @UseGuards(AuthGuard)
    @UseInterceptors(
        FileInterceptor('avatar', {
            storage: diskStorage({
                destination: join(__dirname, '..', '..', '..', 'uploads', 'avatars'),
                filename: (_req, file, cb) => {
                    const uniqueName = `${randomUUID()}${extname(file.originalname)}`;
                    cb(null, uniqueName);
                },
            }),
            limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
            fileFilter: (_req, file, cb) => {
                const allowed = ['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml'];
                if (!allowed.includes(file.mimetype)) {
                    return cb(new BadRequestException('Only PNG, JPG, WebP, and SVG images are allowed'), false);
                }
                cb(null, true);
            },
        })
    )
    async updateUser(
        @User('id_user') userId: string, 
        @Body() updateUserDto: UpdateUserDto,
        @UploadedFile() file: Express.Multer.File | undefined,
    ): Promise<IUserResponse> {
        const avatarUrl = file ? `/uploads/avatars/${file.filename}` : undefined;
        
        const updatedUser = await this.userService.updateUser(
            userId,
            updateUserDto,
            avatarUrl
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
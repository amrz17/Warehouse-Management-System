import { Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction } from "express";
import { UserService } from "../user.service";
import { AuthRequest } from "../types/expressRequest.interface";
import { UserEntity } from "../user.entity";
import { JwtService } from '@nestjs/jwt'; // Pastikan import ini ada
import { verify } from "jsonwebtoken";



@Injectable()
export class AuthMiddleware implements NestMiddleware {
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService
    ) {}

    async use(req: AuthRequest, res: Response, next: NextFunction) {
        // console.log('headers : ', req.headers);

        if (!req.headers.authorization) {
            req.user = new UserEntity();
            next();
            return;
        }

        const token = req.headers.authorization.split(' ')[1];

        try {
            // const decode = verify(token, process.env.JWT_SECRET as string);
            const decode = this.jwtService.verify(token, { 
                secret: process.env.JWT_SECRET 
                }) as { id_user: string }; // <--- Penegasan tipe di sini
            // console.log(decode)
            const user = await this.userService.findById(decode.id_user);

            // // Tambahkan baris ini untuk mendefinisikan bentuk token Anda
            // const decode = this.jwtService.verify(token, { secret: process.env.JWT_SECRET }) as { id_user: string };

            // // Sekarang TypeScript tidak akan protes lagi
            // const user = await this.userService.findById(decode.id_user);

            req.user = user;
            next(); 

        } catch (err) {
            req.user = new UserEntity();

            next();
        }

    }
}
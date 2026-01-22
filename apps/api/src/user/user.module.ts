import { MiddlewareConsumer, Module, NestModule, RequestMethod } from "@nestjs/common";
import { UserContainerOptions } from "./user.controller";
import { UserService } from "./user.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserEntity } from "./user.entity";
import { AuthMiddleware } from "./middleware/auth.middleware";
import { InboundEntity } from "../inbound/entities/inbound.entity";
import { OrderEntity } from "../orders/entities/orders.entity";

@Module({
    imports: [TypeOrmModule.forFeature([
        UserEntity,
        OrderEntity,
        InboundEntity
    ])],
    controllers: [UserContainerOptions],
    providers: [UserService],
    exports: [UserService],
})
export class UserModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(AuthMiddleware)
    //     .exclude(
    //     { path: 'api/user/login', method: RequestMethod.POST },
    //     { path: 'api/users', method: RequestMethod.POST }
    //   )
        .forRoutes({path: '*', method: RequestMethod.ALL});
    }
}
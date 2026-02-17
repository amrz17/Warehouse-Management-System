import { MiddlewareConsumer, Module, NestModule, RequestMethod } from "@nestjs/common";
import { UserContainerOptions } from "./user.controller";
import { UserService } from "./user.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserEntity } from "./user.entity";
import { AuthMiddleware } from "./middleware/auth.middleware";
import { InboundEntity } from "../inbound/entities/inbound.entity";
import { OrderEntity } from "../orders/entities/orders.entity";
import { InventoryEntity } from "../inventory/inventory.entity";
import { OutboundEntity } from "../outbound/entities/outbound.entity";
import { SalesOrderEntity } from "../sales/entities/sales-order.entity";
import { ActivityLogsEntity } from "../activity-logs/entities/activity-logs.entity";
import { JwtModule } from '@nestjs/jwt';
import { ActivityLogsModule } from "../activity-logs/activity-logs.module";

@Module({
    imports: [TypeOrmModule.forFeature([
        UserEntity,
        OrderEntity,
        InboundEntity,
        InventoryEntity,
        SalesOrderEntity,
        OutboundEntity,
        ActivityLogsEntity
    ]),
    JwtModule.register({
        secret: process.env.JWT_SECRET,
        signOptions: { expiresIn: '1d' },
    }),
    ActivityLogsModule
    ],
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
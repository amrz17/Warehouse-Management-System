import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderEntity } from './orders.entity';
import { SupplierEntity } from '../suppliers/suppliers.entity';
import { PurchaseOrderItemsEntity } from '../purchase-order-items/order-items.entity';
import { UserEntity } from '../user/user.entity';
import { InboundEntity } from '../inbound/inbound.entity';

@Module({
  imports: [TypeOrmModule.forFeature([
    OrderEntity,
    UserEntity,
    SupplierEntity,
    PurchaseOrderItemsEntity,
    InboundEntity
  ])],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}

// @Module({
//     imports: [TypeOrmModule.forFeature([UserEntity])],
//     controllers: [UserContainerOptions],
//     providers: [UserService],
//     exports: [UserService],
// })
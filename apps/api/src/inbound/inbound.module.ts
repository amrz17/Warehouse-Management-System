import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InboundController } from './inbound.controller';
import { InboundService } from './inbound.service';
import { InboundEntity } from './entities/inbound.entity';
import { InboundItemEntity } from './entities/inbound-item.entity';
import { PurchaseOrderItemsEntity } from '../orders/entities/order-items.entity';
import { ItemsEntity } from '../items/items.entity';
import { UserEntity } from '../user/user.entity';
import { SupplierEntity } from '../suppliers/suppliers.entity';
import { OrderEntity } from '../orders/entities/orders.entity';

@Module({
    imports: [TypeOrmModule.forFeature([
        InboundEntity,
        InboundItemEntity,
        OrderEntity,
        PurchaseOrderItemsEntity,
        ItemsEntity,
        UserEntity,
        SupplierEntity
    ])],
    controllers: [InboundController],
    providers: [InboundService],
})
export class InboundModule {}

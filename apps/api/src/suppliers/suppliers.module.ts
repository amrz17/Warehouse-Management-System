import { Module } from '@nestjs/common';
import { SuppliersService } from './suppliers.service';
import { SuppliersController } from './suppliers.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SupplierEntity } from './suppliers.entity';
import { OrderEntity } from 'src/orders/orders.entity';

@Module({
  imports: [TypeOrmModule.forFeature([
    SupplierEntity,
    OrderEntity
  ])],
  providers: [SuppliersService],
  controllers: [SuppliersController]
})
export class SuppliersModule {}

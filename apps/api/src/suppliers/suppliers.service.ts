import { Injectable, NotFoundException } from '@nestjs/common';
import { SupplierEntity } from './suppliers.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { ISupplierResponse } from './types/supplierResponse.interface';
import { UpdateSupplierDto } from './dto/update-supplier.dto';
import { SuperAgentTest } from 'supertest';

@Injectable()
export class SuppliersService {
    constructor(@InjectRepository(SupplierEntity) private readonly supplierRepository: Repository<SupplierEntity>) {}

    // 
    async getAllSuppliers(): Promise<SupplierEntity[]> {
        return await this.supplierRepository.find({})
    }

    // create Supplier
    async createSupplier(createSupplierDto: CreateSupplierDto): Promise<SupplierEntity> {
        const newSupplier = new SupplierEntity(); 
        Object.assign(newSupplier, createSupplierDto);

        return await this.supplierRepository.save(newSupplier);
    }

    // update Supplier
    async updateSupplier(
        id_supplier: string,
        updateSupplierDto: UpdateSupplierDto
    ): Promise<SupplierEntity> {
        const supplier = await this.supplierRepository.findOne({ where: { id_supplier }})

        if (!supplier) {
            throw new NotFoundException("Supplier not found!")
        }

        Object.assign(supplier, updateSupplierDto);

        return await this.supplierRepository.save(supplier)

    }

    // 
    async deleteSupplier(
        id_supplier: string
    ): Promise<void> {
        await this.supplierRepository.delete({ id_supplier})
    }

    // response 
    generateResponseSupplier(
       supplier: SupplierEntity | SupplierEntity[]
    ): ISupplierResponse {
        return {
            success: true,
            supplier: supplier
        }
    }
}

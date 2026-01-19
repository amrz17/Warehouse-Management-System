import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Post, Put } from '@nestjs/common';
import { SuppliersService } from './suppliers.service';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { ISupplierResponse } from './types/supplierResponse.interface';
import { UpdateSupplierDto } from './dto/update-supplier.dto';

@Controller('suppliers')
export class SuppliersController {
    constructor(private readonly  supplierService: SuppliersService) {}

    //
    @Get()
    async getAllSuppliers(): Promise<ISupplierResponse> {
        const suppliers = await this.supplierService.getAllSuppliers();

        return this.supplierService.generateResponseSupplier(suppliers);
    }

    // 
    @Post('')
    async createSupplier(
        @Body() createSupplierDto: CreateSupplierDto
    ): Promise<ISupplierResponse> {
        const newSupplier = await this.supplierService.createSupplier(createSupplierDto);

        return this.supplierService.generateResponseSupplier(newSupplier);
    }

    // 
    @Put('/update/:id_supplier')
    async updateSupplier(
        @Param('id_supplier', new ParseUUIDPipe()) id_supplier: string,
        @Body() updateSupplierDto: UpdateSupplierDto
    ): Promise<ISupplierResponse> {
        const supplier = await this.supplierService.updateSupplier(id_supplier, updateSupplierDto);

        return this.supplierService.generateResponseSupplier(supplier);
    }

    // 
    @Delete('/delete/:id_supplier')
    async deleteSupplier(
        @Param('id_supplier', new ParseUUIDPipe()) id_supplier: string
    ): Promise<any> {
        await this.supplierService.deleteSupplier(id_supplier);
        return {
            sucess: true,
            message: "Delete Supplier Data Success!"
        }
    }

}

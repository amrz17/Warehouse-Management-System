import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Post, Put, Req, UseGuards } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { CreateInventoryDto } from './dto/create-inventory.dto';
import { IInventoryResponse } from './types/inventoryResponse.interface';
import { UpdateInventoryDto } from './dto/update-inventory.dto';
import { AuthGuard } from '../user/guards/auth.guard';
import { type AuthRequest } from '../user/types/expressRequest.interface';
// import { JwtAuthGuard } from 'src/user/guards/jwt-auth.guard';

@Controller('inventory')
export class InventoryController {
    constructor(private readonly inventoryService: InventoryService) {}

    // Get All
    @Get()
    async getAllInventory(): Promise<IInventoryResponse> {
        const inventorys = await this.inventoryService.getAllInventory();
        return this.inventoryService.generateResponseInventory(inventorys);
    }

    // create Inventory
    @Post()
    @UseGuards(AuthGuard)
    async createInventory(
        @Body() createInventoryDto: CreateInventoryDto,
        @Req() req: AuthRequest
    ): Promise<IInventoryResponse> {
        const userId = req.user.id_user;
        const newInventory = await this.inventoryService.createInventory(createInventoryDto, userId);

        return this.inventoryService.generateResponseInventory(newInventory);
    }

    // update Inventory
    @Put('update/:id_inventory')
    @UseGuards(AuthGuard)
    async updateInventory(
        @Param('id_inventory', new ParseUUIDPipe()) id_inventory: string,
        @Body() updateInventoryDto: UpdateInventoryDto,
        @Req() req: AuthRequest
    ): Promise<IInventoryResponse> {
        const userId = req.user.id_user;
        const updateInventory = await this.inventoryService.updateInventory(id_inventory, updateInventoryDto, userId)

        return this.inventoryService.generateResponseInventory(updateInventory);
    }

    // delete inventory
    @Delete('delete/:id_inventory')
    @UseGuards(AuthGuard)
    async deleteInventory(
        @Param('id_inventory', new ParseUUIDPipe()) id_inventory: string,
        @Req() req: AuthRequest
    ): Promise<void> {
        const userId = req.user.id_user;
        return this.inventoryService.deleteInventory(id_inventory, userId)
    }
}


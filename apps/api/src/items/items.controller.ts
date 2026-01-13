import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Post, Put } from '@nestjs/common';
import { ItemsService } from './items.service';
import { CreateItemDto } from './dto/create-item.dto';
import { IItemResponse } from './types/itemsResponse.interface';
import { UpdateItemDto } from './dto/update-item.dto';

@Controller('items')
export class ItemsController {
    //
    constructor(private readonly itemService: ItemsService) {}

    // get All Items
    @Get('')
    async getAllItems(): Promise<IItemResponse> {
        const items = await this.itemService.getAllItems();

        return this.itemService.generatedItemResponse(items);
    }

    // create Item
    @Post('')
    async createItem(@Body() createItemDto: CreateItemDto): Promise<IItemResponse> {
        const saveItem = await this.itemService.createItem(createItemDto);

        return this.itemService.generatedItemResponse(saveItem);
    }

    // update Item
    @Put('update/:id_item')
    async updateItem(
        @Param('id_item', new ParseUUIDPipe()) id_item: string,
        @Body() updateItemDto: UpdateItemDto
    ): Promise<IItemResponse> {
        const updateItem = await this.itemService.updateItem(id_item, updateItemDto);

        return this.itemService.generatedItemResponse(updateItem);
    }

    // delete Item
    @Delete('delete/:id_item')
    async deleteItem(
        @Param('id_item', new ParseUUIDPipe()) id_item: string
    ): Promise<void> {
        return this.itemService.deleteItem(id_item);
    }
}

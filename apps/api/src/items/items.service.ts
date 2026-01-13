import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ItemsEntity } from './items.entity';
import { CreateItemDto } from './dto/create-item.dto';
import { IItemResponse } from './types/itemsResponse.interface';
import { UpdateItemDto } from './dto/update-item.dto';
import { create } from 'domain';

@Injectable()
export class ItemsService {
  constructor(
    @InjectRepository(ItemsEntity)
    private readonly itemRepository: Repository<ItemsEntity>,
  ) {}

  // Get All Items
  async getAllItems(): Promise<ItemsEntity[]> {
    return this.itemRepository.find({
      order: {
        created_at: 'DESC'
      }
    })
  }

  // Create Item
  async createItem(createItemDto: CreateItemDto): Promise<ItemsEntity> {
    const newItem = new ItemsEntity();
    Object.assign(newItem, createItemDto);

    return this.itemRepository.save(newItem);
  }

  // Edit Item
  async updateItem(id_item: string, updateItemDto: UpdateItemDto): Promise<ItemsEntity> {
    const item = await this.itemRepository.findOne({ where: { id_item }})

    if (!item) {
      throw new NotFoundException('Item not found');
    }

    Object.assign(item, updateItemDto);

    return this.itemRepository.save(item);
  }

  // Delete Item
  async deleteItem(id_item: string): Promise<void> {
    await this.itemRepository.delete({ id_item })
  }

  generatedItemResponse(
    item: ItemsEntity | ItemsEntity[],
  ): IItemResponse {
    return {
      success: true,
      items: item,
    };
  }
}

// src/database/seeds/location.seed.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LocationEntity } from '../locations/locations.entity';
import { Repository } from 'typeorm';

@Injectable()
export class LocationSeedService {
  constructor(
    @InjectRepository(LocationEntity)
    private readonly locationRepo: Repository<LocationEntity>,
  ) {}

  async run() {
    const masterData = [
      { bin_code: 'RCV-ZONE-01', description: 'Area Inbound' },
      { bin_code: 'STG-A1-01-1', description: 'Rak A1-01 Level 1' },
      { bin_code: 'STG-A1-01-2', description: 'Rak A1-01 Level 2' },
      {
        bin_code: 'STG-B1-01-1',
        description: 'Rak Utama Aisle B1 Tingkat 1',
      },
      { bin_code: 'SHP-ZONE-01', description: 'Area Outbound' },
      {
        bin_code: 'DMG-ZONE-01',
        description: 'Area Karantina Barang Rusak',
      },
    ];

    for (const data of masterData) {
      const exists = await this.locationRepo.findOne({ where: { bin_code: data.bin_code } });
      if (!exists) {
        await this.locationRepo.save(this.locationRepo.create(data));
      }
    }
    console.log('Location seeds completed!');
  }
}
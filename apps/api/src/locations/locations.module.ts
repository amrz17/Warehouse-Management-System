import { Module } from '@nestjs/common';
import { LocationsService } from './locations.service';
import { LocationsController } from './locations.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LocationEntity } from './locations.entity';
import { LocationSeedService } from '../seeds/location.seed.service';

@Module({
  imports: [TypeOrmModule.forFeature([LocationEntity])],
  providers: [LocationsService, LocationSeedService],
  controllers: [LocationsController]
})
export class LocationsModule {}

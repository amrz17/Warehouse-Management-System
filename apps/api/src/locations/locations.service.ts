import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LocationEntity } from './locations.entity';
import { Repository } from 'typeorm';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { ILocationResponse } from './types/locationResponse.interface';

@Injectable()
export class LocationsService {
    constructor(
        @InjectRepository(LocationEntity)
        private readonly locationRepository: Repository<LocationEntity>
    ) {}

    // Get All
    async getAllLocations(): Promise<LocationEntity | LocationEntity[]> {
        return this.locationRepository.find({
            order: {
                created_at: 'DESC'
            }
        })
    }

    // Create  Location
    async createLocation(createLocationDto: CreateLocationDto): Promise<LocationEntity> {
        const newLocation = new LocationEntity;
        Object.assign(newLocation, createLocationDto);

        return this.locationRepository.save(newLocation);
    }

    // Update 
    async updateLocation(id_location: string, updateLocationDto: UpdateLocationDto): Promise<LocationEntity> {
        const location = await this.locationRepository.findOne({ where: { id_location }})

        if (!location) {
            throw new NotFoundException('Loction not found');
        }

        Object.assign(location, updateLocationDto);

        return this.locationRepository.save(location);
    }
    
    // Delete
    async deleteLocation(id_location: string): Promise<void> {
        await this.locationRepository.delete({ id_location})
    }

    // 
    async generateLocationResponse(
        location: LocationEntity | LocationEntity[]
    ): Promise<ILocationResponse> {
        return {
            success: true,
            location: location
        }
    }


}

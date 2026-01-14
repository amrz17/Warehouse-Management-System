import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Post, Put } from '@nestjs/common';
import { LocationsService } from './locations.service';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { ILocationResponse } from './types/locationResponse.interface';

@Controller('locations')
export class LocationsController {
    constructor(private readonly locationService: LocationsService) {}

    // Get All 
    @Get()
    async getAllLocation(): Promise<any> {
        const locations = await this.locationService.getAllLocations();

        return this.locationService.generateLocationResponse(locations);
    }

    // Create Location
    @Post()
    async createLocation(
        @Body() createLocationDto: CreateLocationDto
    ): Promise<ILocationResponse> {
        const newLocation = await this.locationService.createLocation(createLocationDto)

        return this.locationService.generateLocationResponse(newLocation);
    }

    // Update Location
    @Put('update/:id_location')
    async updateLocation(
        @Param('id_location', new ParseUUIDPipe()) id_location: string,
        @Body() updateLocationDto: UpdateLocationDto
    ): Promise<ILocationResponse> {
        const updateLocation = await this.locationService.updateLocation(id_location, updateLocationDto)
    
        return this.locationService.generateLocationResponse(updateLocation);
    }

    // Delete
    @Delete('delete/:id_location')
    async deleteLocation(
        @Param('id_location', new ParseUUIDPipe()) id_loction: string
    ): Promise<void> {
        return this.locationService.deleteLocation(id_loction);
    }

}

// src/seed.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { LocationSeedService } from '../src/seeds/location.seed.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  
  const seedService = app.get(LocationSeedService);
  
  try {
    await seedService.run();
    console.log('Seeding successful');
  } catch (error) {
    console.error('Seeding failed', error);
  } finally {
    await app.close();
  }
}

bootstrap();
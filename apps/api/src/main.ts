import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,               // Untuk menghapus field yang tidak ada di DTO
    forbidNonWhitelisted: true,    // Error jika ada field tambahan di luar DTO
    transform: true,               // Mengubah type ke type sesuai DTO
  }));

  app.enableCors({
    origin: "http://localhost:5173", // URL React
    credentials: true,               // WAJIB untuk cookie
  });
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();

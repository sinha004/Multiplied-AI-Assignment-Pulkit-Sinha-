import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from '../src/app.module';

// Cache the app instance
let app;

export default async function handler(req, res) {
  if (!app) {
    app = await NestFactory.create(AppModule);

    // Enable CORS for frontend
    app.enableCors({
      origin: process.env.FRONTEND_URL ? [process.env.FRONTEND_URL, 'http://localhost:5173', 'http://localhost:3000'] : ['http://localhost:5173', 'http://localhost:3000'],
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
      credentials: true,
    });

    // Global validation pipe (matching main.ts)
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        transformOptions: {
          enableImplicitConversion: true,
        },
      }),
    );

    await app.init();
  }

  const instance = app.getHttpAdapter().getInstance();
  return instance(req, res);
}

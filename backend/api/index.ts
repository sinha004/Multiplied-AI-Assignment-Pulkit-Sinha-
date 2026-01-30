import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from '../src/app.module';

// Cache the app instance
let app;

export default async function handler(req, res) {
  if (!app) {
    app = await NestFactory.create(AppModule);

    // Enable CORS for frontend
    const allowedOrigins = [
      'http://localhost:5173',
      'http://localhost:3000',
      ...(process.env.FRONTEND_URL ? [process.env.FRONTEND_URL] : []),
    ];

    app.enableCors({
      origin: (origin, callback) => {
        // Allow no origin (e.g. mobile apps, curl)
        if (!origin) return callback(null, true);
        
        // Allow allowedOrigins
        if (allowedOrigins.includes(origin)) return callback(null, true);
        
        // Allow all vercel.app deployments (previews, etc.)
        if (origin.endsWith('.vercel.app')) return callback(null, true);
        
        callback(new Error('Not allowed by CORS'));
      },
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
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

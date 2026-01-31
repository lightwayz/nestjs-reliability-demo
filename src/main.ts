/* eslint-disable */
// noinspection JSIgnoredPromiseFromCall

import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    // bufferLogs: true, // enable if you later plug in a custom logger
  });

  // --- Config ---
  const port = process.env.PORT ? Number(process.env.PORT) : 3000;

  // --- CORS (safe defaults for demos) ---
  app.enableCors({
    origin: true, // allow all origins for demo; tighten in prod
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // --- Global Validation (ATS-safe best practice) ---
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // strips unknown fields
      forbidNonWhitelisted: true, // throws if unknown fields sent
      transform: true, // transforms payloads to DTO instances
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  // Optional: set a global prefix so all APIs are under /api
  // app.setGlobalPrefix('api');

  // --- Swagger ---
   
  const config = new DocumentBuilder()
     
    .setTitle('NestJS Ticketing Demo API')
    .setDescription(
      'Demo API showcasing modular architecture, auth/RBAC, orders, payments, and notifications.',
    )
    .setVersion('1.0.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
        description: 'Paste JWT access token here',
        in: 'header',
      },
      'bearer',
    )
    .build();

   
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  await app.listen(port);

  const url = await app.getUrl();
   
  console.log(`✅ API running: ${url}`);
   
  console.log(`📚 Swagger:    ${url}/docs`);
}

// noinspection JSIgnoredPromiseFromCall
bootstrap();

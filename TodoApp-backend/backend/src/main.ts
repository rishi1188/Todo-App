/**
 * main.ts
 *
 * Bootstraps the Nest application:
 * - Enables CORS so the React Native app (running from a device/emulator,
 *   not a browser origin) can call the API.
 * - Applies a global ValidationPipe so every DTO's class-validator
 *   decorators are actually enforced, and unknown properties in request
 *   bodies are stripped rather than silently accepted.
 */

import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // strip properties not declared in the DTO
      forbidNonWhitelisted: false,
      transform: true, // auto-convert payloads to DTO instances/types
    }),
  );

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  // eslint-disable-next-line no-console
  console.log(`Backend listening on http://localhost:${port}`);
}
bootstrap();

import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express';
import { AppModule } from './app.module';

const server = express();
let nestApp: any;

async function bootstrap() {
  if (!nestApp) {
    const app = await NestFactory.create(
      AppModule,
      new ExpressAdapter(server),
    );
    await app.init();
    nestApp = app;
  }
  return server;
}

export default async function handler(req: any, res: any) {
  const app = await bootstrap();
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return,@typescript-eslint/no-unsafe-argument
  return app(req, res);
}

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { runDb } from './db/db';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  runDb()
  await app.listen(4000);
}
bootstrap();

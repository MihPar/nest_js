import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app.module';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from 'exceptionFilters.ts/exceptionFilter';
import { appSettings } from 'setting';
import { useContainer } from 'class-validator';

const PORT = process.env.PORT || 5000

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors()
  useContainer(app.select(AppModule), { fallbackOnErrors: true })
  appSettings(app)
  await app.listen(PORT);
}
bootstrap();
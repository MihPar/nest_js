import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app.module';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from 'exceptionFilter';
import { appSettings } from 'setting';

const PORT = process.env.PORT || 5000

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors()
//   app.useGlobalPipes(new ValidationPipe())
//   app.useGlobalFilters(new HttpExceptionFilter())
  appSettings(app)
  await app.listen(PORT);
}
bootstrap();
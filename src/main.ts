import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/moduls';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors()
  await app.listen(4000);
}
bootstrap();
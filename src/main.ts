import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app.module';

const PORT = process.env.PORT || 5000

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors()
  await app.listen(PORT);
}
bootstrap();
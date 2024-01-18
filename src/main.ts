import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app.module';
import { appSettings } from './setting';
import { useContainer } from 'class-validator';

const PORT = process.env.PORT || 5000

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  appSettings(app)
  await app.listen(PORT);
}
bootstrap();
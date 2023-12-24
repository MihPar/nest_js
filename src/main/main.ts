import { NestFactory } from '@nestjs/core';
import { AppModule } from 'src/modules/IPCollection.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors()
  await app.listen(4000);
}
bootstrap();

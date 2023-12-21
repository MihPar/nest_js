import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DeviceClass, DeviceSchema } from 'src/schema/device.schema';
import { SecurityDevice } from 'src/api/securityDevices/device.controller';
import { DeviceQueryRepository } from 'src/api/securityDevices/deviceQuery.repository';
import { JWTService } from 'src/api/jwt/jwt.service';
import { DeviceService } from 'src/api/securityDevices/device.service';
import { DeviceRepositories } from 'src/api/securityDevices/device.repository';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGO_URL, {
      dbName: process.env.MONGOOSE_DB_NAME,
      // loggerLevel: 'debug'
    }),
    MongooseModule.forFeature([{ name: DeviceClass.name, schema: DeviceSchema }])
  ],
  controllers: [SecurityDevice],
  providers: [DeviceQueryRepository, JWTService, DeviceService, DeviceRepositories],
})
export class AppModule {}

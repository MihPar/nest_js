import { BadRequestException, INestApplication, INestApplicationContext, ValidationError, ValidationPipe } from "@nestjs/common";
import cookieParser from "cookie-parser";
import { HttpExceptionFilter } from "./exceptionFilters.ts/exceptionFilter";
import { AppModule } from "./modules/app.module";

export const appSettings = (app: INestApplication): void => {
  app.use(cookieParser());
  useContainer(app.select(AppModule), { fallbackOnError: true });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      stopAtFirstError: true,
      exceptionFactory: (errors: ValidationError[]): void => {
        const errorsForResp: any[] = [];
        errors.forEach((err: ValidationError): void => {
          const keys: string[] = Object.keys(err.constraints!);
          keys.forEach((k: string): void => {
            errorsForResp.push({
              message: err.constraints![k],
              field: err.property,
            });
          });
        });
        throw new BadRequestException(errorsForResp);
      },
    }),
  );
  app.enableCors();
  app.useGlobalFilters(new HttpExceptionFilter());
}


function useContainer(arg0: INestApplicationContext, arg1: { fallbackOnError: boolean; }) {
	throw new Error("Function not implemented.");
}
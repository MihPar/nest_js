import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";

@Module(
	{
		imports: [
			MongooseModule.forRoot([{name: Product.name, schema: ProductSchena }]),
		],
		controllers: [ProductController],
		providers: [ProductService] 
	}
) 

export class ProductsModule {}
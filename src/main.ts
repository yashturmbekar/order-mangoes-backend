import { NestFactory } from "@nestjs/core";
import { AppModule } from "./orders/app.module";
import * as dotenv from "dotenv";
dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Use the port provided by Railway or default to 3000
  const port = process.env.PORT || 3000;
  await app.listen(port);
}
bootstrap();

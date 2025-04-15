import { NestFactory } from "@nestjs/core";
import { AppModule } from "./orders/app.module";
import * as dotenv from "dotenv";
import { corsConfig } from "./config";

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Use CORS configuration from the config file
  app.enableCors(corsConfig);

  const port = process.env.PORT || 3000;
  await app.listen(port);
}
bootstrap();

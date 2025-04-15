import { NestFactory } from "@nestjs/core";
import { AppModule } from "./orders/app.module";
import * as dotenv from "dotenv";

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ✅ Enable CORS for your frontend domain
  app.enableCors({
    origin: ['https://mango.goprobaba.com'], // add localhost too if needed
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  const port = process.env.PORT || 3000;
  await app.listen(port);
}
bootstrap();

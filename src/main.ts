import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, //just take fields that exists in the dto input
    }),
  );
  await app.listen(process.env.PORT ?? 8080);
}
bootstrap();

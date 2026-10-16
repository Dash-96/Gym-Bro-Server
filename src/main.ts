import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { abortOnError: false });

  const config = new DocumentBuilder()
    .setTitle('GymBro API')
    .setDescription('GymBro backend API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api/docs', app, document);

  app.setGlobalPrefix("api")
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();

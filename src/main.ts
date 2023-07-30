import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

const PORT = process.env.PORT || 5000
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors()
  const config = new DocumentBuilder()
    .setTitle('flyfartrips')
    .setDescription('flyfartrips description')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('flyfartrips')
    .build();
  const document = SwaggerModule.createDocument(app,config);
  SwaggerModule.setup('api', app, document);
  app.enableCors();
  await app.listen(PORT);
}
bootstrap();

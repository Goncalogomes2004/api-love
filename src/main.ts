import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as fs from 'fs';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ✅ Permitir CORS de qualquer origem
  app.enableCors({
    origin: '*', // permite pedidos de qualquer origem
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // 📘 Swagger config
  const config = new DocumentBuilder()
    .setTitle('Love API')
    .setDescription('API para gerir Users, Folders e Photos')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  // 💾 Exportar OpenAPI JSON
  fs.writeFileSync('./openapi.json', JSON.stringify(document, null, 2));

  await app.listen(3000);
  console.log(`🚀 Servidor a correr em: ${await app.getUrl()}`);
}
bootstrap();

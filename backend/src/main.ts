import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);

  const portRaw = config.get('PORT');
  const port = typeof portRaw === 'string' ? parseInt(portRaw, 10) : (portRaw ?? 3000);

  await app.listen(port);

  console.log(`Food Rescue API running on http://localhost:${port}`);
}

bootstrap();
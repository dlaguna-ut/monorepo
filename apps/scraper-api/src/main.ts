import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AppLogger } from './common/logger/app.logger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });
  app.useLogger(new AppLogger());
  app.enableCors();
  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();

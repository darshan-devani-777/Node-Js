import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as mongoose from 'mongoose';

async function bootstrap() {
  mongoose.connection.on('connected', () => {
    console.log('MongoDB Connected...!');
  });

  mongoose.connection.on('error', (err) => {
    console.error('MongoDB connection error:', err.message);
  });

  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
  console.log(`🚀 Server Start at http://localhost:3000`);
}
bootstrap();

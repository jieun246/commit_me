import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CommitmeController } from './commitme/commitme.controller';

@Module({
  imports: [MongooseModule.forRoot('mongodb://127.0.0.1:27017/commitme')],
  controllers: [AppController, CommitmeController],
  providers: [AppService],
})
export class AppModule {}

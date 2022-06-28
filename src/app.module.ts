import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AccountModule } from './account/account.module';
import { AttendanceModule } from './attendance/attendance.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://127.0.0.1:27017/commitme'),
    AccountModule,
    AttendanceModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

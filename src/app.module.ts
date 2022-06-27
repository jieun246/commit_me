import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AttendanceService } from './attendance/attendance.service';
import { AccountService } from './account/account.service';
import { AttendanceController } from './attendance/attendance.controller';
import { AccountController } from './account/account.controller';

@Module({
  imports: [MongooseModule.forRoot('mongodb://127.0.0.1:27017/commitme')],
  controllers: [AppController, AttendanceController, AccountController],
  providers: [AppService, AttendanceService, AccountService],
})
export class AppModule {}

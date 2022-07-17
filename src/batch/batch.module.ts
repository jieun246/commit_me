import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { AccountModule } from 'src/account/account.module';
import { AttendanceModule } from 'src/attendance/attendance.module';
import { HistoryModule } from 'src/history/history.module';
import { BatchService } from './batch.service';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    HistoryModule,
    AttendanceModule,
    AccountModule,
  ],
  providers: [BatchService],
})
export class BatchModule {}

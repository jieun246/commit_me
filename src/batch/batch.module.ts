import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { HistoryModule } from 'src/history/history.module';
import { BatchService } from './batch.service';

@Module({
  imports: [ScheduleModule.forRoot(), HistoryModule],
  providers: [BatchService],
})
export class BatchModule {}

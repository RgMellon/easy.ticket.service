import { Module } from '@nestjs/common';
import { TicketModule } from './modules/ticket/ticket.module';

@Module({
  imports: [TicketModule],
})
export class AppModule {}

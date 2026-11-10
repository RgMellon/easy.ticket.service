import { Module } from '@nestjs/common';
import { TicketController } from './interface/ticket.controller';

@Module({
  controllers: [TicketController],
})
export class TicketModule {}

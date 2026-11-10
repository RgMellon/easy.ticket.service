import { Body, Controller, Param, Patch, Post } from '@nestjs/common';
import { CreateTicketDto } from './dto/ticket.dto';
import { randomUUID } from 'crypto';

@Controller('tickets')
export class TicketController {
  @Post()
  create(@Body() dto: CreateTicketDto) {
    return { id: randomUUID() };
  }

  @Patch(':id/complete')
  complete(@Param('id') id: string) {
    return { ticketId: id, status: 'COMPLETED' };
  }
}

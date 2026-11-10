import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { CreateTicketUseCase } from '../application/use-cases/create.ticket.use-case';
import { CompleteTicketUseCase } from '../application/use-cases/complete.ticket.use-case';
import { GetTicketUseCase } from '../application/use-cases/get.ticket.use-case';
import { CreateTicketDto, TicketResponseDto } from './dto/ticket.dto';

@Controller('tickets')
export class TicketController {
  constructor(
    private readonly createTicket: CreateTicketUseCase,
    private readonly completeTicket: CompleteTicketUseCase,
    private readonly getTicket: GetTicketUseCase,
  ) {}

  @Post()
  async create(@Body() dto: CreateTicketDto): Promise<TicketResponseDto> {
    const ticket = await this.createTicket.execute(dto);
    return TicketResponseDto.fromEntity(ticket);
  }

  @Get(':id')
  async get(@Param('id') id: string): Promise<TicketResponseDto> {
    const ticket = await this.getTicket.execute(id);
    return TicketResponseDto.fromEntity(ticket);
  }

  @Patch(':id/complete')
  async complete(@Param('id') id: string): Promise<TicketResponseDto> {
    const ticket = await this.completeTicket.execute(id);
    return TicketResponseDto.fromEntity(ticket);
  }
}

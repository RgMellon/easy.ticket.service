import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { TicketRepository } from '../../domain/ticket.repository';
import { TICKET_REPOSITORY_TOKEN } from '../../domain/ticket.repository';
import { TicketEntity } from '../../domain/ticket.entity';

@Injectable()
export class GetTicketUseCase {
  constructor(
    @Inject(TICKET_REPOSITORY_TOKEN)
    private readonly repo: TicketRepository,
  ) {}

  async execute(id: string): Promise<TicketEntity> {
    const ticket = await this.repo.findById(id);

    if (!ticket) throw new NotFoundException(`Ticket ${id} not found`);

    return ticket;
  }
}

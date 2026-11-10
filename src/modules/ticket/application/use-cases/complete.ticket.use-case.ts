import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { TicketRepository, TICKET_REPOSITORY_TOKEN } from '../../domain/ticket.repository';
import { TicketEntity } from '../../domain/ticket.entity';

@Injectable()
export class CompleteTicketUseCase {
  constructor(
    @Inject(TICKET_REPOSITORY_TOKEN)
    private readonly repo: TicketRepository,
  ) {}

  async execute(id: string): Promise<TicketEntity> {
    const ticket = await this.repo.findById(id);

    if (!ticket) throw new NotFoundException(`Ticket ${id} not found`);

    return this.repo.save({
      ...ticket,
      status: 'COMPLETED',
      completedAt: new Date(),
    });
  }
}

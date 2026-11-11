import { Inject, Injectable } from '@nestjs/common';
import type { TicketRepository } from '../../domain/ticket.repository';
import { TICKET_REPOSITORY_TOKEN } from '../../domain/ticket.repository';
import { TicketEntity } from '../../domain/ticket.entity';

interface CreateTicketInput {
  clientId: string;
  name?: string;
  description?: string;
}

@Injectable()
export class CreateTicketUseCase {
  constructor(
    @Inject(TICKET_REPOSITORY_TOKEN)
    private readonly repo: TicketRepository,
  ) {}

  async execute(input: CreateTicketInput): Promise<TicketEntity> {
    const name = input.name ?? this.generateName();
    return this.repo.create({
      name,
      clientId: input.clientId,
      description: input.description ?? null,
      status: 'OPEN',
      completedAt: null,
    });
  }

  private generateName(): string {
    const number = Math.floor(Math.random() * 99999) + 1;
    return `EAS-${String(number).padStart(5, '0')}`;
  }
}

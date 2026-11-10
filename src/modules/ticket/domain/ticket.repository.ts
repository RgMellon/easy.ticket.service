import { TicketEntity } from './ticket.entity';

export interface TicketRepository {
  create(ticket: Omit<TicketEntity, 'id' | 'createdAt'>): Promise<TicketEntity>;
  findById(id: string): Promise<TicketEntity | null>;
  save(ticket: TicketEntity): Promise<TicketEntity>;
}

export const TICKET_REPOSITORY_TOKEN = Symbol('TICKET_REPOSITORY_TOKEN');

export type TicketStatus = 'OPEN' | 'COMPLETED';

export interface TicketEntity {
  id: string;
  name: string;
  description?: string | null;
  clientId: string;
  status: TicketStatus;
  createdAt: Date;
  completedAt?: Date | null;
}

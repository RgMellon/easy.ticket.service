import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../infra/database/prisma.service';
import { TicketRepository } from '../../domain/ticket.repository';
import { TicketEntity } from '../../domain/ticket.entity';

@Injectable()
export class TicketPrismaRepository implements TicketRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(ticket: Omit<TicketEntity, 'id' | 'createdAt'>): Promise<TicketEntity> {
    return this.prisma.ticket.create({ data: ticket });
  }

  async findById(id: string): Promise<TicketEntity | null> {
    return this.prisma.ticket.findUnique({ where: { id } });
  }

  async save(ticket: TicketEntity): Promise<TicketEntity> {
    return this.prisma.ticket.update({
      where: { id: ticket.id },
      data: ticket,
    });
  }
}

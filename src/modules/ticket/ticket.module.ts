import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../infra/database/database.module';
import { TICKET_REPOSITORY_TOKEN } from './domain/ticket.repository';
import { TicketPrismaRepository } from './infra/persistence/ticket.prisma.repository';
import { CreateTicketUseCase } from './application/use-cases/create.ticket.use-case';
import { CompleteTicketUseCase } from './application/use-cases/complete.ticket.use-case';
import { GetTicketUseCase } from './application/use-cases/get.ticket.use-case';
import { TicketController } from './interface/ticket.controller';

@Module({
  imports: [DatabaseModule],
  controllers: [TicketController],
  providers: [
    { provide: TICKET_REPOSITORY_TOKEN, useClass: TicketPrismaRepository },
    CreateTicketUseCase,
    CompleteTicketUseCase,
    GetTicketUseCase,
  ],
})
export class TicketModule {}

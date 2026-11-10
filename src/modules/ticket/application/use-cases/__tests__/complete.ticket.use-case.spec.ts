import { NotFoundException } from '@nestjs/common';
import { CompleteTicketUseCase } from '../complete.ticket.use-case';
import { TicketRepository } from '../../../domain/ticket.repository';
import { TicketEntity } from '../../../domain/ticket.entity';

const makeRepo = (): jest.Mocked<TicketRepository> => ({
  create: jest.fn(),
  findById: jest.fn(),
  save: jest.fn(),
});

const makeTicket = (overrides: Partial<TicketEntity> = {}): TicketEntity => ({
  id: 'uuid-1',
  name: 'EAS-00001',
  clientId: 'client-123',
  description: null,
  status: 'OPEN',
  createdAt: new Date(),
  completedAt: null,
  ...overrides,
});

describe('CompleteTicketUseCase', () => {
  let useCase: CompleteTicketUseCase;
  let repo: jest.Mocked<TicketRepository>;

  beforeEach(() => {
    repo = makeRepo();
    useCase = new CompleteTicketUseCase(repo);
  });

  it('completa ticket existente (status → COMPLETED, completedAt preenchido)', async () => {
    const ticket = makeTicket();
    const completed = makeTicket({ status: 'COMPLETED', completedAt: new Date() });
    repo.findById.mockResolvedValue(ticket);
    repo.save.mockResolvedValue(completed);

    const result = await useCase.execute('uuid-1');

    expect(repo.save).toHaveBeenCalledWith(expect.objectContaining({
      status: 'COMPLETED',
      completedAt: expect.any(Date),
    }));
    expect(result.status).toBe('COMPLETED');
    expect(result.completedAt).toBeInstanceOf(Date);
  });

  it('lança NotFoundException quando ticket não existe', async () => {
    repo.findById.mockResolvedValue(null);

    await expect(useCase.execute('uuid-inexistente')).rejects.toThrow(NotFoundException);
  });
});

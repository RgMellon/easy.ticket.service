import { NotFoundException } from '@nestjs/common';
import { GetTicketUseCase } from '../get.ticket.use-case';
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

describe('GetTicketUseCase', () => {
  let useCase: GetTicketUseCase;
  let repo: jest.Mocked<TicketRepository>;

  beforeEach(() => {
    repo = makeRepo();
    useCase = new GetTicketUseCase(repo);
  });

  it('retorna ticket pelo id', async () => {
    const ticket = makeTicket();
    repo.findById.mockResolvedValue(ticket);

    const result = await useCase.execute('uuid-1');

    expect(repo.findById).toHaveBeenCalledWith('uuid-1');
    expect(result).toEqual(ticket);
  });

  it('lança NotFoundException quando ticket não existe', async () => {
    repo.findById.mockResolvedValue(null);

    await expect(useCase.execute('uuid-inexistente')).rejects.toThrow(NotFoundException);
  });
});

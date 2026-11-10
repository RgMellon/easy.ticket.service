import { CreateTicketUseCase } from '../create.ticket.use-case';
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

describe('CreateTicketUseCase', () => {
  let useCase: CreateTicketUseCase;
  let repo: jest.Mocked<TicketRepository>;

  beforeEach(() => {
    repo = makeRepo();
    useCase = new CreateTicketUseCase(repo);
  });

  it('cria ticket com name fornecido', async () => {
    const ticket = makeTicket({ name: 'EAS-00042' });
    repo.create.mockResolvedValue(ticket);

    const result = await useCase.execute({ clientId: 'client-123', name: 'EAS-00042' });

    expect(repo.create).toHaveBeenCalledWith(expect.objectContaining({ name: 'EAS-00042' }));
    expect(result.name).toBe('EAS-00042');
  });

  it('gera name EAS-XXXXX quando não fornecido', async () => {
    const ticket = makeTicket();
    repo.create.mockResolvedValue(ticket);

    await useCase.execute({ clientId: 'client-123' });

    const { name } = repo.create.mock.calls[0][0];
    expect(name).toMatch(/^EAS-\d{5}$/);
  });

  it('cria ticket sem description (campo opcional)', async () => {
    const ticket = makeTicket({ description: null });
    repo.create.mockResolvedValue(ticket);

    await useCase.execute({ clientId: 'client-123', name: 'EAS-00001' });

    expect(repo.create).toHaveBeenCalledWith(expect.objectContaining({ description: null }));
  });
});

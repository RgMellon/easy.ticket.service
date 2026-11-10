import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { TicketEntity } from '../../domain/ticket.entity';

export class CreateTicketDto {
  @IsString()
  @IsNotEmpty()
  clientId: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;
}

export interface TicketResponseDto {
  id: string;
  name: string;
  description?: string | null;
  clientId: string;
  status: string;
  createdAt: Date;
  completedAt?: Date | null;
}

export namespace TicketResponseDto {
  export function fromEntity(entity: TicketEntity): TicketResponseDto {
    return {
      id: entity.id,
      name: entity.name,
      description: entity.description,
      clientId: entity.clientId,
      status: entity.status,
      createdAt: entity.createdAt,
      completedAt: entity.completedAt,
    };
  }
}

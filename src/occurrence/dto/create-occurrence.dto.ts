import { IsNotEmpty, IsEnum, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum Prioridade {
  BAIXA = 'BAIXA',
  MEDIA = 'MEDIA',
  ALTA = 'ALTA',
  CRITICA = 'CRITICA',
}

export class CreateOccurrenceDto {
  @ApiProperty({
    example: 'Incêndio',
    description: 'Tipo de ocorrência (ex: Incêndio, Resgate, Emergência)',
  })
  @IsNotEmpty({ message: 'O tipo de ocorrência é obrigatório.' })
  @IsString()
  tipo: string;

  @ApiProperty({
    example: 'Rua das Flores, 123, Recife - PE',
    description: 'Endereço completo da ocorrência',
  })
  @IsNotEmpty({ message: 'O endereço é obrigatório.' })
  @IsString()
  endereco: string;

  @ApiProperty({
    example: 'MEDIA',
    enum: Prioridade,
    description: 'Prioridade da ocorrência',
    default: 'MEDIA',
  })
  @IsEnum(Prioridade, { message: 'Prioridade inválida.' })
  prioridade: Prioridade;

  @ApiProperty({
    example: 'Incêndio em residência. Fogo iniciado na cozinha. Bombeiros em deslocamento.',
    description: 'Descrição detalhada da ocorrência',
  })
  @IsNotEmpty({ message: 'A descrição é obrigatória.' })
  @IsString()
  descricao: string;
}


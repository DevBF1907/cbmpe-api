import { IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSignatureDto {
  @ApiProperty({
    example: '76948000-a060-4b83-aade-8c9da712d8dc',
    description: 'ID da ocorrência à qual a assinatura será vinculada',
  })
  @IsNotEmpty({ message: 'O ID da ocorrência é obrigatório.' })
  @IsUUID('4', { message: 'O ID da ocorrência deve ser um UUID válido.' })
  occurrenceId: string;

  @ApiProperty({
    example: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...',
    description: 'Assinatura digital em formato Base64 (data URI)',
  })
  @IsNotEmpty({ message: 'A assinatura é obrigatória.' })
  @IsString()
  assinatura: string;
}


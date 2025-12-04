/* eslint-disable @typescript-eslint/no-unsafe-call */
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    example: 'João Silva',
    description: 'Nome completo do militar',
  })
  @IsNotEmpty({ message: 'O nome é obrigatório.' })
  nome: string;

  @ApiProperty({
    example: 'joao.silva@cbm.pe.gov.br',
    description: 'Email institucional do CBMPE',
  })
  @IsEmail({}, { message: 'O email informado é inválido.' })
  email: string;

  @ApiProperty({
    example: 'Sargento',
    description: 'Patente do militar',
  })
  @IsNotEmpty({ message: 'A patente é obrigatória.' })
  patente: string;

  @ApiProperty({
    example: '1º GB - Recife',
    description: 'Unidade do militar',
  })
  @IsNotEmpty({ message: 'A unidade é obrigatória.' })
  unidade: string;

  @ApiProperty({
    example: 'SenhaForte123',
    description: 'Senha com no mínimo 6 caracteres',
  })
  @MinLength(6, { message: 'A senha deve ter no mínimo 6 caracteres.' })
  senha: string;
}

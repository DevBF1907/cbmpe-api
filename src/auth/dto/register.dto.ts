import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({
    example: 'Rafael Monteiro da Silva',
    description: 'Nome completo do militar',
  })
  @IsNotEmpty()
  nome: string;

  @ApiProperty({
    example: 'rafael.monteiro@cbmpe.gov.br',
    description: 'Email institucional do CBMPE',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'Soldado',
    description: 'Patente do militar',
  })
  @IsNotEmpty()
  patente: string;

  @ApiProperty({
    example: 'CBMPE - Quartel do Derby',
    description: 'Unidade do militar',
  })
  @IsNotEmpty()
  unidade: string;

  @ApiProperty({
    example: 'SenhaForte123',
    description: 'Senha com no mínimo 6 caracteres',
    minLength: 6,
  })
  @MinLength(6)
  senha: string;
}

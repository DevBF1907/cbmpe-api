import { IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({
    example: 'rafael.monteiro@cbmpe.gov.br',
    description: 'Email institucional do CBMPE',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'SenhaForte123',
    description: 'Senha do usuário',
  })
  @IsNotEmpty()
  senha: string;
}

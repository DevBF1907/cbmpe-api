/* eslint-disable prettier/prettier */
import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Req,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiUnauthorizedResponse,
  ApiConflictResponse,
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { Request } from 'express';
import { JwtPayload } from './types/jwt-payload';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Registrar novo usuário' })
  @ApiCreatedResponse({
    description: 'Usuário registrado com sucesso',
    schema: {
      type: 'object',
      properties: {
        user: {
          type: 'object',
          properties: {
            id: { type: 'string', example: '76948000-a060-4b83-aade-8c9da712d8dc' },
            nome: { type: 'string', example: 'Rafael Monteiro da Silva' },
            email: { type: 'string', example: 'rafael.monteiro@cbmpe.gov.br' },
            patente: { type: 'string', example: 'Soldado' },
            unidade: { type: 'string', example: 'CBMPE - Quartel do Derby' },
            createdAt: { type: 'string', example: '2025-12-06T03:20:04.087Z' },
            updatedAt: { type: 'string', example: '2025-12-06T03:20:04.087Z' },
          },
        },
        token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' },
      },
    },
  })
  @ApiConflictResponse({ description: 'Email já está em uso' })
  @ApiBadRequestResponse({ description: 'Dados inválidos ou campos obrigatórios ausentes' })
  @ApiBody({ type: RegisterDto })
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  @ApiOperation({ summary: 'Fazer login' })
  @ApiOkResponse({
    description: 'Login realizado com sucesso',
    schema: {
      type: 'object',
      properties: {
        user: {
          type: 'object',
          properties: {
            id: { type: 'string', example: '76948000-a060-4b83-aade-8c9da712d8dc' },
            nome: { type: 'string', example: 'Rafael Monteiro da Silva' },
            email: { type: 'string', example: 'rafael.monteiro@cbmpe.gov.br' },
            patente: { type: 'string', example: 'Soldado' },
            unidade: { type: 'string', example: 'CBMPE - Quartel do Derby' },
            createdAt: { type: 'string', example: '2025-12-06T03:20:04.087Z' },
            updatedAt: { type: 'string', example: '2025-12-06T03:20:04.087Z' },
          },
        },
        token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' },
      },
    },
  })
  @ApiUnauthorizedResponse({ description: 'Credenciais inválidas' })
  @ApiBadRequestResponse({ description: 'Dados inválidos ou campos obrigatórios ausentes' })
  @ApiBody({ type: LoginDto })
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obter dados do usuário autenticado' })
  @ApiOkResponse({
    description: 'Dados do usuário autenticado',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: '76948000-a060-4b83-aade-8c9da712d8dc' },
        nome: { type: 'string', example: 'Rafael Monteiro da Silva' },
        email: { type: 'string', example: 'rafael.monteiro@cbmpe.gov.br' },
        patente: { type: 'string', example: 'Soldado' },
        unidade: { type: 'string', example: 'CBMPE - Quartel do Derby' },
      },
    },
  })
  @ApiUnauthorizedResponse({ description: 'Token inválido ou ausente' })
  me(@Req() req: Request & { user: JwtPayload }) {
    return this.authService.me(req.user.sub);
  }
}

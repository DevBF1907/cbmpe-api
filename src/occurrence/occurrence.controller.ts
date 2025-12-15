/* eslint-disable prettier/prettier */
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import {
  ApiTags,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiBearerAuth,
  ApiBody,
} from '@nestjs/swagger';
import { OccurrenceService } from './occurrence.service';
import { CreateOccurrenceDto } from './dto/create-occurrence.dto';
import { UpdateOccurrenceDto } from './dto/update-occurrence.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { JwtPayload } from '../auth/types/jwt-payload';

@ApiTags('Occurrences')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('occurrences')
export class OccurrenceController {
  constructor(private readonly occurrenceService: OccurrenceService) {}

  @Post()
  @ApiCreatedResponse({
    description: 'Ocorrência criada com sucesso.',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: 'abc123-def456-ghi789' },
        tipo: { type: 'string', example: 'Incêndio' },
        endereco: { type: 'string', example: 'Rua das Flores, 123, Recife - PE' },
        prioridade: { type: 'string', enum: ['BAIXA', 'MEDIA', 'ALTA', 'CRITICA'], example: 'ALTA' },
        descricao: { type: 'string', example: 'Incêndio em residência...' },
        userId: { type: 'string', example: '76948000-a060-4b83-aade-8c9da712d8dc' },
        user: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            nome: { type: 'string', example: 'Rafael Monteiro' },
            email: { type: 'string', example: 'rafael@cbmpe.gov.br' },
            patente: { type: 'string', example: 'Soldado' },
            unidade: { type: 'string', example: 'CBMPE - Quartel do Derby' },
          },
        },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
      },
    },
  })
  @ApiBody({ type: CreateOccurrenceDto })
  create(
    @Body() dto: CreateOccurrenceDto,
    @Req() req: Request & { user: JwtPayload },
  ) {
    return this.occurrenceService.create(dto, req.user.sub);
  }

  @Get()
  @ApiOkResponse({
    description: 'Lista todas as ocorrências cadastradas.',
  })
  findAll() {
    return this.occurrenceService.findAll();
  }

  @Get(':id')
  @ApiOkResponse({
    description: 'Retorna os dados de uma ocorrência.',
  })
  @ApiNotFoundResponse({
    description: 'Ocorrência não encontrada.',
  })
  findOne(@Param('id') id: string) {
    return this.occurrenceService.findOne(id);
  }

  @Patch(':id')
  @ApiOkResponse({
    description: 'Ocorrência atualizada com sucesso.',
  })
  update(@Param('id') id: string, @Body() dto: UpdateOccurrenceDto) {
    return this.occurrenceService.update(id, dto);
  }

  @Delete(':id')
  @ApiOkResponse({
    description: 'Ocorrência removida com sucesso.',
  })
  remove(@Param('id') id: string) {
    return this.occurrenceService.remove(id);
  }
}


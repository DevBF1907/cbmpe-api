/* eslint-disable prettier/prettier */
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiBearerAuth,
  ApiBody,
  ApiQuery,
} from '@nestjs/swagger';
import { SignatureService } from './signature.service';
import { CreateSignatureDto } from './dto/create-signature.dto';
import { UpdateSignatureDto } from './dto/update-signature.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('Signatures')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('signatures')
export class SignatureController {
  constructor(private readonly signatureService: SignatureService) {}

  @Post()
  @ApiCreatedResponse({
    description: 'Assinatura digital criada com sucesso.',
  })
  @ApiBody({ type: CreateSignatureDto })
  create(@Body() dto: CreateSignatureDto) {
    return this.signatureService.create(dto);
  }

  @Get()
  @ApiOkResponse({
    description: 'Lista todas as assinaturas cadastradas.',
  })
  @ApiQuery({
    name: 'occurrenceId',
    required: false,
    description: 'Filtrar assinaturas por ID da ocorrência',
  })
  findAll(@Query('occurrenceId') occurrenceId?: string) {
    if (occurrenceId) {
      return this.signatureService.findByOccurrence(occurrenceId);
    }
    return this.signatureService.findAll();
  }

  @Get(':id')
  @ApiOkResponse({
    description: 'Retorna os dados de uma assinatura.',
  })
  @ApiNotFoundResponse({
    description: 'Assinatura não encontrada.',
  })
  findOne(@Param('id') id: string) {
    return this.signatureService.findOne(id);
  }

  @Patch(':id')
  @ApiOkResponse({
    description: 'Assinatura atualizada com sucesso.',
  })
  update(@Param('id') id: string, @Body() dto: UpdateSignatureDto) {
    return this.signatureService.update(id, dto);
  }

  @Delete(':id')
  @ApiOkResponse({
    description: 'Assinatura removida com sucesso.',
  })
  remove(@Param('id') id: string) {
    return this.signatureService.remove(id);
  }
}


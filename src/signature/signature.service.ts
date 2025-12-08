import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSignatureDto } from './dto/create-signature.dto';
import { UpdateSignatureDto } from './dto/update-signature.dto';

@Injectable()
export class SignatureService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateSignatureDto) {
    // Verificar se a ocorrência existe
    const occurrence = await this.prisma.occurrence.findUnique({
      where: { id: data.occurrenceId },
    });

    if (!occurrence) {
      throw new NotFoundException('Ocorrência não encontrada');
    }

    return await this.prisma.signature.create({
      data,
      include: {
        occurrence: {
          select: {
            id: true,
            tipo: true,
            endereco: true,
            prioridade: true,
          },
        },
      },
    });
  }

  async findAll() {
    return await this.prisma.signature.findMany({
      include: {
        occurrence: {
          select: {
            id: true,
            tipo: true,
            endereco: true,
            prioridade: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findByOccurrence(occurrenceId: string) {
    // Verificar se a ocorrência existe
    const occurrence = await this.prisma.occurrence.findUnique({
      where: { id: occurrenceId },
    });

    if (!occurrence) {
      throw new NotFoundException('Ocorrência não encontrada');
    }

    return await this.prisma.signature.findMany({
      where: { occurrenceId },
      include: {
        occurrence: {
          select: {
            id: true,
            tipo: true,
            endereco: true,
            prioridade: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const signature = await this.prisma.signature.findUnique({
      where: { id },
      include: {
        occurrence: {
          select: {
            id: true,
            tipo: true,
            endereco: true,
            prioridade: true,
          },
        },
      },
    });

    if (!signature) {
      throw new NotFoundException('Assinatura não encontrada');
    }
    return signature;
  }

  async update(id: string, data: UpdateSignatureDto) {
    await this.findOne(id);
    return await this.prisma.signature.update({
      where: { id },
      data,
      include: {
        occurrence: {
          select: {
            id: true,
            tipo: true,
            endereco: true,
            prioridade: true,
          },
        },
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return await this.prisma.signature.delete({
      where: { id },
    });
  }
}


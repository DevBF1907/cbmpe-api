import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOccurrenceDto } from './dto/create-occurrence.dto';
import { UpdateOccurrenceDto } from './dto/update-occurrence.dto';

@Injectable()
export class OccurrenceService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateOccurrenceDto, userId: string) {
    return await this.prisma.occurrence.create({
      data: {
        ...data,
        userId,
      },
      include: {
        user: {
          select: {
            id: true,
            nome: true,
            email: true,
            patente: true,
            unidade: true,
          },
        },
      },
    });
  }

  async findAll() {
    return await this.prisma.occurrence.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            nome: true,
            email: true,
            patente: true,
            unidade: true,
          },
        },
      },
    });
  }

  async findOne(id: string) {
    const occurrence = await this.prisma.occurrence.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            nome: true,
            email: true,
            patente: true,
            unidade: true,
          },
        },
      },
    });

    if (!occurrence) {
      throw new NotFoundException('Ocorrência não encontrada');
    }
    return occurrence;
  }

  async update(id: string, data: UpdateOccurrenceDto) {
    await this.findOne(id);
    return await this.prisma.occurrence.update({
      where: { id },
      data,
      include: {
        user: {
          select: {
            id: true,
            nome: true,
            email: true,
            patente: true,
            unidade: true,
          },
        },
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return await this.prisma.occurrence.delete({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            nome: true,
            email: true,
            patente: true,
            unidade: true,
          },
        },
      },
    });
  }
}


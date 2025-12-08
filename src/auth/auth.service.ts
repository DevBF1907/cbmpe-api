/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable prettier/prettier */
import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
  ) {}


  async register(dto: RegisterDto) {
    const userExists = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (userExists) {
      throw new ConflictException('Email já está em uso');
    }

    const hash = await bcrypt.hash(dto.senha, 10);

    const user = await this.prisma.user.create({
      data: {
        nome: dto.nome,
        email: dto.email,
        patente: dto.patente,
        unidade: dto.unidade,
        senha: hash,
      },
      select: {
        id: true,
        nome: true,
        email: true,
        patente: true,
        unidade: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    const token = this.generateToken(user.id);

    return { user, token };
  }


  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) throw new UnauthorizedException('Credenciais inválidas');

    const valid = await bcrypt.compare(dto.senha, user.senha);

    if (!valid) throw new UnauthorizedException('Credenciais inválidas');

    const token = this.generateToken(user.id);

    const { senha: _, ...userWithoutPassword } = user;

    return { user: userWithoutPassword, token };
  }


  generateToken(userId: string | number) {
    return this.jwt.sign({ sub: userId });
  }

 
  async me(userId: string) {
    return this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        nome: true,
        email: true,
        patente: true,
        unidade: true,
      },
    });
  }
}

import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';

describe('AuthController (e2e)', () => {
  let app: INestApplication<App>;
  let prisma: PrismaService;
  let createdUserId: string;
  let authToken: string;

  const testUser = {
    nome: 'Usuário Teste Auth E2E',
    email: `teste.auth.e2e.${Date.now()}@cbmpe.gov.br`,
    patente: 'Soldado',
    unidade: 'CBMPE - Teste Auth E2E',
    senha: 'Teste123456',
  };

  beforeAll(async () => {
    const databaseUrl = process.env.DATABASE_URL;
    
    if (!databaseUrl) {
      throw new Error('DATABASE_URL não está configurada');
    }

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
      }),
    );

    await app.init();

    prisma = moduleFixture.get<PrismaService>(PrismaService);
  }, 30000);

  afterAll(async () => {
    if (prisma) {
      try {
        if (createdUserId) {
          await prisma.user.deleteMany({
            where: { email: testUser.email },
          });
        }
        await prisma.$disconnect();
      } catch (error) {
        console.error('Erro ao limpar dados de teste:', error);
      }
    }
    if (app) {
      await app.close();
    }
  }, 30000);

  it('deve criar um novo usuário com sucesso', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/register')
      .send(testUser)
      .expect(201);

    expect(response.body).toHaveProperty('user');
    expect(response.body).toHaveProperty('token');
    expect(response.body.user.email).toBe(testUser.email);
    expect(response.body.user).not.toHaveProperty('senha');

    createdUserId = response.body.user.id;
    authToken = response.body.token;
  });

  it('deve retornar erro 409 ao tentar registrar email duplicado', async () => {
    await request(app.getHttpServer())
      .post('/auth/register')
      .send(testUser)
      .expect(409);
  });

  it('deve fazer login com credenciais válidas', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: testUser.email,
        senha: testUser.senha,
      })
      .expect(response => {
        expect([200, 201]).toContain(response.status);
      });

    expect(response.body).toHaveProperty('user');
    expect(response.body).toHaveProperty('token');
    expect(response.body.user).not.toHaveProperty('senha');
  });

  it('deve retornar erro 401 com credenciais inválidas', async () => {
    await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: testUser.email,
        senha: 'senhaErrada',
      })
      .expect(401);
  });

  it('deve retornar dados do usuário autenticado', async () => {
    const response = await request(app.getHttpServer())
      .get('/auth/me')
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200);

    expect(response.body).toHaveProperty('id');
    expect(response.body).toHaveProperty('email');
    expect(response.body).not.toHaveProperty('senha');
    expect(response.body.email).toBe(testUser.email);
  });

  it('deve retornar erro 401 sem token', async () => {
    await request(app.getHttpServer())
      .get('/auth/me')
      .expect(401);
  });

  it('deve retornar erro 400 ao enviar dados inválidos', async () => {
    await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        nome: '',
        email: 'email-invalido',
        senha: '123',
      })
      .expect(400);
  });
});

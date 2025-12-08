import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';

describe('UsersController (e2e)', () => {
  let app: INestApplication<App>;
  let prisma: PrismaService;
  let authToken: string;
  let testUserId: string;
  let createdUserId: string;

  const testUser = {
    nome: 'Usuário Teste User E2E',
    email: `teste.user.e2e.${Date.now()}@cbmpe.gov.br`,
    patente: 'Soldado',
    unidade: 'CBMPE - Teste User E2E',
    senha: 'Teste123456',
  };

  const testUser2 = {
    nome: 'Usuário 2 Teste User E2E',
    email: `teste.user2.e2e.${Date.now()}@cbmpe.gov.br`,
    patente: 'Capitão',
    unidade: 'CBMPE - Teste User E2E 2',
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

    // Criar usuário e obter token
    const registerResponse = await request(app.getHttpServer())
      .post('/auth/register')
      .send(testUser);

    authToken = registerResponse.body.token;
    testUserId = registerResponse.body.user.id;
  }, 30000);

  afterAll(async () => {
    if (prisma) {
      try {
        if (createdUserId) {
          await prisma.user.deleteMany({
            where: { id: createdUserId },
          });
        }
        if (testUserId) {
          await prisma.user.deleteMany({
            where: { email: testUser.email },
          });
        }
        await prisma.user.deleteMany({
          where: { email: testUser2.email },
        });
        await prisma.$disconnect();
      } catch (error) {
        console.error('Erro ao limpar dados de teste:', error);
      }
    }
    if (app) {
      await app.close();
    }
  }, 30000);

  it('deve criar um novo usuário', async () => {
    const response = await request(app.getHttpServer())
      .post('/users')
      .set('Authorization', `Bearer ${authToken}`)
      .send(testUser2)
      .expect(201);

    expect(response.body).toHaveProperty('id');
    expect(response.body.email).toBe(testUser2.email);
    createdUserId = response.body.id;
  });

  it('deve listar todos os usuários', async () => {
    const response = await request(app.getHttpServer())
      .get('/users')
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200);

    expect(Array.isArray(response.body)).toBe(true);
  });

  it('deve buscar um usuário por ID', async () => {
    const response = await request(app.getHttpServer())
      .get(`/users/${testUserId}`)
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200);

    expect(response.body.id).toBe(testUserId);
    expect(response.body.email).toBe(testUser.email);
  });

  it('deve atualizar um usuário', async () => {
    const updateData = { nome: 'Nome Atualizado' };
    const response = await request(app.getHttpServer())
      .patch(`/users/${testUserId}`)
      .set('Authorization', `Bearer ${authToken}`)
      .send(updateData)
      .expect(200);

    expect(response.body.nome).toBe(updateData.nome);
  });

  it('deve deletar um usuário', async () => {
    // Criar usuário temporário para deletar
    const createResponse = await request(app.getHttpServer())
      .post('/users')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        ...testUser2,
        email: `temp.${Date.now()}@cbmpe.gov.br`,
      });

    await request(app.getHttpServer())
      .delete(`/users/${createResponse.body.id}`)
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200);
  });

  it('deve retornar erro 401 sem token', async () => {
    await request(app.getHttpServer())
      .post('/users')
      .send(testUser2)
      .expect(401);
  });

  it('deve retornar erro 400 com dados inválidos', async () => {
    await request(app.getHttpServer())
      .post('/users')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ nome: '', email: 'email-invalido' })
      .expect(400);
  });

  it('deve retornar erro 404 para ID inexistente', async () => {
    const fakeId = '00000000-0000-0000-0000-000000000000';
    await request(app.getHttpServer())
      .get(`/users/${fakeId}`)
      .set('Authorization', `Bearer ${authToken}`)
      .expect(404);
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';

describe('OccurrenceController (e2e)', () => {
  let app: INestApplication<App>;
  let prisma: PrismaService;
  let authToken: string;
  let testUserId: string;
  let createdOccurrenceId: string;

  const testUser = {
    nome: 'Usuário Teste E2E',
    email: `teste.e2e.${Date.now()}@cbmpe.gov.br`,
    patente: 'Soldado',
    unidade: 'CBMPE - Teste E2E',
    senha: 'Teste123456',
  };

  const testOccurrence = {
    tipo: 'Incêndio',
    endereco: 'Rua das Flores, 123, Recife - PE',
    prioridade: 'ALTA',
    descricao: 'Incêndio em residência. Fogo iniciado na cozinha.',
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
        if (testUserId) {
          await prisma.user.deleteMany({
            where: { email: testUser.email },
          });
        }
        if (createdOccurrenceId) {
          await (prisma as any).occurrence.deleteMany({
            where: { id: createdOccurrenceId },
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

  it('deve criar uma nova ocorrência', async () => {
    const response = await request(app.getHttpServer())
      .post('/occurrences')
      .set('Authorization', `Bearer ${authToken}`)
      .send(testOccurrence)
      .expect(201);

    expect(response.body).toHaveProperty('id');
    expect(response.body.tipo).toBe(testOccurrence.tipo);
    createdOccurrenceId = response.body.id;
  });

  it('deve listar todas as ocorrências', async () => {
    const response = await request(app.getHttpServer())
      .get('/occurrences')
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200);

    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThanOrEqual(1);
  });

  it('deve buscar uma ocorrência por ID', async () => {
    const response = await request(app.getHttpServer())
      .get(`/occurrences/${createdOccurrenceId}`)
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200);

    expect(response.body.id).toBe(createdOccurrenceId);
    expect(response.body.tipo).toBe(testOccurrence.tipo);
  });

  it('deve atualizar uma ocorrência', async () => {
    const updateData = { prioridade: 'CRITICA' };
    const response = await request(app.getHttpServer())
      .patch(`/occurrences/${createdOccurrenceId}`)
      .set('Authorization', `Bearer ${authToken}`)
      .send(updateData)
      .expect(200);

    expect(response.body.prioridade).toBe(updateData.prioridade);
  });

  it('deve deletar uma ocorrência', async () => {
    // Criar ocorrência temporária para deletar
    const createResponse = await request(app.getHttpServer())
      .post('/occurrences')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        tipo: 'Resgate',
        endereco: 'Av. Teste',
        prioridade: 'MEDIA',
        descricao: 'Teste',
      });

    await request(app.getHttpServer())
      .delete(`/occurrences/${createResponse.body.id}`)
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200);
  });

  it('deve retornar erro 401 sem token', async () => {
    await request(app.getHttpServer())
      .post('/occurrences')
      .send(testOccurrence)
      .expect(401);
  });

  it('deve retornar erro 400 com dados inválidos', async () => {
    await request(app.getHttpServer())
      .post('/occurrences')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ tipo: '' })
      .expect(400);
  });

  it('deve retornar erro 404 para ID inexistente', async () => {
    const fakeId = '00000000-0000-0000-0000-000000000000';
    await request(app.getHttpServer())
      .get(`/occurrences/${fakeId}`)
      .set('Authorization', `Bearer ${authToken}`)
      .expect(404);
  });
});

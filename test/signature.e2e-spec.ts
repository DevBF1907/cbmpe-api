import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';

describe('SignatureController (e2e)', () => {
  let app: INestApplication<App>;
  let prisma: PrismaService;
  let authToken: string;
  let testUserId: string;
  let createdOccurrenceId: string;
  let createdSignatureId: string;

  const testUser = {
    nome: 'Usuário Teste Signature E2E',
    email: `teste.signature.e2e.${Date.now()}@cbmpe.gov.br`,
    patente: 'Soldado',
    unidade: 'CBMPE - Teste Signature E2E',
    senha: 'Teste123456',
  };

  const testOccurrence = {
    tipo: 'Incêndio',
    endereco: 'Rua das Flores, 123, Recife - PE',
    prioridade: 'ALTA',
    descricao: 'Ocorrência para teste de assinatura',
  };

  const testSignature = {
    assinatura: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
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

    const registerResponse = await request(app.getHttpServer())
      .post('/auth/register')
      .send(testUser);

    authToken = registerResponse.body.token;
    testUserId = registerResponse.body.user.id;

    const occurrenceResponse = await request(app.getHttpServer())
      .post('/occurrences')
      .set('Authorization', `Bearer ${authToken}`)
      .send(testOccurrence);

    createdOccurrenceId = occurrenceResponse.body.id;
  }, 30000);

  afterAll(async () => {
    if (prisma) {
      try {
        if (createdSignatureId) {
          await (prisma as any).signature.deleteMany({
            where: { id: createdSignatureId },
          });
        }
        if (createdOccurrenceId) {
          await (prisma as any).occurrence.deleteMany({
            where: { id: createdOccurrenceId },
          });
        }
        if (testUserId) {
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

  it('deve criar uma assinatura com sucesso', async () => {
    const response = await request(app.getHttpServer())
      .post('/signatures')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        ...testSignature,
        occurrenceId: createdOccurrenceId,
      })
      .expect(201);

    expect(response.body).toHaveProperty('id');
    expect(response.body.occurrenceId).toBe(createdOccurrenceId);
    createdSignatureId = response.body.id;
  });

  it('deve listar todas as assinaturas', async () => {
    const response = await request(app.getHttpServer())
      .get('/signatures')
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200);

    expect(Array.isArray(response.body)).toBe(true);
  });

  it('deve buscar uma assinatura por ID', async () => {
    const response = await request(app.getHttpServer())
      .get(`/signatures/${createdSignatureId}`)
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200);

    expect(response.body.id).toBe(createdSignatureId);
  });

  it('deve atualizar uma assinatura', async () => {
    const newSignature = 'data:image/png;base64,NOVA_ASSINATURA_BASE64';
    const response = await request(app.getHttpServer())
      .patch(`/signatures/${createdSignatureId}`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({ assinatura: newSignature })
      .expect(200);

    expect(response.body.assinatura).toBe(newSignature);
  });

  it('deve deletar uma assinatura', async () => {
    const createResponse = await request(app.getHttpServer())
      .post('/signatures')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        ...testSignature,
        occurrenceId: createdOccurrenceId,
      });

    await request(app.getHttpServer())
      .delete(`/signatures/${createResponse.body.id}`)
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200);
  });

  it('deve retornar erro 401 sem token', async () => {
    await request(app.getHttpServer())
      .post('/signatures')
      .send({
        ...testSignature,
        occurrenceId: createdOccurrenceId,
      })
      .expect(401);
  });

  it('deve retornar erro 400 com dados inválidos', async () => {
    await request(app.getHttpServer())
      .post('/signatures')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ occurrenceId: 'uuid-invalido' })
      .expect(400);
  });

  it('deve retornar erro 404 para ID inexistente', async () => {
    const fakeId = '00000000-0000-0000-0000-000000000000';
    await request(app.getHttpServer())
      .get(`/signatures/${fakeId}`)
      .set('Authorization', `Bearer ${authToken}`)
      .expect(404);
  });
});

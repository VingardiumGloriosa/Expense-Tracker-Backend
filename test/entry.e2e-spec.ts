import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('EntryController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/entry (POST) should create a new entry', () => {
    return request(app.getHttpServer())
      .post('/entry')
      .send({
        name: 'New Entry',
        amount: 100,
        date: '2023-01-01',
        currency: 'USD',
        categoryId: 1,
        comment: 'Test Comment',
      })
      .expect(201)
      .then((response) => {
        expect(response.body).toEqual(expect.objectContaining({
          id: expect.any(Number),
          name: 'New Entry',
          amount: 100,
          date: expect.any(String),
          currency: 'USD',
          category: {
            id: 1,
            name: "Useless Text"
          },
          comment: 'Test Comment',
        }));
      });
  });

  it('/entry (GET) should return all entries', () => {
    return request(app.getHttpServer())
      .get('/entry')
      .expect(200)
      .then((response) => {
        expect(Array.isArray(response.body)).toBe(true);
      });
  });

  let entryId;

  it('/entry/:id (GET) should return a single entry', async () => {
    entryId = 13; 
    return request(app.getHttpServer())
      .get(`/entry/${entryId}`)
      .expect(200)
      .then((response) => {
        expect(response.body).toEqual(expect.objectContaining({
          id: entryId,
          name: expect.any(String),
          amount: expect.any(Number),
          date: expect.any(String),
          currency: expect.any(String),
          category: {
            id: expect.any(Number),
            name: expect.any(String)
          },
          comment: expect.anything()
        }));
      });
  });

  it('/entry/:id (PATCH) should update the entry', () => {
    entryId = 13; 
    return request(app.getHttpServer())
      .patch(`/entry/${entryId}`)
      .send({
        name: 'Updated Entry',
        amount: 100,
        date: '2024-10-21',
        currency: 'USD',
        categoryId: 1,
        comment: 'Test Comment',
      })
      .expect(200)
      .then((response) => {
        expect(response.body).toEqual(expect.objectContaining({
          id: entryId,
          name: 'Updated Entry',
          amount: 100,
          date: expect.any(String),
          currency: 'USD',
          category: {
            id: 1,
            name: "Useless text"
          },
          comment: 'Test Comment',
        }));
      });
  });

  it('/entry/:id (DELETE) should remove the entry', () => {
    entryId = 13; 
    return request(app.getHttpServer())
      .delete(`/entry/${entryId}`)
      .expect(200);
  });

  afterAll(async () => {
    await app.close();
  });
});

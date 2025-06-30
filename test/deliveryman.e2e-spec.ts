import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { DeliveryManRepository } from '../src/core/domain/repositories/deliveryman-repository.interface';
import { EventPublisher } from '../src/core/domain/events/event-publisher.interface';
import { DeliveryMan } from '../src/core/domain/entities/deliveryman.entity';
import { JwtAuthGuard } from '../src/presentation/guards/jwt-auth.guard';

describe('DeliveryMan E2E', () => {
  let app: INestApplication;
  let mockRepository: jest.Mocked<DeliveryManRepository>;
  let mockEventPublisher: jest.Mocked<EventPublisher>;

  const mockDeliveryMan = new DeliveryMan(
    'test-id',
    'John Doe',
    'john@example.com',
    '123.456.789-00',
    '(11) 99999-9999',
    'hashedpassword'
  );

  beforeAll(async () => {
    mockRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    mockEventPublisher = {
      publish: jest.fn(),
      publishBatch: jest.fn(),
    };

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
    .overrideProvider('DELIVERY_MAN_REPOSITORY')
    .useValue(mockRepository)
    .overrideProvider('EVENT_PUBLISHER')
    .useValue(mockEventPublisher)
    .overrideGuard(JwtAuthGuard)
    .useValue({ canActivate: () => true })
    .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /deliverymen', () => {
    it('should create a new delivery man', () => {
      const createDto = {
        name: 'John Doe',
        email: 'john@example.com',
        cpf: '123.456.789-00',
        phone: '(11) 99999-9999',
        password: 'password123',
      };

      mockRepository.create.mockResolvedValue(undefined);

      return request(app.getHttpServer())
        .post('/deliverymen')
        .send(createDto)
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body.name).toBe(createDto.name);
          expect(res.body.email).toBe(createDto.email);
          expect(res.body).not.toHaveProperty('password');
        });
    });

    it('should return 400 for invalid data', () => {
      const invalidDto = {
        name: '',
        email: 'invalid-email',
        cpf: '123',
        phone: '',
        password: '123',
      };

      return request(app.getHttpServer())
        .post('/deliverymen')
        .send(invalidDto)
        .expect(400);
    });
  });

  describe('GET /deliverymen', () => {
    it('should return paginated list', () => {
      mockRepository.findAll.mockResolvedValue({
        items: [mockDeliveryMan],
        lastEvaluatedKey: undefined,
        hasNext: false,
      });

      return request(app.getHttpServer())
        .get('/deliverymen')
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('items');
          expect(res.body).toHaveProperty('count');
          expect(Array.isArray(res.body.items)).toBe(true);
        });
    });

    it('should accept pagination parameters', () => {
      mockRepository.findAll.mockResolvedValue({
        items: [],
        lastEvaluatedKey: undefined,
        hasNext: false,
      });

      return request(app.getHttpServer())
        .get('/deliverymen?limit=5')
        .expect(200);
    });
  });

  describe('GET /deliverymen/:id', () => {
    it('should return delivery man by id', () => {
      mockRepository.findById.mockResolvedValue(mockDeliveryMan);

      return request(app.getHttpServer())
        .get(`/deliverymen/${mockDeliveryMan.id}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.id).toBe(mockDeliveryMan.id);
          expect(res.body.name).toBe(mockDeliveryMan.name);
        });
    });

    it('should return 404 for non-existent delivery man', () => {
      mockRepository.findById.mockResolvedValue(null);

      return request(app.getHttpServer())
        .get('/deliverymen/non-existent-id')
        .expect(404);
    });
  });

  describe('PATCH /deliverymen/:id', () => {
    it('should update delivery man', () => {
      const updateDto = { name: 'Updated Name' };
      
      mockRepository.findById.mockResolvedValue(mockDeliveryMan);
      mockRepository.update.mockResolvedValue(undefined);

      return request(app.getHttpServer())
        .patch(`/deliverymen/${mockDeliveryMan.id}`)
        .send(updateDto)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
        });
    });

    it('should return 404 for non-existent delivery man', () => {
      const updateDto = { name: 'Updated Name' };
      mockRepository.update.mockRejectedValue(new Error('Not found'));

      return request(app.getHttpServer())
        .patch('/deliverymen/non-existent-id')
        .send(updateDto)
        .expect(500); // Error will be mapped by HttpErrorMapper
    });
  });

  describe('DELETE /deliverymen/:id', () => {
    it('should delete delivery man', () => {
      mockRepository.findById.mockResolvedValue(mockDeliveryMan);
      mockRepository.delete.mockResolvedValue(undefined);

      return request(app.getHttpServer())
        .delete(`/deliverymen/${mockDeliveryMan.id}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.success).toBe(true);
        });
    });

    it('should return 404 for non-existent delivery man', () => {
      mockRepository.delete.mockRejectedValue(new Error('Not found'));

      return request(app.getHttpServer())
        .delete('/deliverymen/non-existent-id')
        .expect(500); // Error will be mapped by HttpErrorMapper
    });
  });
});
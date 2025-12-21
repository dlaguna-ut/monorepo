import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { getQueueToken } from '@nestjs/bullmq';
import { SCRAPE_QUEUE_NAME } from '@repo/jobs';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        AppService,
        {
          provide: getQueueToken(SCRAPE_QUEUE_NAME),
          useValue: {
            add: jest.fn(),
          },
        },
      ],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(appController.getHello()).toEqual({ message: 'Hello World!' });
    });
  });
});

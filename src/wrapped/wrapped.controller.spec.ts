import { Test, TestingModule } from '@nestjs/testing';
import { WrappedController } from './wrapped.controller';
import { WrappedService } from './wrapped.service';

describe('WrappedController', () => {
  let controller: WrappedController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WrappedController],
      providers: [WrappedService],
    }).compile();

    controller = module.get<WrappedController>(WrappedController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

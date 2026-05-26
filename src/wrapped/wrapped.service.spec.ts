import { Test, TestingModule } from '@nestjs/testing';
import { WrappedService } from './wrapped.service';

describe('WrappedService', () => {
  let service: WrappedService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WrappedService],
    }).compile();

    service = module.get<WrappedService>(WrappedService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

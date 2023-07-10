import { Test, TestingModule } from '@nestjs/testing';
import { agentService } from './agent.service';

describe('AuthService', () => {
  let service: agentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [agentService],
    }).compile();

    service = module.get<agentService>(agentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

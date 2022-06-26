import { Test, TestingModule } from '@nestjs/testing';
import { CommitmeController } from './commitme.controller';

describe('CommitmeController', () => {
  let controller: CommitmeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CommitmeController],
    }).compile();

    controller = module.get<CommitmeController>(CommitmeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

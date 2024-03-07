import { Test, TestingModule } from '@nestjs/testing';
import { EntryController } from './entry.controller';
import { EntryService } from './entry.service';
import { CreateEntryDto } from './dto/create-entry.dto';
import { UpdateEntryDto } from './dto/update-entry.dto';

describe('EntryController', () => {
  let controller: EntryController;
  let service: EntryService;

  beforeEach(async () => {
    // Mock EntryService
    const mockEntryService = {
      create: jest.fn((dto) => ({
        id: Math.floor(Math.random() * 1000),
        ...dto,
      })),
      findAll: jest.fn(() => ['entry1', 'entry2']),
      findOne: jest.fn((id) => ({ id, name: 'Test Entry', amount: 100 })),
      update: jest.fn((id, dto) => ({ id, ...dto })),
      remove: jest.fn((id) => ({ id })),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [EntryController],
      providers: [{ provide: EntryService, useValue: mockEntryService }],
    }).compile();

    controller = module.get<EntryController>(EntryController);
    service = module.get<EntryService>(EntryService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create and return the entry', async () => {
      const createEntryDto: CreateEntryDto = { name: 'New Entry', amount: 200, date: new Date(), currency: 'USD', categoryId: 1 };
      await expect(controller.create(createEntryDto)).resolves.toEqual(expect.objectContaining(createEntryDto));
      expect(service.create).toHaveBeenCalledWith(createEntryDto);
    });
  });

  describe('findAll', () => {
    it('should return an array of entries', async () => {
      await expect(controller.findAll()).resolves.toEqual(['entry1', 'entry2']);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single entry', async () => {
      const id = 1;
      await expect(controller.findOne(id.toString())).resolves.toEqual(expect.objectContaining({ id }));
      expect(service.findOne).toHaveBeenCalledWith(id);
    });
  });

  describe('update', () => {
    it('should update and return the entry', async () => {
      const updateEntryDto: UpdateEntryDto = { name: 'Updated Entry', amount: 300 };
      const id = 1;
      await expect(controller.update(id.toString(), updateEntryDto)).resolves.toEqual({ id, ...updateEntryDto });
      expect(service.update).toHaveBeenCalledWith(id, updateEntryDto);
    });
  });

  describe('remove', () => {
    it('should remove the entry', async () => {
      const id = 1;
      await expect(controller.remove(id.toString())).resolves.toEqual({ id });
      expect(service.remove).toHaveBeenCalledWith(id);
    });
  });
});

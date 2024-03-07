import { Test, TestingModule } from '@nestjs/testing';
import { EntryService } from './entry.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Entry } from '../entities/entry.entity';
import { Repository } from 'typeorm';
import { Category } from 'src/entities/category.entity';
import { NotFoundException } from '@nestjs/common';

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

describe('EntryService', () => {
  let service: EntryService;
  let entryRepository: MockRepository<Entry>;
  let categoryRepository: MockRepository<Category>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EntryService,
        {
          provide: getRepositoryToken(Entry),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            find: jest.fn(),
            findOneBy: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Category),
          useValue: {
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<EntryService>(EntryService);
    entryRepository = module.get<MockRepository<Entry>>(getRepositoryToken(Entry));
    categoryRepository = module.get<MockRepository<Category>>(getRepositoryToken(Category));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should successfully create an entry', async () => {
      const createEntryDto = { name: 'Test Entry', amount: 100, categoryId: 1, date: new Date(), currency: 'DKK' };
      categoryRepository.findOne.mockResolvedValue(new Category());
      entryRepository.create.mockImplementation((entry) => entry);
      entryRepository.save.mockImplementation((entry) => Promise.resolve({ id: 1, ...entry }));

      expect(await service.create(createEntryDto)).toEqual({ id: 1, ...createEntryDto });
      expect(categoryRepository.findOne).toHaveBeenCalledWith({ where: { id: createEntryDto.categoryId } });
      expect(entryRepository.create).toHaveBeenCalledWith(createEntryDto);
      expect(entryRepository.save).toHaveBeenCalledWith(createEntryDto);
    });

    it('should throw NotFoundException if category is not found', async () => {
      const createEntryDto = { name: 'Test Entry', amount: 100, categoryId: 1, date: new Date(), currency: 'DKK' };
      categoryRepository.findOne.mockResolvedValue(null);

      await expect(service.create(createEntryDto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findAll', () => {
    it('should return an array of entries', async () => {
      const testEntries = [{ id: 1, name: 'Test Entry 1' }, { id: 2, name: 'Test Entry 2' }];
      entryRepository.find.mockResolvedValue(testEntries);
  
      expect(await service.findAll()).toEqual(testEntries);
      expect(entryRepository.find).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single entry', async () => {
      const testEntry = { id: 1, name: 'Test Entry' };
      entryRepository.findOneBy.mockResolvedValue(testEntry);
  
      expect(await service.findOne(1)).toEqual(testEntry);
      expect(entryRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
    });
  
    it('should throw NotFoundException if no entry is found', async () => {
      entryRepository.findOneBy.mockResolvedValue(undefined);
  
      await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update an entry', async () => {
      const updateEntryDto = { name: 'Updated Entry', amount: 150 };
      entryRepository.update.mockResolvedValue({ affected: 1 });
  
      await expect(service.update(1, updateEntryDto)).resolves.not.toThrow();
      expect(entryRepository.update).toHaveBeenCalledWith(1, updateEntryDto);
    });
  
    it('should throw NotFoundException if no entry is found to update', async () => {
      entryRepository.update.mockResolvedValue({ affected: 0 });
  
      await expect(service.update(999, {})).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove the entry', async () => {
      entryRepository.delete.mockResolvedValue({ affected: 1 });
  
      await expect(service.remove(1)).resolves.not.toThrow();
      expect(entryRepository.delete).toHaveBeenCalledWith(1);
    });
  
    it('should throw NotFoundException if no entry is found to delete', async () => {
      entryRepository.delete.mockResolvedValue({ affected: 0 });
  
      await expect(service.remove(999)).rejects.toThrow(NotFoundException);
    });
  });
  
  
});

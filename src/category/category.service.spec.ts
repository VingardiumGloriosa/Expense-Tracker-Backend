import { Test, TestingModule } from '@nestjs/testing';
import { CategoryService } from './category.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Category } from 'src/entities/category.entity';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common/exceptions';

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

const mockRepository = () => ({
  find: jest.fn(),
  save: jest.fn(),
  delete: jest.fn(),
});

describe('CategoryService', () => {
  let service: CategoryService;
  let repository: MockRepository<Category>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoryService,
        {
          provide: getRepositoryToken(Category),
          useFactory: mockRepository,
        },
      ],
    }).compile();

    service = module.get<CategoryService>(CategoryService);
    repository = module.get<MockRepository<Category>>(getRepositoryToken(Category));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(repository).toBeDefined();
  });

  describe('create', () => {
    it('should successfully create a category', async () => {
      const createCategoryDto = { name: 'Test Category' };
      repository.save.mockResolvedValue(createCategoryDto);

      expect(await service.create(createCategoryDto)).toEqual(createCategoryDto);
      expect(repository.save).toHaveBeenCalledWith(createCategoryDto);
    });
  });

  describe('findAll', () => {
    it('should return an array of categories', async () => {
      const result = [{ name: 'Test Category' }];
      repository.find.mockResolvedValue(result);

      expect(await service.findAll()).toEqual(result);
      expect(repository.find).toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('should successfully remove a category', async () => {
      repository.delete.mockResolvedValue({ affected: 1 });

      await expect(service.remove(1)).resolves.toBeUndefined();
      expect(repository.delete).toHaveBeenCalledWith(1);
    });

    it('should throw an error if no category is found', async () => {
      repository.delete.mockResolvedValue({ affected: 0 });

      await expect(service.remove(1)).rejects.toThrow(NotFoundException);
    });
  });
});

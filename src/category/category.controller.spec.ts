import { Test, TestingModule } from '@nestjs/testing';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { HttpStatus, NotFoundException } from '@nestjs/common';

describe('CategoryController', () => {
  let controller: CategoryController;
  let service: CategoryService;

  beforeEach(async () => {
    // Mock CategoryService
    const mockCategoryService = {
      create: jest.fn((dto) => dto),
      findAll: jest.fn(() => ['test']),
      remove: jest.fn((id) => { if (!id) throw new NotFoundException(`Category with ID "${id}" not found`) }),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoryController],
      providers: [{ provide: CategoryService, useValue: mockCategoryService }],
    }).compile();

    controller = module.get<CategoryController>(CategoryController);
    service = module.get<CategoryService>(CategoryService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should return a new category', async () => {
      const createCategoryDto: CreateCategoryDto = { name: 'Test Category' };
      
      await expect(controller.create(createCategoryDto)).resolves.toEqual(createCategoryDto);
      expect(service.create).toHaveBeenCalledWith(createCategoryDto);
    });
  });

  describe('findAll', () => {
    it('should return an array of categories', async () => {
      await expect(controller.findAll()).resolves.toEqual(['test']);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('should return no content', async () => {
      const response = controller.remove('1'); // ID as string
      await expect(response).resolves.toBeUndefined();
      expect(service.remove).toHaveBeenCalledWith(1); // ID converted to number
    });

    it('should throw NotFoundException for invalid ID', async () => {
      jest.spyOn(service, 'remove').mockRejectedValueOnce(new NotFoundException());

      await expect(controller.remove('')).rejects.toThrow(NotFoundException);
    });
  });
});

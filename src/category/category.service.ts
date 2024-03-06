// src/category/category.service.ts

import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from 'src/entities/category.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CategoryService {

    constructor(@InjectRepository(Category) 
        private categoryRepository: Repository<Category>) {}

    create(createCategoryDto: CreateCategoryDto): Promise<Category> {
        return this.categoryRepository.save(createCategoryDto);
    }

    findAll(): Promise<Category[]> {
        return this.categoryRepository.find();
    }
    
    async remove(id: number): Promise<void> {
        const result = await this.categoryRepository.delete(id);

        if (result.affected === 0) {
            throw new NotFoundException(`Category with ID "${id}" not found`);
        }
    }
}

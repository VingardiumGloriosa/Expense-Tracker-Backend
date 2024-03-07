import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateEntryDto } from './dto/create-entry.dto';
import { UpdateEntryDto } from './dto/update-entry.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Entry } from '../entities/entry.entity';
import { Repository } from 'typeorm';
import { Category } from '../entities/category.entity';

@Injectable()
export class EntryService {

  constructor(
    @InjectRepository(Entry) 
    private entryRepository: Repository<Entry>,

    @InjectRepository(Category) 
    private categoryRepository: Repository<Category>
  ) {}

  async create(createEntryDto: CreateEntryDto): Promise<Entry> {
    const category = await this.categoryRepository.findOne({ where: { id: createEntryDto.categoryId } });
    if (!category) {
      throw new NotFoundException(`Category with ID "${createEntryDto.categoryId}" not found`);
    }

    const entry = this.entryRepository.create({ ...createEntryDto, category });

    return this.entryRepository.save(entry);
  }

  findAll() {
    return this.entryRepository.find();
  }

  findOne(id: number) {
    return this.entryRepository.findOneBy({id})
  }

  update(id: number, updateEntryDto: UpdateEntryDto) {
    return this.entryRepository.update(id, updateEntryDto)
  }

  remove(id: number) {
    return this.entryRepository.delete(id);
  }
}

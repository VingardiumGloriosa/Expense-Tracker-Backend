import { Body, Controller, Delete, Get, Param, Post, HttpCode, HttpStatus } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';

@Controller('category')
export class CategoryController {
    constructor(private readonly categoryService: CategoryService) {}

    @Post()
    async create(@Body() createCategoryDto: CreateCategoryDto) {
        return this.categoryService.create(createCategoryDto);
    }

    @Get()
    async findAll() {
        return this.categoryService.findAll();
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    async remove(@Param('id') id: string) {
        await this.categoryService.remove(+id);
    }
}

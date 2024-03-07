import { Module } from '@nestjs/common';
import { EntryService } from './entry.service';
import { EntryController } from './entry.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Entry } from '../entities/entry.entity';
import { CategoryModule } from '../category/category.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Entry]),
    CategoryModule
  ],
  controllers: [EntryController],
  providers: [EntryService],
})
export class EntryModule {}

import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { Entry } from './entry/entities/entry.entity';
import { Category } from './entry/entities/category.entity';

dotenv.config(); // This ensures your .env file is read

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: +process.env.DB_PORT,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [Entry, Category],
  synchronize: false,
});

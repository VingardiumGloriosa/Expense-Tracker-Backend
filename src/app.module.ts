import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EntryModule } from './entry/entry.module';
import { DataSource, DataSourceOptions } from 'typeorm';

@Module({
 imports: [
   ConfigModule.forRoot({ isGlobal: true }),
   TypeOrmModule.forRootAsync({
     imports: [ConfigModule],
     useFactory: (configService: ConfigService) => ({
      url: process.env.DATABASE_URL, 
      type: 'postgres',
       host: configService.get('DB_HOST'),
       port: +configService.get<number>('DB_PORT'),
       username: configService.get('DB_USERNAME'),
       password: configService.get('DB_PASSWORD'),
       database: configService.get('DB_NAME'),
       autoLoadEntities: true,
       synchronize: false, 
     }),
     inject: [ConfigService],
   }),
   EntryModule,
 ],
 controllers: [AppController],
 providers: [AppService],
})
export class AppModule {}
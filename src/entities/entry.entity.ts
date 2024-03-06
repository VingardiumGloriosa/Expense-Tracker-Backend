import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Category } from './category.entity';

@Entity()
export class Entry {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    amount: number;

    @Column()
    date: Date;

    @Column()
    currency: string;

    @Column()
    name: string;

    @Column({ nullable: true })
    comment: string;

    @ManyToOne(() => Category, category => category.entries, {
        eager: true, // or set to false if you don't want to automatically load the category with each entry
    })
    @JoinColumn({ name: 'categoryId' }) // This column will store the relation
    category: Category;
}

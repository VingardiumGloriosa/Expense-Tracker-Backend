import { IsDate, IsDateString, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateEntryDto {

    @IsNumber()
    @IsNotEmpty()
    amount: number;

    @IsDateString()
    @IsNotEmpty()
    date: Date;

    @IsNotEmpty()
    @IsString()
    currency: string;

    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsString()
    categoryName: string; // Assuming you're linking categories by their name

    @IsOptional()
    @IsString()
    comment: string;

    constructor(amount: number, date: Date, currency: string, name: string, categoryName: string, comment?: string){
        this.amount = amount;
        this.date = date;
        this.currency = currency;
        this.name = name;
        this.categoryName = categoryName;
        this.comment = comment;
    } 
}

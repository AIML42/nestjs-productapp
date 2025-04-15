import { IsString, IsNotEmpty, IsOptional, IsInt } from '@nestjs/class-validator';


export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  detail: string;

  @IsString()
  @IsNotEmpty()
  category: string;

  @IsString()
  @IsOptional()
  section: string; 
}
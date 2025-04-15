// src/products/products.controller.ts
import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseGuards, 
    UsePipes,
    ValidationPipe,
    ParseUUIDPipe, 
    NotFoundException,
  } from '@nestjs/common';
  import { ProductsService } from './products.service';
  import { CreateProductDto } from './dto/create-product.dto';
  import { UpdateProductDto } from './dto/update-product.dto';
  import { AuthGuard } from '@nestjs/passport'; 
  import { Types } from 'mongoose'; 
  
 
  import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';
  
  @Injectable()
  export class ParseObjectIdPipe implements PipeTransform<string, Types.ObjectId> {
    transform(value: string, metadata: ArgumentMetadata): Types.ObjectId {
      if (!Types.ObjectId.isValid(value)) {
        throw new BadRequestException(`Invalid MongoDB ObjectId: ${value}`);
      }
      return new Types.ObjectId(value); 
    }
  }
  
  
  @Controller('products') 
  @UseGuards(AuthGuard('jwt'))
  export class ProductsController {
    constructor(private readonly productsService: ProductsService) {}

    @Get('category/:categoryName')
    async findByCategoryGrouped(@Param('categoryName') categoryName: string) {
  
        const decodedCategoryName = decodeURIComponent(categoryName);
        return this.productsService.findByCategoryGrouped(decodedCategoryName);
        
    }
  
    @Post()
    @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }))
    create(@Body() createProductDto: CreateProductDto) {
     
      return this.productsService.create(createProductDto);
    }
  
    @Get()
    findAll() {
      
      return this.productsService.findAll();
    }
  
    @Get(':id')
  
    findOne(@Param('id', ParseObjectIdPipe) id: string) {
      return this.productsService.findOne(id);
    }
  
    @Patch(':id')
    @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }))
   
    update(@Param('id', ParseObjectIdPipe) id: string, @Body() updateProductDto: UpdateProductDto) {
      return this.productsService.update(id, updateProductDto);
    }
  
    @Delete(':id')

    remove(@Param('id', ParseObjectIdPipe) id: string) {
      return this.productsService.remove(id);
    }
  }
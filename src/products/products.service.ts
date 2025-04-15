// src/products/products.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose'; // Import Types
import { Product, ProductDocument } from './schemas/product.schema';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

export interface GroupedProducts {
    [section: string]: ProductDocument[]; 
}

@Injectable()
export class ProductsService {
    constructor(
        @InjectModel(Product.name) private productModel: Model<ProductDocument>,
    ) { }


    async findByCategoryGrouped(categoryName: string): Promise<GroupedProducts> {
        
        const productsInCategory = await this.productModel.find({
            category: categoryName 
        })
            .sort({ section: 1, name: 1 }) 
            .exec();

        if (!productsInCategory || productsInCategory.length === 0) {
          
            return {}; 
        }

       
        const groupedResult: GroupedProducts = {};

        for (const product of productsInCategory) {
            
            const sectionKey = product.section || 'Uncategorized';

            if (!groupedResult[sectionKey]) {
                groupedResult[sectionKey] = []; 
            }
            groupedResult[sectionKey].push(product); 
        }

        return groupedResult;
    }

    async create(createProductDto: CreateProductDto): Promise<ProductDocument> {
        const newProduct = new this.productModel(createProductDto);
        return newProduct.save();
    }

    async findAll(): Promise<ProductDocument[]> {
        return this.productModel.find().exec();
        
    }

    async findOne(id: string): Promise<ProductDocument> {
        
        if (!Types.ObjectId.isValid(id)) {
            throw new NotFoundException(`Invalid product ID format: ${id}`);
        }
        const product = await this.productModel.findById(id).exec();
        if (!product) {
            throw new NotFoundException(`Product with ID ${id} not found`);
        }
        return product;
    }

    async update(id: string, updateProductDto: UpdateProductDto): Promise<ProductDocument> {
        if (!Types.ObjectId.isValid(id)) {
            throw new NotFoundException(`Invalid product ID format: ${id}`);
        }
        
        const updatedProduct = await this.productModel.findByIdAndUpdate(
            id,
            updateProductDto,
            { new: true } 
        ).exec();

        if (!updatedProduct) {
            throw new NotFoundException(`Product with ID ${id} not found`);
        }
        return updatedProduct;
    }

    async remove(id: string): Promise<{ message: string }> {
        if (!Types.ObjectId.isValid(id)) {
            throw new NotFoundException(`Invalid product ID format: ${id}`);
        }
        const result = await this.productModel.deleteOne({ _id: id }).exec();

        if (result.deletedCount === 0) {
            throw new NotFoundException(`Product with ID ${id} not found`);
        }
        return { message: `Product with ID ${id} successfully deleted` };
    
    }
}
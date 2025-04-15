import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ProductDocument = Product & Document;

@Schema({ timestamps: true })
export class Product {
    @Prop({ required: true, trim: true })
    name: string;

    @Prop({ required: true })
    detail: string;

    @Prop({ required: true, index: true })
    category: string;

    @Prop({default: null }) 
    section: string;


}

export const ProductSchema = SchemaFactory.createForClass(Product);
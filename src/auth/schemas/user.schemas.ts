// src/auth/schemas/user.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, Types } from 'mongoose';


export type UserDocument = User & Document & {
    _id: Types.ObjectId; 
    createdAt?: Date;    
    updatedAt?: Date;
};

@Schema({ timestamps: true })
export class User {
   

    @Prop({ required: true, unique: true, index: true })
    phone_number: string;

    @Prop({ required: true })
    first_name: string;

    @Prop({ required: true })
    last_name: string;

    @Prop({ default: true })
    is_active: boolean;

    @Prop({ type: String, required: false, default: null, select: false }) 
    otp?: string | null;

  
    @Prop()
    createdAt?: Date;

    @Prop()
    updatedAt?: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);


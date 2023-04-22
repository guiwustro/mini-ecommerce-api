import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ProductDocument = Product & Document;

@Schema({
  timestamps: { createdAt: 'created', updatedAt: 'updated' },
})
export class Product {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  price: number;

  @Prop()
  amount: number;

  @Prop()
  image: string;

  @Prop({ default: true })
  is_active: boolean;
}

export const ProductSchema = SchemaFactory.createForClass(Product);

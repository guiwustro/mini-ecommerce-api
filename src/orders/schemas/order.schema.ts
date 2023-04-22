import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Product } from 'src/products/schemas/product.schema';
import { User } from 'src/users/schemas/user.schema';

export type OrderDocument = Order & Document;

@Schema({
  timestamps: { createdAt: 'created', updatedAt: 'updated' },
})
export class Order {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  user: User;

  @Prop([
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
      },
      amount: { type: Number, required: true },
    },
  ])
  products: [{ product: Product; amount: number }];

  @Prop({ required: true })
  total_price: number;

  @Prop({ default: 'awaiting' })
  status: 'awaiting' | 'payed' | 'cancelled';
}

export const OrderSchema = SchemaFactory.createForClass(Order);

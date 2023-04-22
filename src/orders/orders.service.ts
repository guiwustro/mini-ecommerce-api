import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Order, OrderDocument } from './schemas/order.schema';
import { Model } from 'mongoose';
import { Product, ProductDocument } from 'src/products/schemas/product.schema';
import { User } from 'src/users/schemas/user.schema';
import { plainToInstance } from 'class-transformer';
import { IUserPayload } from 'src/auth/models/user.payload';
import { IUserFromJwt } from 'src/auth/models/user.jwt';
interface IOrderProducts {
  _id: string;
  amount: number;
}

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name)
    private readonly orderModel: Model<OrderDocument>,
    @InjectModel(Product.name)
    private readonly productModel: Model<ProductDocument>,
  ) {}

  async create(createOrderDto: CreateOrderDto, user: User) {
    const productsJSON = JSON.parse(
      createOrderDto.products,
    ) as IOrderProducts[];
    let totalPrice = 0;
    const productsToUpdate = [];
    // Verificar se há a quantidade específicada no banco de dados;
    // Criar o Modelo do pedido
    const newOrder = new Order();
    // Calcular o preço total do pedido
    for (let i = 0; i < productsJSON.length; i++) {
      const product = productsJSON[i];
      const currentProduct = (
        await this.productModel.findById(product._id)
      ).toObject();
      if (!currentProduct) {
        throw new HttpException(
          'Product does not exist.',
          HttpStatus.BAD_REQUEST,
        );
      }
      if (currentProduct.amount < product.amount) {
        throw new HttpException(
          'There is not enough products in stock.',
          HttpStatus.BAD_REQUEST,
        );
      }

      const updatedProduct = {
        ...currentProduct,
        amount: currentProduct.amount - product.amount,
        _id: currentProduct._id.toString(),
      };
      productsToUpdate.push(updatedProduct);

      if (!newOrder.products) {
        newOrder.products = [
          {
            product: updatedProduct,
            amount: product.amount,
          },
        ];
      } else {
        newOrder.products.push({
          product: updatedProduct,
          amount: product.amount,
        });
      }

      totalPrice += product.amount * currentProduct.price;
    }

    newOrder.total_price = totalPrice;
    newOrder.user = user;

    for (let i = 0; i < productsToUpdate.length; i++) {
      await this.productModel.updateOne(
        { _id: productsToUpdate[i]._id },
        {
          $set: {
            amount: productsToUpdate[i].amount,
          },
        },
      );
    }
    // Diminuir a quantidade do produto no banco de dados;
    // Criar o pedido

    const order = await this.orderModel.create(newOrder);

    return order;
  }

  async findAll(user: IUserFromJwt) {
    if (user.type === 'admin') {
      const orders = await this.orderModel.find().populate('products.product');
      return orders;
    }
    const userOrders = await this.orderModel
      .find({ user: user._id })
      .populate('products.product');
    return userOrders;
  }

  findOne(id: number) {
    return `This action returns a #${id} order`;
  }

  update(id: number, updateOrderDto: UpdateOrderDto) {
    return `This action updates a #${id} order`;
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }
}

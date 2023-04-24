import { HttpStatus } from '@nestjs/common/enums';
import { HttpException } from '@nestjs/common/exceptions';
import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { InjectModel } from '@nestjs/mongoose';
import { Product, ProductDocument } from '../schemas/product.schema';
import { Model } from 'mongoose';

@Injectable()
export class ValidateIsAdmin extends AuthGuard('jwt') {
  constructor(
    @InjectModel(Product.name)
    private readonly productModel: Model<ProductDocument>,
  ) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const userType = context.switchToHttp().getRequest().user.type;

    if (userType !== 'admin') {
      throw new HttpException(
        'This user does not have permissions.',
        HttpStatus.FORBIDDEN,
      );
    }

    return true;
  }
}

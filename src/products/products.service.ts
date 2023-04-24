import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Product } from './schemas/product.schema';
import { Model } from 'mongoose';
import { ProductDocument } from './schemas/product.schema';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name)
    private readonly productModel: Model<ProductDocument>,
  ) {}

  async create(createProductDto: CreateProductDto) {
    const productAlreadyExists = await this.productModel.findOne({
      name: createProductDto.name,
    });

    if (productAlreadyExists) {
      throw new HttpException(
        'Product already exists, cannot be add again.',
        HttpStatus.BAD_REQUEST,
      );
    }

    const product = this.productModel.create(createProductDto);

    return product;
  }

  async findAll({ page }: { page?: number }) {
    if (!page) {
      const products = await this.productModel.find();
      return products;
    }
    const productsPerPage = 10;
    const pipeline = [
      {
        $facet: {
          products: [
            { $skip: (page - 1) * productsPerPage },
            { $limit: productsPerPage },
          ],
          totalCount: [{ $count: 'total' }],
        },
      },
      {
        $project: {
          products: 1,
          totalCount: { $arrayElemAt: ['$totalCount.total', 0] },
          totalPages: {
            $ceil: {
              $divide: [
                { $arrayElemAt: ['$totalCount.total', 0] },
                productsPerPage,
              ],
            },
          },
        },
      },
    ];

    const [{ products, totalCount, totalPages }] =
      await this.productModel.aggregate(pipeline);

    return { products, totalCount, totalPages, currentPage: +page };
  }

  async findOne(_id: string) {
    const product = await this.productModel.findOne({ _id });
    return product;
  }

  async update(_id: string, updateProductDto: UpdateProductDto) {
    const product = await this.productModel.findOne({ _id });
    if (!product) {
      throw new HttpException(
        'This product does not exist.',
        HttpStatus.BAD_REQUEST,
      );
    }
    const updateProduct = await this.productModel.findOneAndUpdate(
      { _id },
      { $set: updateProductDto },
      { new: true },
    );
    return updateProduct;
  }

  async remove(_id: string) {
    const product = await this.productModel.findOne({ _id });
    if (!product) {
      throw new HttpException(
        'This product does not exist.',
        HttpStatus.BAD_REQUEST,
      );
    }
    await this.productModel.findOneAndUpdate(
      { _id },
      {
        $set: {
          is_active: false,
        },
      },
      { new: true },
    );
  }
}

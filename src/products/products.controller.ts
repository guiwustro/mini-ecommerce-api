import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Query,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { IsPublic } from '../auth/decorators/is-public.decorator';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductsService } from './products.service';
import { ValidateIsAdmin } from './guards/validate-is-admin';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { uploadConfig } from './helpers/upload-config';
import { ImageCloudinaryService } from './products-upload-cloudinary.service';

@Controller('products')
export class ProductsController {
  constructor(
    private readonly productsService: ProductsService,
    private readonly imageCloudinaryService: ImageCloudinaryService,
  ) {}

  @Post()
  @UseGuards(ValidateIsAdmin)
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Post(':id/images')
  @UseGuards(ValidateIsAdmin)
  @UseInterceptors(AnyFilesInterceptor(uploadConfig))
  async addFiles(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Param('id') id: string,
  ) {
    console.log(files);
    const productsImagesDTO =
      await this.imageCloudinaryService.uploadImageToCloudinary(files, id);
    return this.productsService.addImages(productsImagesDTO, id);
  }

  @IsPublic()
  @Get()
  findAll(@Query() query: { page?: number }) {
    return this.productsService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(ValidateIsAdmin)
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(id, updateProductDto);
  }

  @Delete(':id')
  @UseGuards(ValidateIsAdmin)
  @HttpCode(204)
  remove(@Param('id') id: string) {
    return this.productsService.remove(id);
  }
}

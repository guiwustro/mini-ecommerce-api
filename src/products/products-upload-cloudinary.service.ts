import { Injectable } from '@nestjs/common';
import { unlink } from 'fs';
import { v2 as cloudinary } from 'cloudinary';

export interface ProductImage {
  filename: string;
  url: string;
  assetId: string;
}

@Injectable()
export class ImageCloudinaryService {
  async uploadImageToCloudinary(
    files: Array<Express.Multer.File>,
    id: string,
  ): Promise<Partial<ProductImage>[]> {
    const ProductImagesDTO: Partial<ProductImage>[] = [];
    console.log(files);
    for (let i = 0; i < files.length; i += 1) {
      const upload = await cloudinary.uploader.upload(
        files[i].path,
        (error, result) => result,
      );
      if (upload) {
        unlink(files[i].path, (error) => {
          if (error) {
            console.log(error);
          }
        });
      }
      const ProductImageDTO = {
        assetId: upload.public_id,
        productId: +id,
        fileName: upload.original_filename,
        url: upload.url,
      };
      ProductImagesDTO.push(ProductImageDTO);
    }
    return ProductImagesDTO;
  }

  async deleteImageFromCloudinary(imagesToDelete: ProductImage[]) {
    for (let i = 0; i < imagesToDelete.length; i += 1) {
      await cloudinary.uploader.destroy(
        imagesToDelete[i].assetId,
        (error, result) => result,
      );
    }
  }
}

import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateProductDto {
  @ApiProperty({
    example: 'Fogão ',
  })
  @IsString()
  name: string;

  @ApiProperty({
    example: 2400.22,
  })
  @IsNumber()
  price: number;

  @ApiProperty({
    example: 24,
  })
  @IsNumber()
  amount: number;

  @ApiProperty()
  @IsString()
  @IsOptional()
  image: string;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  is_active: boolean;
}

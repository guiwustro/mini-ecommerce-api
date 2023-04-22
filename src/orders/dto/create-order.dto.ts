import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateOrderDto {
  @ApiProperty({
    example: `[{\"_id\":\"64437c1c1ef1b85c377fe738\",\"amount\":2444},{\"_id\":\"64437ccad0d748d313d1dd35\",\"amount\":2444}]`,
  })
  @IsString()
  products: string;
}

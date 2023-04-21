import { ApiProperty } from '@nestjs/swagger';
import { MaxLength, MinLength, IsString } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    example: 'guilherme',
  })
  @IsString()
  username: string;

  @ApiProperty({
    description:
      'The password should have minimum length 6 and maximum length as 25.',
    example: '12348562',
  })
  @IsString()
  @MinLength(6)
  @MaxLength(25)
  password: string;
}

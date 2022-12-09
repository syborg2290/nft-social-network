import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ description: 'username' })
  @IsNotEmpty()
  username: string;

  @ApiProperty({ description: 'address' })
  @IsNotEmpty()
  address: string;

  @ApiProperty({ description: 'profile_url' })
  profile_url?: string;

  @ApiProperty({ description: 'bio' })
  bio?: string;
}

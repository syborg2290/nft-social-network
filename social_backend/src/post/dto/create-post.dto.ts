import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePostDto {
  @ApiProperty({ description: 'owner' })
  @IsNotEmpty()
  owner: string;

  @ApiProperty({ description: 'mnemonic phrase of acc' })
  @IsNotEmpty()
  account_mnemonic:string;

  @ApiProperty({ description: 'variety' })
  @IsNotEmpty()
  properties: string;

  @ApiProperty({ description: 'asset_url' })
  @IsNotEmpty()
  asset_url: string;

  @ApiProperty({ description: 'file_name' })
  @IsNotEmpty()
  file_name: string;

  @ApiProperty({ description: 'mime_type' })
  @IsNotEmpty()
  mime_type: string;

  @ApiProperty({ description: 'title' })
  @IsNotEmpty()
  title: string;

  @ApiProperty({ description: 'description' })
  @IsNotEmpty()
  description: string;
}

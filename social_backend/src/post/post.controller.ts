import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Query,
  UseFilters,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { HttpExceptionFilter } from '../helper/http-exception.filter';
import { CreatePostDto } from './dto/create-post.dto';
import { PostService } from './post.service';

@Controller('social/post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post('create')
  @UseFilters(new HttpExceptionFilter())
  @ApiResponse({ status: HttpStatus.OK, description: 'Success' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal Server Error',
  })
  @UsePipes(new ValidationPipe({ transform: true }))
  async create(@Body() createPostDto: CreatePostDto) {
    try {
      const post: any = await this.postService.create(createPostDto);
      let result: object = {
        status: HttpStatus.OK,
        result: {
          message: 'Success',
          description: ['Successfuly created!'],
        },
      };
      if (post === null) {
        return {
          status: HttpStatus.BAD_REQUEST,
          result: {
            message: 'Bad Request',
            description: ['Bad Request'],
          },
        };
      }
      if (post.error) {
        return {
          status: HttpStatus.BAD_REQUEST,
          result: {
            message: 'Failed',
            description: [post.body],
          },
        };
      }
      return result;
    } catch (error) {
      console.debug(error);
    }
  }

  @Post('transferAsset')
  @UseFilters(new HttpExceptionFilter())
  @ApiResponse({ status: HttpStatus.OK, description: 'Success' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal Server Error',
  })
  @UsePipes(new ValidationPipe({ transform: true }))
  async transfer(@Body() body) {
    try {
      const res: any = await this.postService.transfer(
        body.postId,
        body.mnemonic,
        body.senderAddr,
        body.recipientAddr,
      );
      let result: object;
      if (res) {
        result = {
          status: HttpStatus.OK,
          result: {
            message: 'Success',
            description: ['Successfuly created!'],
          },
        };
      }

      return result;
    } catch (error) {
      console.debug(error);
    }
  }

  @Get('all')
  @UseFilters(new HttpExceptionFilter())
  @ApiResponse({ status: HttpStatus.OK, description: 'Success' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal Server Error',
  })
  @UsePipes(new ValidationPipe({ transform: true }))
  async getAll() {
    try {
      const posts: any = await this.postService.getAllPosts();
      return posts;
    } catch (error) {
      console.debug(error);
    }
  }

  @Get('checkUserPosted')
  @UseFilters(new HttpExceptionFilter())
  @ApiResponse({ status: HttpStatus.OK, description: 'Success' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal Server Error',
  })
  @UsePipes(new ValidationPipe({ transform: true }))
  async checkUserPosted(@Query() query) {
    try {
      const res: any = await this.postService.checkUserPublishedPost(
        query.address,
      );
      return res;
    } catch (error) {
      console.debug(error);
    }
  }
}

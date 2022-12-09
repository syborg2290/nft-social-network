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
import { CreateUserDto } from './dto/create-user.dto';
import { UserService } from './user.service';

@Controller('social/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('create')
  @UseFilters(new HttpExceptionFilter())
  @ApiResponse({ status: HttpStatus.OK, description: 'Success' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal Server Error',
  })
  @UsePipes(new ValidationPipe({ transform: true }))
  async create(@Body() createUserDto: CreateUserDto) {
    try {
      const user: any = await this.userService.create(createUserDto);
      if (user === null) {
        return {
          status: HttpStatus.BAD_REQUEST,
          result: {
            message: 'Failed',
            description: ['Bad Request'],
          },
        };
      }

      if (user.error) {
        return {
          status: HttpStatus.BAD_REQUEST,
          result: {
            message: 'Failed',
            description: [user.body],
          },
        };
      }

      let result: object = {
        status: HttpStatus.OK,
        result: {
          message: 'Success',
          description: ['Successfuly created!'],
        },
      };

      return result;
    } catch (error) {
      console.debug(error);
    }
  }

  @Get('getByAccountAddress')
  @UseFilters(new HttpExceptionFilter())
  @ApiResponse({ status: HttpStatus.OK, description: 'Success' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal Server Error',
  })
  @UsePipes(new ValidationPipe({ transform: true }))
  async getByAccountAddress(@Query() query) {
    try {
      const user: any = await this.userService.getUser(query.address);
      if (user === null) {
        return {
          status: HttpStatus.BAD_REQUEST,
          result: {
            message: 'Failed',
            description: ['User not found with your account!'],
          },
        };
      }
      if (user.error) {
        return {
          status: HttpStatus.BAD_REQUEST,
          result: {
            message: 'Failed',
            description: [user.body],
          },
        };
      }
      let result: object = {
        status: HttpStatus.OK,
        result: user.body,
      };

      return result;
    } catch (error) {
      console.debug(error);
    }
  }
}

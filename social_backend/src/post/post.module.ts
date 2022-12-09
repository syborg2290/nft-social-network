import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DatabaseModule } from '../databse.module';
import { UserProviders } from '../user/provider/user.providers';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { PostProviders } from './provider/post.providers';

@Module({
    imports: [DatabaseModule],
    controllers: [PostController],
    providers: [
      ConfigService,
      PostService,
      ...PostProviders,
      ...UserProviders
    ],
  })
export class PostModule {}

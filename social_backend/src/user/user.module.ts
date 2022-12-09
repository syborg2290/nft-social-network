import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DatabaseModule } from '../databse.module';
import { UserProviders } from './provider/user.providers';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
    imports: [DatabaseModule],
    controllers: [UserController],
    providers: [
      ConfigService,
      UserService,
      ...UserProviders
    ],
  })
export class UserModule {}

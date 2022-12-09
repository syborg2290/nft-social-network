import * as mongoose from 'mongoose';
import { ConfigService } from '@nestjs/config';

export const databaseProviders: any = [
  {
    provide: 'DATABASE_CONNECTION',
    inject: [ConfigService],
    useFactory: (configService: ConfigService): Promise<typeof mongoose> =>
      mongoose.connect(
        configService.get<string>(`${process.env.ENV}.DB_URI`)
          ? configService.get<string>(`${process.env.ENV}.DB_URI`)
          : process.env.DB_URI,
        {
          autoIndex: false, // Don't build indexes
          maxPoolSize: 10, // Maintain up to 10 socket connections
          serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
          socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
          family: 4, // Use IPv4, skip trying IPv6
        },
      ),
  },
];

import { Connection } from 'mongoose';
import { PostSchema } from '../schemas/post.schema';

export const PostProviders = [
  {
    provide: 'POST_MODEL',
    useFactory: (connection: Connection) =>
      connection.model('Posts', PostSchema),
    inject: ['DATABASE_CONNECTION'],
  },
];

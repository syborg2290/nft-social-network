import * as mongoose from 'mongoose';

export const UserSchema = new mongoose.Schema(
  {
    username: String,
    address: String,
    profile_url: String,
    bio: String,
  },
  { timestamps: true },
);

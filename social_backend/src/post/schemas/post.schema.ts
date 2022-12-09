import * as mongoose from 'mongoose';

export const PostSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'users',
    },
    assetId: String,
    properties: String,
    mime_type: String,
    title: String,
    description: String,
    account_mnemonic: String,
  },
  { timestamps: true },
);

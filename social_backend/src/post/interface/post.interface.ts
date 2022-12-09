import { Document } from 'mongoose';

export interface Post extends Document {
  owner: string;
  assetId: string;
  properties: string;
  mime_type: string;
  title: string;
  description: string;
  account_mnemonic: string;
  createdAt: Date;
}

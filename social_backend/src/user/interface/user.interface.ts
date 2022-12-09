import { Document } from "mongoose";

export interface User extends Document {
    username: string;
    address: string;
    profile_url:string;
    bio:string;
}

import mongoose from "mongoose";

export interface IUser {
  _id: mongoose.Types.ObjectId;
  username: string;
    email: string;
    password: string;
    photoUrl: string;
    bio: string;
    socialLinks: {
        instagram?: string;
        facebook?: string;
        twitter?: string;
        linkedin?: string;
    };
    occupation: string;
    phoneNumber: Number;
    address: string;
    dateOfBirth: Date;
    createdAt: Date;
    updatedAt: Date;

}
import mongoose from 'mongoose';

let isConnected = false;

export async function connect(){
    if (isConnected) {
        return;
    }
    try {
        await mongoose.connect(process.env.MONGODB_URI as string, {});
        isConnected = true;
        console.log("MongoDB connected successfully");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
    }
}

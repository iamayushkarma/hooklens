import mongoose from "mongoose";
import { error } from "node:console";

export const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI;
    if (!mongoURI) throw new Error("Mongo URL is missing");
    await mongoose.connect(mongoURI);
    console.log("Mongo DB connected");
  } catch (error) {
    console.error(error);
    process.exit(1); // (1) - Forcefully exit all processes from node event loop
  }
};

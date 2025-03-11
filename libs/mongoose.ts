import mongoose from "mongoose";

//eslint-disable-next-line 
//import { User } from "@/libs/models/user";
//eslint-disable-next-line
//import { Content } from "@/libs/models/content";
//eslint-disable-next-line
//import { Reward } from "@/libs/models/reward";
//eslint-disable-next-line
//import { Subscription } from "@/libs/models/subscription";


const connectDB = async () => {
  if (mongoose.connection.readyState === 1) {
    console.log("Already connected to MongoDB");
    return;
  }
  try {
    //const conn = 
    await mongoose.connect(process.env.MONGO_URI as string);
    //console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Error: ${error?.message || "Unknown error"}`);
    } else {
      console.error("An unknown error occurred");
    }
    //process.exit(1);
  }
};

export default connectDB;

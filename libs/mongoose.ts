import dbConnect from "./dbConnect";

//eslint-disable-next-line 
//import { User } from "@/libs/models/user";
//eslint-disable-next-line
//import { Content } from "@/libs/models/content";
//eslint-disable-next-line
//import { Reward } from "@/libs/models/reward";
//eslint-disable-next-line
//import { Subscription } from "@/libs/models/subscription";


const connectDB = async () => {
  try {
    await dbConnect();
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Error al conectar a MongoDB: ${error?.message || "Error desconocido"}`);
    } else {
      console.error("Ocurrió un error desconocido al conectar a MongoDB");
    }
  }
};

export default connectDB;

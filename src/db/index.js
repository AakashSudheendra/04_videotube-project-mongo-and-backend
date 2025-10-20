import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

///connecting database evertime think two problems
// 1)database is in other country it takes time to Comment
// 2)it may provide errors

const connectDb = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URL}/${DB_NAME}`
    );  
    console.log(
      `MongoDB Connected with Host ${connectionInstance.connection.host}`
    );
  } catch (error) {
    console.log("MongoDB Connection Error is Comming.....", error);
    process.exit(1)
  }
};
export {connectDb}
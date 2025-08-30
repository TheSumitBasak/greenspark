import mongoose from "mongoose";
import config from "@/config/config";
import { User } from "@/models";

export default function connectDb() {
  try {
    mongoose.connect(config.mongoURI, {
      dbName: "greenspark",
    });

    const connection = mongoose.connection;
    connection.on("error", (error) => {
      console.error("MongoDB connection error:", error);
    });

    connection.on("connected", () => {
      console.log("Connected to MongoDB");
    });

    connection.on("disconnected", () => {
      console.log("Disconnected from MongoDB");
    });
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}

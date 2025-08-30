import * as dotenv from "dotenv";
dotenv.config();
import express from "express";
import connectDb from "@/db/connection";
import addRoutes from "@/routes";
import cors from "cors";

const app = express();

app.set("trust proxy", true);

app.use(express.json({ limit: "25mb" }));
app.use(express.urlencoded({ extended: true, limit: "25mb" }));
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  })
);

addRoutes(app);

connectDb();

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});

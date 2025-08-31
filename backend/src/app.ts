import * as dotenv from "dotenv";
dotenv.config();
import express from "express";
import connectDb from "@/db/connection";
import addRoutes from "@/routes";
import cors from "cors";
import { getContract, checkContractDeployment } from "./config/blockchain";

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

app.listen(process.env.PORT, async () => {
  try {
    console.log("🚀 Starting server...");

    // Check if contract is deployed
    await checkContractDeployment();

    // Test contract connection
    const contract = getContract();
    console.log("✅ Contract instance created successfully");

    // Test getAllVerifiers method
    const verifiers = await contract.getAllVerifiers();
    console.log("✅ getAllVerifiers method working:", verifiers);

    console.log(`🚀 Server is running on port ${process.env.PORT}`);
  } catch (error: any) {
    console.error("❌ Server startup error:", error.message);
    console.log("⚠️  Server started but with blockchain connection issues");
    console.log(`🚀 Server is running on port ${process.env.PORT}`);
  }
});

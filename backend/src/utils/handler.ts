import config from "@/config/config";
import { Request, Response } from "express";

export default async function handler(
  req: Request,
  res: Response,
  controller: (req: Request, res: Response) => Promise<any>
) {
  try {
    await controller(req, res);
  } catch (error) {
    res.status(500).json({
      message:
        config.nodeEnv === "development"
          ? (error as Error).message
          : "Internal server error",
    });
  }
}

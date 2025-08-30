import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import blockchainRoutes from "./routes/blockchain";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/blockchain", blockchainRoutes);

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "Green Hydrogen Credit Backend is running",
    timestamp: new Date().toISOString(),
  });
});

// Root endpoint
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Green Hydrogen Credit Backend API",
    version: "1.0.0",
    endpoints: {
      health: "/health",
      blockchain: "/api/blockchain",
      blockchainHealth: "/api/blockchain/health",
    },
  });
});

// Error handling middleware
app.use(
  (
    err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error("Error:", err);
    res.status(500).json({
      success: false,
      error: "Internal server error",
      message: err.message,
    });
  }
);

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    error: "Endpoint not found",
    path: req.originalUrl,
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Green Hydrogen Credit Backend running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🔗 Blockchain API: http://localhost:${PORT}/api/blockchain`);
  console.log(
    `🔗 Blockchain Health: http://localhost:${PORT}/api/blockchain/health`
  );
});

export default app;

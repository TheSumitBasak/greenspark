import { Router } from "express";
import { authenticateToken, requireVerified } from "../middleware/auth";
import {
  createBuyOrder,
  createSellOrder,
  executeTrade,
  getOrders,
  getOrderById,
  cancelOrder,
  getMarketplaceOrders,
} from "../controllers/orderController";
import handler from "@/utils/handler";

const router = Router();


// Get orders (filtered by user role)
router.get("/", authenticateToken, (req, res) => handler(req, res, getOrders));

// Create buy order
router.post("/buy", authenticateToken, requireVerified, (req, res) => handler(req, res, createBuyOrder));

// Create sell order
router.post("/sell", authenticateToken, requireVerified, (req, res) =>handler(req, res, createSellOrder));

// Execute trade (match buy and sell orders)
router.post("/execute", authenticateToken, requireVerified, (req, res) => handler(req, res, executeTrade));

// Get marketplace orders (public) - must come before :orderId routes
router.get("/marketplace/list", (req, res) => handler(req, res, getMarketplaceOrders));

// Get order by ID
router.get("/:orderId", authenticateToken, (req, res) => handler(req, res, getOrderById));

// Cancel order
router.put("/:orderId/cancel", authenticateToken, (req, res) => handler(req, res, cancelOrder));

export default router;

import { Request, Response } from "express";
import { Order, User } from "../models";
import { getContract, handleBlockchainError } from "../config/blockchain";

export const createBuyOrder = async (req: Request, res: Response) => {
  const { tokenId, amount, price } = req.body;

  if (!tokenId || !amount || !price) {
    return res
      .status(400)
      .json({ error: "Token ID, amount, and price required" });
  }

  if (amount <= 0 || price <= 0) {
    return res.status(400).json({ error: "Amount and price must be positive" });
  }

  // Check if user is a buyer
  if ((req as any).user.role !== "buyer") {
    return res.status(403).json({ error: "Only buyers can create buy orders" });
  }

  // Verify token exists and is available
  try {
    const contract = getContract();
    const tokenData = await contract.getTokenData(tokenId);

    if (!tokenData.verified) {
      return res.status(400).json({ error: "Token is not verified" });
    }
  } catch (blockchainError) {
    throw handleBlockchainError(blockchainError);
  }

  // Create order in MongoDB
  const order = new Order({
    tokenId,
    buyerId: (req as any).user._id,
    amount,
    price,
    status: "open",
    timestamp: new Date(),
  });

  await order.save();

  res.status(201).json({
    success: true,
    message: "Buy order created successfully",
    order: {
      id: order._id,
      tokenId: order.tokenId,
      amount: order.amount,
      price: order.price,
      status: order.status,
      timestamp: order.timestamp,
    },
  });
};

export const createSellOrder = async (req: Request, res: Response) => {
  const { tokenId, amount, price } = req.body;

  if (!tokenId || !amount || !price) {
    return res
      .status(400)
      .json({ error: "Token ID, amount, and price required" });
  }

  if (amount <= 0 || price <= 0) {
    return res.status(400).json({ error: "Amount and price must be positive" });
  }

  // Check if user is a seller
  if ((req as any).user.role !== "seller") {
    return res
      .status(403)
      .json({ error: "Only sellers can create sell orders" });
  }

  // Verify token ownership
  try {
    const contract = getContract();
    const tokenData = await contract.getTokenData(tokenId);

    if (
      tokenData.owner.toLowerCase() !==
      (req as any).user.walletAddress.toLowerCase()
    ) {
      return res.status(403).json({ error: "You don't own this token" });
    }

    if (!tokenData.verified) {
      return res.status(400).json({ error: "Token is not verified" });
    }
  } catch (blockchainError) {
    throw handleBlockchainError(blockchainError);
  }

  // Create order in MongoDB
  const order = new Order({
    tokenId,
    sellerId: (req as any).user._id,
    amount,
    price,
    status: "open",
    timestamp: new Date(),
  });

  await order.save();

  res.status(201).json({
    success: true,
    message: "Sell order created successfully",
    order: {
      id: order._id,
      tokenId: order.tokenId,
      amount: order.amount,
      price: order.price,
      status: order.status,
      timestamp: order.timestamp,
    },
  });
};

export const executeTrade = async (req: Request, res: Response) => {
  const { buyOrderId, sellOrderId } = req.body;

  if (!buyOrderId || !sellOrderId) {
    return res
      .status(400)
      .json({ error: "Buy order ID and sell order ID required" });
  }

  const buyOrder: any = await Order.findById(buyOrderId).populate(
    "buyerId",
    "walletAddress"
  );
  const sellOrder: any = await Order.findById(sellOrderId).populate(
    "sellerId",
    "walletAddress"
  );

  if (!buyOrder || !sellOrder) {
    return res.status(404).json({ error: "Order not found" });
  }

  if (buyOrder.status !== "open" || sellOrder.status !== "open") {
    return res.status(400).json({ error: "Orders must be open" });
  }

  // Verify token ownership and execute on blockchain
  try {
    const contract = getContract();
    const tokenData = await contract.getTokenData(sellOrder.tokenId);

    if (
      tokenData.owner.toLowerCase() !==
      sellOrder.sellerId.walletAddress.toLowerCase()
    ) {
      return res
        .status(403)
        .json({ error: "Seller no longer owns this token" });
    }

    // Execute token transfer on blockchain
    await contract.transferToken(
      sellOrder.tokenId,
      buyOrder.buyerId.walletAddress
    );
  } catch (blockchainError) {
    throw handleBlockchainError(blockchainError);
  }

  // Update orders in MongoDB
  buyOrder.status = "completed";
  buyOrder.sellerId = sellOrder.sellerId;
  await buyOrder.save();

  sellOrder.status = "completed";
  sellOrder.buyerId = buyOrder.buyerId;
  await sellOrder.save();

  res.json({
    success: true,
    message: "Trade executed successfully",
    trade: {
      buyOrder: {
        id: buyOrder._id,
        tokenId: buyOrder.tokenId,
        amount: buyOrder.amount,
        price: buyOrder.price,
        status: buyOrder.status,
      },
      sellOrder: {
        id: sellOrder._id,
        tokenId: sellOrder.tokenId,
        amount: sellOrder.amount,
        price: sellOrder.price,
        status: sellOrder.status,
      },
    },
  });
};

export const getOrders = async (req: Request, res: Response) => {
  const { status, type, page = 1, limit = 10 } = req.query;
  const filter: any = {};

  if (status) filter.status = status;

  // Filter based on user role and order type
  if ((req as any).user.role === "buyer") {
    if (type === "buy") {
      filter.buyerId = (req as any).user._id;
    } else if (type === "sell") {
      filter.sellerId = (req as any).user._id;
    } else {
      filter.$or = [
        { buyerId: (req as any).user._id },
        { sellerId: (req as any).user._id },
      ];
    }
  } else if ((req as any).user.role === "seller") {
    if (type === "sell") {
      filter.sellerId = (req as any).user._id;
    } else if (type === "buy") {
      filter.buyerId = (req as any).user._id;
    } else {
      filter.$or = [
        { buyerId: (req as any).user._id },
        { sellerId: (req as any).user._id },
      ];
    }
  }

  const orders = await Order.find(filter)
    .populate("buyerId", "name email walletAddress")
    .populate("sellerId", "name email walletAddress")
    .select("-__v")
    .limit(Number(limit))
    .skip((Number(page) - 1) * Number(limit))
    .sort({ timestamp: -1 });

  const total = await Order.countDocuments(filter);

  res.json({
    success: true,
    orders,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      pages: Math.ceil(total / Number(limit)),
    },
  });
};

export const getOrderById = async (req: Request, res: Response) => {
  const { orderId } = req.params;

  const order = await Order.findById(orderId)
    .populate("buyerId", "name email walletAddress")
    .populate("sellerId", "name email walletAddress")
    .select("-__v");

  if (!order) {
    return res.status(404).json({ error: "Order not found" });
  }

  // Check access permissions
  const isBuyer =
    order.buyerId &&
    order.buyerId.toString() === (req as any).user._id.toString();
  const isSeller =
    order.sellerId &&
    order.sellerId.toString() === (req as any).user._id.toString();

  if (!isBuyer && !isSeller) {
    return res.status(403).json({ error: "Access denied" });
  }

  res.json({
    success: true,
    order,
  });
};

export const cancelOrder = async (req: Request, res: Response) => {
  const { orderId } = req.params;

  const order = await Order.findById(orderId);

  if (!order) {
    return res.status(404).json({ error: "Order not found" });
  }

  if (order.status !== "open") {
    return res.status(400).json({ error: "Only open orders can be cancelled" });
  }

  // Check ownership
  const isBuyer =
    order.buyerId &&
    order.buyerId.toString() === (req as any).user._id.toString();
  const isSeller =
    order.sellerId &&
    order.sellerId.toString() === (req as any).user._id.toString();

  if (!isBuyer && !isSeller) {
    return res.status(403).json({ error: "Access denied" });
  }

  order.status = "cancelled";
  await order.save();

  res.json({
    success: true,
    message: "Order cancelled successfully",
    order,
  });
};

export const getMarketplaceOrders = async (req: Request, res: Response) => {
  const { type, page = 1, limit = 20 } = req.query;
  const filter: any = { status: "open" };

  if (type === "buy") {
    filter.buyerId = { $exists: true };
  } else if (type === "sell") {
    filter.sellerId = { $exists: true };
  }

  const orders = await Order.find(filter)
    .populate("buyerId", "name")
    .populate("sellerId", "name")
    .select("tokenId amount price timestamp")
    .limit(Number(limit))
    .skip((Number(page) - 1) * Number(limit))
    .sort({ timestamp: -1 });

  const total = await Order.countDocuments(filter);

  res.json({
    success: true,
    orders,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      pages: Math.ceil(total / Number(limit)),
    },
  });
};

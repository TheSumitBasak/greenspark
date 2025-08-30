import { Request, Response } from "express";
import { Leaderboard, Order, VerificationSubmission } from "../models";

export const getCurrentLeaderboard = async (req: Request, res: Response) => {
  const currentMonth = new Date().toISOString().slice(0, 7);

  let leaderboard = await Leaderboard.findOne({ month: currentMonth })
    .populate("topProducers.userId", "name email walletAddress badges")
    .populate("topBuyers.userId", "name email walletAddress badges");

  if (!leaderboard) {
    leaderboard = new Leaderboard({
      month: currentMonth,
      topProducers: [],
      topBuyers: [],
    });
    await leaderboard.save();
  }

  res.json({
    success: true,
    leaderboard: {
      month: leaderboard.month,
      topProducers: leaderboard.topProducers,
      topBuyers: leaderboard.topBuyers,
    },
  });
};

export const getLeaderboardByMonth = async (req: Request, res: Response) => {
  const { month } = req.params;

  if (!/^\d{4}-\d{2}$/.test(month)) {
    return res.status(400).json({ error: "Invalid month format. Use YYYY-MM" });
  }

  const leaderboard = await Leaderboard.findOne({ month })
    .populate("topProducers.userId", "name email walletAddress badges")
    .populate("topBuyers.userId", "name email walletAddress badges");

  if (!leaderboard) {
    return res
      .status(404)
      .json({ error: "Leaderboard not found for this month" });
  }

  res.json({
    success: true,
    leaderboard: {
      month: leaderboard.month,
      topProducers: leaderboard.topProducers,
      topBuyers: leaderboard.topBuyers,
    },
  });
};

export const generateLeaderboard = async (req: Request, res: Response) => {
  const { month } = req.params;

  if (!/^\d{4}-\d{2}$/.test(month)) {
    return res.status(400).json({ error: "Invalid month format. Use YYYY-MM" });
  }

  const startDate = new Date(month + "-01");
  const endDate = new Date(
    startDate.getFullYear(),
    startDate.getMonth() + 1,
    0
  );

  // Get top producers
  const topProducers = await VerificationSubmission.aggregate([
    {
      $match: {
        status: "approved",
        timestamp: { $gte: startDate, $lte: endDate },
      },
    },
    {
      $group: {
        _id: "$sellerId",
        totalAmount: { $sum: "$amount" },
      },
    },
    {
      $sort: { totalAmount: -1 },
    },
    {
      $limit: 10,
    },
    {
      $lookup: {
        from: "users",
        localField: "_id",
        foreignField: "_id",
        as: "user",
      },
    },
    {
      $unwind: "$user",
    },
    {
      $project: {
        userId: "$_id",
        amount: "$totalAmount",
        badges: "$user.badges",
      },
    },
  ]);

  // Get top buyers
  const topBuyers = await Order.aggregate([
    {
      $match: {
        status: "completed",
        timestamp: { $gte: startDate, $lte: endDate },
      },
    },
    {
      $group: {
        _id: "$buyerId",
        totalAmount: { $sum: "$amount" },
      },
    },
    {
      $sort: { totalAmount: -1 },
    },
    {
      $limit: 10,
    },
    {
      $lookup: {
        from: "users",
        localField: "_id",
        foreignField: "_id",
        as: "user",
      },
    },
    {
      $unwind: "$user",
    },
    {
      $project: {
        userId: "$_id",
        amount: "$totalAmount",
        badges: "$user.badges",
      },
    },
  ]);

  await Leaderboard.findOneAndUpdate(
    { month },
    {
      month,
      topProducers,
      topBuyers,
    },
    { upsert: true, new: true }
  );

  res.json({
    success: true,
    message: "Leaderboard generated successfully",
    leaderboard: {
      month,
      topProducers: topProducers.length,
      topBuyers: topBuyers.length,
    },
  });
};

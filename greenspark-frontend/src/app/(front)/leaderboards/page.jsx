"use client";

import { useEffect, useState } from "react";
import {
  Trophy,
  Medal,
  Star,
  TrendingUp,
  Calendar,
  Users,
  Award,
} from "lucide-react";
import { showToast, toastMessages } from "@/utils/toast";
import apiService from "@/services/api";

export default function Leaderboards() {
  const [leaderboard, setLeaderboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(
    new Date().toISOString().slice(0, 7)
  );
  const [blockchainData, setBlockchainData] = useState(null);
  const [contractStats, setContractStats] = useState(null);

  // Generate last 6 months for dropdown
  const generateMonthOptions = () => {
    const months = [];
    const currentDate = new Date();
    for (let i = 0; i < 6; i++) {
      const date = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() - i,
        1
      );
      const monthStr = date.toISOString().slice(0, 7);
      const monthLabel = date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
      });
      months.push({ value: monthStr, label: monthLabel });
    }
    return months;
  };

  const fetchLeaderboard = async (month) => {
    try {
      setLoading(true);
      setError(null);

      let response;
      if (month === new Date().toISOString().slice(0, 7)) {
        response = await apiService.getCurrentLeaderboard();
      } else {
        response = await apiService.getLeaderboardByMonth(month);
      }

      setLeaderboard(response.leaderboard);

      if (
        response.leaderboard?.topProducers?.length === 0 &&
        response.leaderboard?.topBuyers?.length === 0
      ) {
        showToast.info(toastMessages.leaderboard.noData, { id: loadingToast });
      }
    } catch (err) {
      setError(err.message || "Failed to fetch leaderboard data");
      console.error("Error fetching leaderboard:", err);
      showToast.error(err.message || toastMessages.leaderboard.error, {
        id: loadingToast,
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchBlockchainData = async () => {
    try {
      const response = await apiService.getBlockchainHealth();
      setBlockchainData(response);

      // Also fetch contract stats
      const stats = await apiService.getContractStats();
      setContractStats(stats);
    } catch (err) {
      console.error("Error fetching blockchain data:", err);
      showToast.error(toastMessages.blockchain.error, {
        icon: "⚠️",
        duration: 4000,
      });
    }
  };

  useEffect(() => {
    fetchLeaderboard(selectedMonth);
    fetchBlockchainData();
  }, [selectedMonth]);

  const getRankIcon = (rank) => {
    if (rank === 1) return <Trophy className="w-6 h-6 text-yellow-500" />;
    if (rank === 2) return <Medal className="w-6 h-6" />;
    if (rank === 3) return <Medal className="w-6 h-6 text-amber-600" />;
    return <Star className="w-6 h-6 text-blue-500" />;
  };

  const getRankBadge = (rank) => {
    if (rank === 1) return "badge-primary";
    if (rank === 2) return "badge-secondary";
    if (rank === 3) return "badge-accent";
    return "badge-neutral";
  };

  const formatAmount = (amount) => {
    return new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount || 0);
  };

  if (loading) {
    return (
      <div className="min-h-screen p-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="loading loading-spinner loading-lg text-primary"></div>
          </div>
        </div>
      </div>
    );
  }

  // useEffect(() => {
  //   if (error) {
  //     showToast.error(error);
  //   }
  // }, [error]);

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto p-4">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Trophy className="w-12 h-12 text-primary mr-3" />
            <h1 className="text-4xl font-bold">Leaderboard</h1>
          </div>
          <p className="text-lg max-w-2xl mx-auto">
            Discover the top producers and buyers of Green Hydrogen Credits.
            Rankings are updated monthly based on verified transactions and
            contributions.
          </p>
        </div>

        {/* Month Selector and Refresh */}
        <div className="flex flex-col sm:flex-row justify-center items-end gap-4 mb-8">
          <div className="form-control w-full max-w-xs">
            <label className="label">
              <span className="label-text">Select Month</span>
              <Calendar className="w-4 h-4" />
            </label>
            <select
              className="select select-primary w-full"
              value={selectedMonth}
              onChange={(e) => {
                const newMonth = e.target.value;
                setSelectedMonth(newMonth);
                const monthLabel = generateMonthOptions().find(
                  (m) => m.value === newMonth
                )?.label;
              }}
            >
              {generateMonthOptions().map((month) => (
                <option key={month.value} value={month.value}>
                  {month.label}
                </option>
              ))}
            </select>
          </div>

          <div className="form-control">
            <button
              className="btn btn-secondary rounded-sm"
              onClick={() => {
                fetchLeaderboard(selectedMonth);
                fetchBlockchainData();
              }}
              disabled={loading}
            >
              {loading ? (
                <div className="loading loading-spinner loading-sm"></div>
              ) : (
                <TrendingUp className="w-4 h-4" />
              )}
              Refresh Data
            </button>
          </div>
        </div>

        {/* Summary Stats */}
        {leaderboard && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div
              data-theme="light"
              className="stat bg-base-100 shadow-lg rounded-xl"
            >
              <div className="stat-figure text-primary">
                <Users className="w-8 h-8" />
              </div>
              <div className="stat-title">Total Producers</div>
              <div className="stat-value text-primary">
                {leaderboard.topProducers?.length || 0}
              </div>
              <div className="stat-desc">This month</div>
            </div>

            <div
              data-theme="light"
              className="stat bg-base-100 shadow-lg rounded-xl"
            >
              <div className="stat-figure text-secondary">
                <TrendingUp className="w-8 h-8" />
              </div>
              <div className="stat-title">Total Buyers</div>
              <div className="stat-value text-secondary">
                {leaderboard.topBuyers?.length || 0}
              </div>
              <div className="stat-desc">This month</div>
            </div>

            <div
              data-theme="light"
              className="stat bg-base-100 shadow-lg rounded-xl"
            >
              <div className="stat-figure text-accent">
                <Award className="w-8 h-8" />
              </div>
              <div className="stat-title">Total Credits</div>
              <div className="stat-value text-accent">
                {formatAmount(
                  (leaderboard.topProducers?.reduce(
                    (sum, p) => sum + (p.amount || 0),
                    0
                  ) || 0) +
                    (leaderboard.topBuyers?.reduce(
                      (sum, b) => sum + (b.amount || 0),
                      0
                    ) || 0)
                )}
              </div>
              <div className="stat-desc">GHC Tokens</div>
            </div>
          </div>
        )}

        {/* Blockchain Status */}
        {blockchainData && (
          <div className="card bg-base-100 shadow-lg mb-8">
            <div className="card-body">
              {/* Smart Contract Info */}
              <div className="mt-4 p-4 bg-base-200 rounded-lg">
                <div className="inline-flex items-center">
                  <div className="mb-3 mr-2">
                    <span
                      className={`ml-2 relative flex h-2 w-2`}
                      title={blockchainData.success ? "Active" : "Inactive"}
                    >
                      <span
                        className={`animate-ping absolute inline-flex h-full w-full rounded-full ${
                          blockchainData.success ? "bg-green-400" : "bg-red-400"
                        } opacity-75`}
                      ></span>
                      <span
                        className={`relative inline-flex rounded-full h-2 w-2 ${
                          blockchainData.success ? "bg-green-500" : "bg-red-500"
                        }`}
                      ></span>
                    </span>
                  </div>
                  <h4 className="font-semibold mb-3">
                    Smart Contract Information
                  </h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Contract Name:</span>
                    <span className="ml-2">Green Hydrogen Credit (GHC)</span>
                  </div>
                  <div>
                    <span className="font-medium">Token Standard:</span>
                    <span className="ml-2">ERC-721</span>
                  </div>
                  <div>
                    <span className="font-medium">Features:</span>
                    <span className="ml-2">
                      Verification, Minting, Transfer
                    </span>
                  </div>
                  <div>
                    <span className="font-medium">Security:</span>
                    <span className="ml-2">Role-based Access Control</span>
                  </div>
                  <div className="md:col-span-2">
                    <span className="font-medium">Contract Address:</span>
                    <span className="ml-2 font-mono break-all text-info">
                      {blockchainData.contractAddress || "N/A"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Leaderboard Content */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Top Producers */}
          <div data-theme="light" className="card bg-base-100 shadow-lg">
            <div className="card-body">
              <div className="flex items-center mb-4">
                <Users className="w-6 h-6 text-green-600 mr-2" />
                <h2 className="card-title text-green-600">Top Producers</h2>
              </div>

              {leaderboard?.topProducers?.length > 0 ? (
                <div className="space-y-3">
                  {leaderboard.topProducers.map((producer, index) => (
                    <div
                      key={producer.userId?._id || index}
                      className="flex items-center p-3 bg-base-200 rounded-lg hover:bg-base-300 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center mr-4">
                        {getRankIcon(index + 1)}
                        <span
                          className={`badge ${getRankBadge(index + 1)} ml-2`}
                        >
                          #{index + 1}
                        </span>
                      </div>

                      <div className="flex-1">
                        <div className="font-semibold">
                          {producer.userId?.name || `Producer ${index + 1}`}
                        </div>
                        <div className="text-sm">
                          {producer.userId?.walletAddress
                            ? `${producer.userId.walletAddress.slice(
                                0,
                                6
                              )}...${producer.userId.walletAddress.slice(-4)}`
                            : "Wallet not available"}
                        </div>
                        {producer.userId?.badges &&
                          producer.userId.badges.length > 0 && (
                            <div className="flex gap-1 mt-1">
                              {producer.userId.badges
                                .slice(0, 3)
                                .map((badge, badgeIndex) => (
                                  <span
                                    key={badgeIndex}
                                    className="badge badge-sm badge-outline"
                                  >
                                    {badge}
                                  </span>
                                ))}
                              {producer.userId.badges.length > 3 && (
                                <span className="badge badge-sm badge-neutral">
                                  +{producer.userId.badges.length - 3}
                                </span>
                              )}
                            </div>
                          )}
                      </div>

                      <div className="text-right">
                        <div className="font-bold text-green-600">
                          {formatAmount(producer.amount)} GHC
                        </div>
                        <div className="text-xs">Credits</div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Award className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p>No producer data available for this month</p>
                </div>
              )}
            </div>
          </div>

          {/* Top Buyers */}
          <div data-theme="light" className="card bg-base-100 shadow-lg">
            <div className="card-body">
              <div className="flex items-center mb-4">
                <TrendingUp className="w-6 h-6 text-blue-600 mr-2" />
                <h2 className="card-title text-blue-600">Top Buyers</h2>
              </div>

              {leaderboard?.topBuyers?.length > 0 ? (
                <div className="space-y-3">
                  {leaderboard.topBuyers.map((buyer, index) => (
                    <div
                      key={buyer.userId?._id || index}
                      className="flex items-center p-3 bg-base-200 rounded-lg hover:bg-base-300 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center mr-4">
                        {getRankIcon(index + 1)}
                        <span
                          className={`badge ${getRankBadge(index + 1)} ml-2`}
                        >
                          #{index + 1}
                        </span>
                      </div>

                      <div className="flex-1">
                        <div className="font-semibold">
                          {buyer.userId?.name || `Buyer ${index + 1}`}
                        </div>
                        <div className="text-sm">
                          {buyer.userId?.walletAddress
                            ? `${buyer.userId.walletAddress.slice(
                                0,
                                6
                              )}...${buyer.userId.walletAddress.slice(-4)}`
                            : "Wallet not available"}
                        </div>
                        {buyer.userId?.badges &&
                          buyer.userId.badges.length > 0 && (
                            <div className="flex gap-1 mt-1">
                              {buyer.userId.badges
                                .slice(0, 3)
                                .map((badge, badgeIndex) => (
                                  <span
                                    key={badgeIndex}
                                    className="badge badge-sm badge-outline"
                                  >
                                    {badge}
                                  </span>
                                ))}
                              {buyer.userId.badges.length > 3 && (
                                <span className="badge badge-sm badge-neutral">
                                  +{buyer.userId.badges.length - 3}
                                </span>
                              )}
                            </div>
                          )}
                      </div>

                      <div className="text-right">
                        <div className="font-bold text-blue-600">
                          {formatAmount(buyer.amount)} GHC
                        </div>
                        <div className="text-xs">Purchased</div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Award className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p>No buyer data available for this month</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-8 text-center">
          <div className="alert alert-info max-w-2xl mx-auto">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              className="stroke-current shrink-0 w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
            <span>
              <strong>How it works:</strong> Rankings are calculated based on
              verified Green Hydrogen Credit transactions. Producers are ranked
              by total verified credits produced, while buyers are ranked by
              total credits purchased.
            </span>
          </div>
        </div>

        {/* Footer Section */}
        <div className="mt-12 p-6 bg-base-200 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div>
              <h4 className="font-semibold mb-2">Verification Process</h4>
              <p className="text-sm">
                All credits are verified by certified verifiers before being
                minted as NFTs on the blockchain.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Transparency</h4>
              <p className="text-sm">
                All transactions and verifications are recorded on the
                blockchain for complete transparency.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Monthly Updates</h4>
              <p className="text-sm">
                Leaderboards are updated monthly to reflect the latest verified
                transactions and achievements.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

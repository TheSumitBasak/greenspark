"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import {
  Wallet,
  FileText,
  Vote,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  Activity,
  ShoppingCart,
  Coins,
  History,
  Users,
} from "lucide-react";
import { getProvider, getSigner, getContractInstance } from "@/config/contract";
import {
  getUserTransactionHistory,
  getUserTransactionCount,
  debugContractConnection,
  checkAndSwitchNetwork,
} from "@/utils/contractUtils";
import { generateTestTransactions } from "@/utils/testTransactions";

export default function BuyerDashboard() {
  const [stats, setStats] = useState([
    {
      name: "GHC Token Balance",
      value: "0",
      change: "+0%",
      changeType: "positive",
      icon: Coins,
    },
    {
      name: "Total Purchases",
      value: "0",
      change: "0",
      changeType: "neutral",
      icon: ShoppingCart,
    },
    {
      name: "Total Transactions",
      value: "0",
      change: "+0%",
      changeType: "positive",
      icon: TrendingUp,
    },
    {
      name: "Voting Participation",
      value: "0",
      change: "0",
      changeType: "neutral",
      icon: Vote,
    },
  ]);

  const [recentActivities, setRecentActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [userAddress, setUserAddress] = useState("");
  const [signer, setSigner] = useState(null);
  const [ghcBalance, setGhcBalance] = useState("0");
  const [purchaseAmount, setPurchaseAmount] = useState("");
  const [purchasing, setPurchasing] = useState(false);

  // Quick actions
  const quickActions = [
    {
      name: "Buy GHC Tokens",
      description: "Purchase Green Hydrogen Credit tokens",
      href: "#buy-tokens",
      icon: ShoppingCart,
    },
    {
      name: "View Transaction History",
      description: "Check your GHC and ETH transaction history",
      href: "/buyer/transactions",
      icon: History,
    },
    {
      name: "Cast Votes",
      description: "Participate in verifier voting rounds",
      href: "/buyer/voting",
      icon: Vote,
    },
    {
      name: "Marketplace",
      description: "Browse and purchase GHC tokens",
      href: "/marketplace",
      icon: TrendingUp,
    },
  ];

  // Initialize Web3 connection
  useEffect(() => {
    const initializeWeb3 = async () => {
      try {
        if (typeof window.ethereum !== "undefined") {
          const provider = await getProvider();
          const signer = await getSigner();
          const address = signer.getAddress();

          setSigner(signer);
          setUserAddress(address);

          // Load transaction data and balance
          await loadTransactionData(signer, address);
        }
      } catch (error) {
        console.error("Error initializing Web3:", error);
        setError("Failed to connect to wallet");
      } finally {
        setLoading(false);
      }
    };

    initializeWeb3();
  }, []);

  // Load transaction data from smart contract
  const loadTransactionData = async (signer, address) => {
    try {
      const transactions = await getUserTransactionHistory(signer, address);
      const transactionCount = await getUserTransactionCount(signer, address);

      // Update stats
      setStats((prev) =>
        prev.map((stat) => {
          if (stat.name === "Total Transactions") {
            return { ...stat, value: transactionCount.toString() };
          }
          if (stat.name === "Total Purchases") {
            const purchaseCount = transactions.filter(
              (tx) => tx.type === "purchase"
            ).length;
            return { ...stat, value: purchaseCount.toString() };
          }
          if (stat.name === "Voting Participation") {
            const votingCount = transactions.filter(
              (tx) => tx.type === "vote"
            ).length;
            return { ...stat, value: votingCount.toString() };
          }
          return stat;
        })
      );

      // Transform transactions to recent activities
      const activities = transactions.slice(0, 5).map((tx) => ({
        id: tx.id,
        type: tx.type,
        title: `${
          tx.type.charAt(0).toUpperCase() + tx.type.slice(1)
        } Transaction`,
        description: tx.details || `${tx.type} of ${tx.amount} GHC tokens`,
        time: formatTimeAgo(tx.timestamp),
        status: tx.success ? "completed" : "failed",
      }));

      setRecentActivities(activities);
    } catch (error) {
      console.error("Error loading transaction data:", error);
      setError("Failed to load transaction data");
    }
  };

  // Format timestamp to relative time
  const formatTimeAgo = (timestamp) => {
    const now = Math.floor(Date.now() / 1000);
    const diff = now - timestamp;

    if (diff < 60) return "Just now";
    if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
    return `${Math.floor(diff / 86400)} days ago`;
  };

  // Generate test transactions
  const handleGenerateTestTransactions = async () => {
    if (!signer) {
      setError("Please connect your wallet first");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const success = await generateTestTransactions(signer);
      if (success) {
        // Reload transaction data
        await loadTransactionData(signer, userAddress);
        setError(""); // Clear any previous errors
      } else {
        setError(
          "Failed to generate test transactions. Check console for details."
        );
      }
    } catch (error) {
      console.error("Error generating test transactions:", error);
      setError("Failed to generate test transactions: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    if (status === "completed") {
      return <CheckCircle className="h-4 w-4 text-emerald-500" />;
    } else if (status === "pending") {
      return <Clock className="h-4 w-4 text-yellow-500" />;
    } else {
      return <AlertCircle className="h-4 w-4 text-red-500" />;
    }
  };

  const getStatusColor = (status) => {
    if (status === "completed") return "text-emerald-600 bg-emerald-50";
    if (status === "pending") return "text-yellow-600 bg-yellow-50";
    return "text-red-600 bg-red-50";
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="border-b border-gray-200 pb-6">
          <h1 className="text-3xl font-bold text-gray-900">Buyer Dashboard</h1>
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
          <span className="ml-2 text-gray-600">Loading dashboard...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-gray-200 pb-6">
        <h1 className="text-3xl font-bold text-gray-900">Buyer Dashboard</h1>
        <p className="mt-2 text-gray-600">
          Welcome to the buyer dashboard! Purchase GHC tokens, participate in
          voting, and track your transactions.
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <AlertCircle className="h-5 w-4 text-red-400" />
            <div className="ml-3">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Test Data Generation */}
      {signer && (
        <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-blue-800">
                Need Test Data?
              </h3>
              <p className="text-sm text-blue-700 mt-1">
                Generate sample transactions to see the dashboard in action
              </p>
            </div>
            <button
              onClick={handleGenerateTestTransactions}
              disabled={loading}
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                  Generating...
                </>
              ) : (
                "Generate Test Data"
              )}
            </button>
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm"
          >
            <div className="flex items-center">
              <div className="flex-shrink-0 p-2 rounded-lg bg-emerald-100">
                <stat.icon className="h-6 w-6 text-emerald-600" />
              </div>
              <div className="ml-4 flex-1">
                <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {stat.value}
                </p>
              </div>
            </div>
            <div className="mt-4">
              <span
                className={`inline-flex items-center text-sm font-medium ${
                  stat.changeType === "positive"
                    ? "text-emerald-600"
                    : "text-red-600"
                }`}
              >
                {stat.change}
              </span>
              <span className="text-sm text-gray-500 ml-1">
                from last month
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Buy GHC Tokens Section */}
      <div
        id="buy-tokens"
        className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm"
      >
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Purchase GHC Tokens
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <form className="space-y-4">
              <div>
                <label
                  htmlFor="amount"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Amount (GHC Tokens)
                </label>
                <input
                  type="number"
                  id="amount"
                  value={purchaseAmount}
                  onChange={(e) => setPurchaseAmount(e.target.value)}
                  placeholder="Enter amount to purchase"
                  min="0.01"
                  step="0.01"
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={purchasing || !signer}
                className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50"
              >
                {purchasing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Purchasing...
                  </>
                ) : (
                  <>
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Purchase GHC Tokens
                  </>
                )}
              </button>
            </form>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-gray-900 mb-2">
              Current Balance
            </h3>
            <div className="text-2xl font-bold text-emerald-600">
              {ghcBalance} GHC
            </div>
            <p className="text-sm text-gray-600 mt-2">
              Your current Green Hydrogen Credit token balance
            </p>
            <div className="mt-4 text-sm text-gray-600">
              <p>
                <strong>Token Price:</strong> 0.001 ETH per GHC
              </p>
              <p>
                <strong>Minimum Purchase:</strong> 0.01 GHC
              </p>
              <p>
                <strong>Network:</strong> Ethereum/Ganache
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {quickActions.map((action) => (
            <Link
              key={action.name}
              href={action.href}
              className="group relative rounded-lg border border-gray-200 p-4 hover:border-gray-300 hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-center">
                <div className="flex-shrink-0 p-2 rounded-lg bg-emerald-100 group-hover:bg-emerald-200 transition-colors">
                  <action.icon className="h-6 w-6 text-emerald-600" />
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-gray-900 group-hover:text-gray-700">
                    {action.name}
                  </h3>
                  <p className="text-sm text-gray-500 group-hover:text-gray-600">
                    {action.description}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Recent Activity
        </h2>
        <div className="space-y-4">
          {recentActivities.map((activity) => (
            <div
              key={activity.id}
              className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex-shrink-0 mt-1">
                {getStatusIcon(activity.status)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">
                  {activity.title}
                </p>
                <p className="text-sm text-gray-500">{activity.description}</p>
                <div className="flex items-center mt-1 space-x-2">
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                      activity.status
                    )}`}
                  >
                    {activity.status}
                  </span>
                  <span className="text-xs text-gray-400">{activity.time}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 pt-4 border-t border-gray-200">
          <Link
            href="/buyer/transactions"
            className="text-sm font-medium text-emerald-600 hover:text-emerald-500"
          >
            View all activity →
          </Link>
        </div>
      </div>
    </div>
  );
}

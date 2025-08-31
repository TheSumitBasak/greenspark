"use client";
import { useState, useEffect } from "react";
import {
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
  ExternalLink,
  Filter,
  Search,
  Download,
  Calendar,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { getProvider, getSigner, getContractInstance } from "@/config/contract";
import {
  getUserTransactionHistory,
  getUserTransactionCount,
} from "@/utils/contractUtils";

export default function TransactionsPage() {
  const [activeTab, setActiveTab] = useState("ghc");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [ghcTransactions, setGhcTransactions] = useState([]);
  const [ethTransactions, setEthTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [userAddress, setUserAddress] = useState("");
  const [signer, setSigner] = useState(null);

  // Initialize Web3 connection and load transactions
  useEffect(() => {
    const initializeWeb3 = async () => {
      try {
        if (typeof window.ethereum !== "undefined") {
          const provider = await getProvider();
          const signer = await await getSigner();
          const address = await signer.getAddress();

          setSigner(signer);
          setUserAddress(address);

          // Load transaction data
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

      // Transform smart contract transactions to display format
      const formattedTransactions = transactions.map((tx) => ({
        id: tx.id,
        type: tx.from === address ? "send" : "receive",
        amount: tx.amount.toString(),
        recipient: tx.from === address ? tx.to : tx.from,
        sender: tx.from === address ? tx.from : tx.to,
        timestamp: new Date(tx.timestamp * 1000).toISOString(),
        status: tx.success ? "completed" : "failed",
        txHash: `0x${tx.id.toString(16).padStart(64, "0")}`, // Mock hash
        gasUsed: "0.001", // Mock gas data
        gasPrice: "20", // Mock gas price
        details: tx.details,
        transactionType: tx.type,
      }));

      setGhcTransactions(formattedTransactions);

      // For now, ETH transactions remain mock data
      // In a real implementation, you'd fetch ETH transactions from a blockchain explorer API
      setEthTransactions([
        {
          id: 1,
          type: "send",
          amount: "0.05",
          recipient: "0xaaaa...bbbb",
          timestamp: "2024-01-15T11:00:00Z",
          status: "completed",
          txHash: "0xcccc...dddd",
          gasUsed: "0.005",
          gasPrice: "25",
        },
      ]);
    } catch (error) {
      console.error("Error loading transaction data:", error);
      setError("Failed to load transaction data");
    }
  };

  // Mock data for ETH transactions
  // setEthTransactions([
  //   {
  //     id: 1,
  //     type: "send",
  //     amount: "0.05",
  //     recipient: "0xaaaa...bbbb",
  //     timestamp: "2024-01-15T11:00:00Z",
  //     status: "completed",
  //     txHash: "0xcccc...dddd",
  //     gasUsed: "0.005",
  //     gasPrice: "25",
  //   },
  // ]);

  const getTransactionIcon = (type) => {
    if (type === "send") {
      return <ArrowUpRight className="h-5 w-5 text-red-500" />;
    } else {
      return <ArrowDownLeft className="h-5 w-5 text-emerald-500" />;
    }
  };

  const getStatusBadge = (status) => {
    const statusStyles = {
      completed: "bg-emerald-100 text-emerald-800",
      pending: "bg-yellow-100 text-yellow-800",
      failed: "bg-red-100 text-red-800",
    };

    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusStyles[status]}`}
      >
        {status}
      </span>
    );
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const filteredTransactions =
    activeTab === "ghc"
      ? ghcTransactions.filter(
          (tx) => tx.status === statusFilter || statusFilter === "all"
        )
      : ethTransactions.filter(
          (tx) => tx.status === statusFilter || statusFilter === "all"
        );

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="border-b border-gray-200 pb-6">
          <h1 className="text-3xl font-bold text-gray-900">
            Transaction History
          </h1>
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
          <span className="ml-2 text-gray-600">Loading transactions...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-gray-200 pb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Transaction History
            </h1>
            <p className="mt-2 text-gray-600">
              View your GHC token and ETH transaction history
            </p>
          </div>
          <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500">
            <Download className="h-4 w-4 mr-2" />
            Export
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <AlertCircle className="h-5 w-5 text-red-400" />
            <div className="ml-3">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab("ghc")}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === "ghc"
                ? "border-emerald-500 text-emerald-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            <Wallet className="h-4 w-4 inline mr-2" />
            GHC Tokens
          </button>
          <button
            onClick={() => setActiveTab("eth")}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === "eth"
                ? "border-emerald-500 text-emerald-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            <Wallet className="h-4 w-4 inline mr-2" />
            ETH
          </button>
        </nav>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search transactions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
          />
        </div>
        <div className="flex gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
          >
            <option value="all">All Status</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
          </select>
          <button className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500">
            <Filter className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Transaction List */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {filteredTransactions.map((transaction) => (
            <li key={transaction.id}>
              <div className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      {getTransactionIcon(transaction.type)}
                    </div>
                    <div className="ml-4">
                      <div className="flex items-center">
                        <p className="text-sm font-medium text-gray-900">
                          {transaction.type === "send" ? "Sent" : "Received"}{" "}
                          {transaction.amount}{" "}
                          {activeTab === "ghc" ? "GHC" : "ETH"}
                        </p>
                        <div className="ml-2">
                          {getStatusBadge(transaction.status)}
                        </div>
                      </div>
                      <p className="text-sm text-gray-500">
                        {transaction.type === "send"
                          ? `To: ${transaction.recipient}`
                          : `From: ${transaction.sender}`}
                      </p>
                      <div className="mt-1 flex items-center text-xs text-gray-400">
                        <Calendar className="h-3 w-3 mr-1" />
                        {formatTimestamp(transaction.timestamp)}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">
                        {transaction.type === "send" ? "-" : "+"}
                        {transaction.amount}{" "}
                        {activeTab === "ghc" ? "GHC" : "ETH"}
                      </p>
                      <p className="text-xs text-gray-500">
                        Gas: {transaction.gasUsed} ETH
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <a
                        href={`https://etherscan.io/tx/${transaction.txHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-emerald-600 hover:text-emerald-500"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Empty State */}
      {filteredTransactions.length === 0 && (
        <div className="text-center py-12">
          <Wallet className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            No transactions found
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Try adjusting your search or filter criteria.
          </p>
        </div>
      )}
    </div>
  );
}

"use client";
import { useState, useEffect } from "react";
import {
  Vote,
  User,
  Star,
  Clock,
  CheckCircle,
  Search,
  Filter,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { ethers } from "ethers";

import {
  CONTRACT_CONFIG,
  getContractInstance,
  getProvider,
  getSigner,
} from "@/config/contract";
import {
  voteForVerifier,
  getVerifierData,
  hasVoted,
  canVote,
  isVoteStarted,
  getAllVerifiers,
  getActiveVotingVerifiers,
  checkContractState,
  formatContractError,
  formatAddress,
  formatTimestamp,
} from "@/utils/contractUtils";
import { runCompleteTestSetup } from "@/utils/testSetup";

export default function VotingPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [verifiers, setVerifiers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [voting, setVoting] = useState({});
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [userAddress, setUserAddress] = useState("");
  const [showOnlyActiveVoting, setShowOnlyActiveVoting] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  // Initialize Web3 connection
  useEffect(() => {
    const initializeWeb3 = async () => {
      try {
        // Check if MetaMask is installed
        if (typeof window.ethereum !== "undefined") {
          const provider = await getProvider();
          const signer = await getSigner();

          try {
            const contract = getContractInstance(signer);
            const address = signer.getAddress();

            setProvider(provider);
            setSigner(signer);
            setContract(contract);
            setUserAddress(address);
          } catch (contractError) {
            console.error("Contract initialization error:", contractError);
            setError(
              contractError.message || "Failed to initialize smart contract"
            );
            return;
          }

          // Listen for account changes
          window.ethereum.on("accountsChanged", async (accounts) => {
            if (accounts.length > 0) {
              const newSigner = await getSigner();
              const newAddress = newsigner.getAddress();
              setSigner(newSigner);
              setUserAddress(newAddress);
              setContract(getContractInstance(newSigner));
            } else {
              setSigner(null);
              setUserAddress("");
              setContract(null);
            }
          });
        } else {
          setError("Please install MetaMask to use this feature");
        }
      } catch (error) {
        console.error("Error initializing Web3:", error);
        setError("Failed to connect to wallet");
      }
    };

    initializeWeb3();
  }, []);

  // Load verifiers data
  useEffect(() => {
    if (signer && userAddress) {
      loadVerifiers();
    }
  }, [signer, userAddress, showOnlyActiveVoting]);

  const loadVerifiers = async () => {
    if (!signer) return;

    setLoading(true);
    try {
      // First, check contract state
      console.log("Checking contract state before loading verifiers...");
      await checkContractState(signer);

      let verifiersData;

      if (showOnlyActiveVoting) {
        // Load only active voting verifiers
        const activeVotingVerifiers = await getActiveVotingVerifiers(signer);

        verifiersData = await Promise.all(
          activeVotingVerifiers.map(async (verifier) => {
            try {
              const hasVotedResult = await hasVoted(
                signer,
                verifier.address,
                userAddress
              );
              const canVoteResult = await canVote(
                signer,
                verifier.address,
                userAddress
              );
              const isVoteStartedResult = await isVoteStarted(
                signer,
                verifier.address
              );

              return {
                id: verifier.address,
                address: verifier.address,
                name: verifier.organizationName || "Unknown Organization",
                company: verifier.organizationName || "Unknown Company",
                email: verifier.email || "No email provided",
                rating: 4.5, // This would come from a separate rating system
                totalVotes: verifier.totalVotes,
                completedVerifications: 50, // Mock data
                successRate: 95.0, // Mock data
                status: "pending", // Active voting verifiers are always pending
                specializations: ["Solar Energy", "Wind Power"], // Mock data
                experience: "8 years", // Mock data
                hasVoted: hasVotedResult,
                canVote: canVoteResult,
                isVoteStarted: true, // These are active voting verifiers
                voteStart: 0, // Would need to get from individual verifier data if needed
                voteEnd: verifier.voteEnd,
                yesVotes: verifier.yesVotes,
                noVotes: verifier.noVotes,
                banned: false, // Active voting verifiers are not banned
                votesNeeded: verifier.votesNeeded,
              };
            } catch (error) {
              console.error(
                `Error loading verifier ${verifier.address}:`,
                error
              );
              return null;
            }
          })
        );
      } else {
        // Get all verifiers from smart contract
        const allVerifiers = await getAllVerifiers(signer);

        verifiersData = await Promise.all(
          allVerifiers.map(async (verifier) => {
            try {
              const hasVotedResult = await hasVoted(
                signer,
                verifier.address,
                userAddress
              );
              const canVoteResult = await canVote(
                signer,
                verifier.address,
                userAddress
              );
              const isVoteStartedResult = await isVoteStarted(
                signer,
                verifier.address
              );

              return {
                id: verifier.address,
                address: verifier.address,
                name: verifier.organizationName || "Unknown Organization",
                company: verifier.organizationName || "Unknown Company",
                email: verifier.email || "No email provided",
                rating: 4.5, // This would come from a separate rating system
                totalVotes: verifier.yesVotes + verifier.noVotes,
                completedVerifications: 50, // Mock data
                successRate: 95.0, // Mock data
                status: verifier.active
                  ? "active"
                  : verifier.voteStarted
                  ? "pending"
                  : "inactive",
                specializations: ["Solar Energy", "Wind Power"], // Mock data
                experience: "8 years", // Mock data
                hasVoted: hasVotedResult,
                canVote: canVoteResult,
                isVoteStarted: isVoteStartedResult,
                voteStart: 0, // Would need to get from individual verifier data if needed
                voteEnd: 0, // Would need to get from individual verifier data if needed
                yesVotes: verifier.yesVotes,
                noVotes: verifier.noVotes,
                banned: verifier.banned,
              };
            } catch (error) {
              console.error(
                `Error loading verifier ${verifier.address}:`,
                error
              );
              return null;
            }
          })
        );
      }

      setVerifiers(verifiersData.filter(Boolean));
    } catch (error) {
      console.error("Error loading verifiers:", error);
      setError("Failed to load verifiers");
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async (verifierAddress, support) => {
    if (!signer) {
      setError("Please connect your wallet first");
      return;
    }

    setVoting((prev) => ({ ...prev, [verifierAddress]: true }));
    setError("");
    setSuccess("");

    try {
      await voteForVerifier(signer, verifierAddress, support);
      setSuccess(`Successfully voted ${support ? "YES" : "NO"} for verifier`);

      // Reload verifiers to update voting status
      await loadVerifiers();
    } catch (error) {
      console.error("Error voting:", error);
      setError(formatContractError(error));
    } finally {
      setVoting((prev) => ({ ...prev, [verifierAddress]: false }));
    }
  };

  const handleTestSetup = async () => {
    if (!signer) {
      setError("Please connect your wallet first");
      return;
    }

    setError("");
    setSuccess("");

    try {
      const success = await runCompleteTestSetup(signer);
      if (success) {
        setSuccess("Test setup completed! Verifiers should now be available.");
        // Reload verifiers
        await loadVerifiers();
      } else {
        setError("Test setup failed. Check console for details.");
      }
    } catch (error) {
      console.error("Error in test setup:", error);
      setError("Test setup failed: " + error.message);
    }
  };

  const getStatusBadge = (status) => {
    const statusStyles = {
      active: "bg-emerald-100 text-emerald-800",
      pending: "bg-yellow-100 text-yellow-800",
      inactive: "bg-gray-100 text-gray-800",
    };

    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusStyles[status]}`}
      >
        {status === "active"
          ? "Active"
          : status === "pending"
          ? "Pending Vote"
          : "Inactive"}
      </span>
    );
  };

  const getVotingStatus = (verifier) => {
    if (verifier.banned) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
          <AlertCircle className="h-3 w-3 mr-1" />
          Banned
        </span>
      );
    }

    if (verifier.hasVoted) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
          <CheckCircle className="h-3 w-3 mr-1" />
          Voted
        </span>
      );
    }

    if (!verifier.isVoteStarted) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
          <Clock className="h-3 w-3 mr-1" />
          Not Started
        </span>
      );
    }

    if (!verifier.canVote) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
          <AlertCircle className="h-3 w-3 mr-1" />
          Cannot Vote
        </span>
      );
    }

    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
        <Clock className="h-3 w-3 mr-1" />
        Can Vote
      </span>
    );
  };

  const filteredVerifiers = verifiers.filter(
    (verifier) =>
      (verifier.status === statusFilter || statusFilter === "all") &&
      (verifier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        verifier.company.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="border-b border-gray-200 pb-6">
          <h1 className="text-3xl font-bold text-gray-900">Verifier Voting</h1>
          <p className="mt-2 text-gray-600">
            Participate in verifier selection rounds and help maintain quality
            standards
          </p>
        </div>
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
          <span className="ml-2 text-gray-600">Loading verifiers...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-gray-200 pb-6">
        <h1 className="text-3xl font-bold text-gray-900">Verifier Voting</h1>
        <p className="mt-2 text-gray-600">
          Participate in verifier selection rounds and help maintain quality
          standards
        </p>
      </div>

      {/* Connection Status */}
      {!signer && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
          <div className="flex">
            <AlertCircle className="h-5 w-5 text-yellow-400" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">
                Wallet Not Connected
              </h3>
              <p className="mt-1 text-sm text-yellow-700">
                Please connect your MetaMask wallet to participate in voting.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Error/Success Messages */}
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

      {success && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-md p-4">
          <div className="flex">
            <CheckCircle className="h-5 w-5 text-emerald-400" />
            <div className="ml-3">
              <p className="text-sm text-emerald-800">{success}</p>
            </div>
          </div>
        </div>
      )}

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search verifiers..."
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
            <option value="active">Active</option>
            <option value="pending">Pending Vote</option>
            <option value="inactive">Inactive</option>
          </select>
          <button className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500">
            <Filter className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Active Voting Toggle */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => {
              setShowOnlyActiveVoting(false);
              loadVerifiers();
            }}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              !showOnlyActiveVoting
                ? "bg-emerald-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            All Verifiers
          </button>
          <button
            onClick={() => {
              setShowOnlyActiveVoting(true);
              loadVerifiers();
            }}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              showOnlyActiveVoting
                ? "bg-emerald-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Active Voting Only
          </button>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-sm text-gray-600">
            {showOnlyActiveVoting
              ? "Showing verifiers currently open for voting"
              : "Showing all registered verifiers"}
          </div>
          {signer && (
            <button
              onClick={handleTestSetup}
              className="px-4 py-2 rounded-md text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors"
            >
              Setup Test Data
            </button>
          )}
        </div>
      </div>

      {/* Verifier List */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {filteredVerifiers.map((verifier) => (
            <li key={verifier.id}>
              <div className="px-4 py-6 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="h-12 w-12 rounded-full bg-emerald-100 flex items-center justify-center">
                        <User className="h-6 w-6 text-emerald-600" />
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="flex items-center">
                        <h3 className="text-lg font-medium text-gray-900">
                          {verifier.name}
                        </h3>
                        <div className="ml-3 flex items-center space-x-2">
                          {getStatusBadge(verifier.status)}
                          {getVotingStatus(verifier)}
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        {verifier.company}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        Address: {formatAddress(verifier.address)}
                      </p>
                      <div className="mt-3 flex items-center space-x-6 text-sm text-gray-500">
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-400 mr-1" />
                          {verifier.rating} ({verifier.totalVotes} votes)
                        </div>
                        <span>Experience: {verifier.experience}</span>
                        <span>Success Rate: {verifier.successRate}%</span>
                      </div>
                      <div className="mt-3">
                        <h4 className="text-sm font-medium text-gray-900 mb-2">
                          Specializations:
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {verifier.specializations.map((spec, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-blue-100 text-blue-800"
                            >
                              {spec}
                            </span>
                          ))}
                        </div>
                      </div>
                      {verifier.isVoteStarted && (
                        <div className="mt-3 text-sm text-gray-500">
                          <p>
                            Voting Period: {formatTimestamp(verifier.voteStart)}{" "}
                            - {formatTimestamp(verifier.voteEnd)}
                          </p>
                          <p>
                            Yes Votes: {verifier.yesVotes} | No Votes:{" "}
                            {verifier.noVotes}
                          </p>
                          {verifier.votesNeeded && (
                            <p className="text-emerald-600 font-medium">
                              Votes needed for approval: {verifier.votesNeeded}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {verifier.canVote &&
                      !verifier.hasVoted &&
                      verifier.isVoteStarted &&
                      !verifier.banned && (
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleVote(verifier.address, true)}
                            disabled={voting[verifier.address]}
                            className="inline-flex items-center px-3 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50"
                          >
                            {voting[verifier.address] ? (
                              <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            ) : (
                              <Vote className="h-4 w-4 mr-2" />
                            )}
                            Vote YES
                          </button>
                          <button
                            onClick={() => handleVote(verifier.address, false)}
                            disabled={voting[verifier.address]}
                            className="inline-flex items-center px-3 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
                          >
                            {voting[verifier.address] ? (
                              <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            ) : (
                              <Vote className="h-4 w-4 mr-2" />
                            )}
                            Vote NO
                          </button>
                        </div>
                      )}
                    {verifier.hasVoted && (
                      <span className="inline-flex items-center px-3 py-2 border border-emerald-300 rounded-md text-sm font-medium text-emerald-700 bg-emerald-50">
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Voted
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Empty State */}
      {filteredVerifiers.length === 0 && (
        <div className="text-center py-12">
          <Vote className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            No verifiers found
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Try adjusting your search or filter criteria.
          </p>
        </div>
      )}
    </div>
  );
}

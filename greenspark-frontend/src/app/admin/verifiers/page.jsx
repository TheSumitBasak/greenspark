"use client";

import { useState, useEffect } from "react";
import apiService from "@/services/api";
import { showToast } from "@/utils/toast";
import { useAuth } from "@/contexts/AuthContext";
import WalletLogin from "@/components/WalletLogin";

export default function VerifierManagement() {
  const {
    isConnected,
    isAuthenticated,
    account,
    isLoading: authLoading,
  } = useAuth();
  const [verifiers, setVerifiers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  });
  const [isUpdating, setIsUpdating] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [createFormData, setCreateFormData] = useState({
    organizationName: "",
    walletAddress: "",
    email: "",
    documents: [],
  });

  useEffect(() => {
    if (isAuthenticated && !authLoading) {
      fetchVerifiers();
    }
  }, [pagination.page, filter, isAuthenticated, authLoading]);

  const fetchVerifiers = async () => {
    try {
      setIsLoading(true);
      setError("");

      const status = filter === "all" ? null : filter;
      const response = await apiService.getAllVerifiers(
        pagination.page,
        pagination.limit,
        status
      );

      if (response.success) {
        setVerifiers(response.verifiers);
        setPagination((prev) => ({
          ...prev,
          total: response.pagination.total,
          pages: response.pagination.pages,
        }));
      } else {
        const errorMsg = response.error || "Failed to fetch verifiers";
        setError(errorMsg);
        showToast.error(errorMsg);
      }
    } catch (error) {
      console.error("Error fetching verifiers:", error);
      const errorMsg = "Failed to fetch verifiers";
      setError(errorMsg);
      showToast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateVerifier = async (e) => {
    e.preventDefault();
    try {
      setIsUpdating(true);
      setError("");

      const response = await apiService.createVerifier(createFormData);

      if (response.success) {
        showToast.success("Verifier created successfully");
        setShowCreateForm(false);
        setCreateFormData({
          organizationName: "",
          walletAddress: "",
          email: "",
          documents: [],
        });
        fetchVerifiers(); // Refresh the list
      } else {
        const errorMsg = response.error || "Failed to create verifier";
        setError(errorMsg);
        showToast.error(errorMsg);
      }
    } catch (error) {
      console.error("Error creating verifier:", error);
      const errorMsg = "Failed to create verifier";
      setError(errorMsg);
      showToast.error(errorMsg);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleStartVote = async (verifierId) => {
    try {
      setIsUpdating(true);
      setError("");

      const response = await apiService.startVerifierVote(verifierId);

      if (response.success) {
        showToast.success("Voting started successfully for verifier");
        fetchVerifiers(); // Refresh the list
      } else {
        const errorMsg = response.error || "Failed to start voting";
        setError(errorMsg);
        showToast.error(errorMsg);
      }
    } catch (error) {
      console.error("Error starting vote:", error);
      const errorMsg = "Failed to start voting";
      setError(errorMsg);
      showToast.error(errorMsg);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleSyncVotingStatus = async (verifierId) => {
    try {
      setIsUpdating(true);
      setError("");

      const response = await apiService.syncVotingStatus(verifierId);

      if (response.success) {
        showToast.success("Voting status synced from blockchain");
        fetchVerifiers(); // Refresh the list
      } else {
        const errorMsg = response.error || "Failed to sync voting status";
        setError(errorMsg);
        showToast.error(errorMsg);
      }
    } catch (error) {
      console.error("Error syncing voting status:", error);
      const errorMsg = "Failed to sync voting status";
      setError(errorMsg);
      showToast.error(errorMsg);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleUpdateStatus = async (verifierId, status) => {
    try {
      setIsUpdating(true);
      setError("");

      const response = await apiService.updateVerifierStatus(
        verifierId,
        status
      );

      if (response.success) {
        showToast.success(`Verifier status updated to ${status}`);
        fetchVerifiers(); // Refresh the list
      } else {
        const errorMsg = response.error || "Failed to update verifier status";
        setError(errorMsg);
        showToast.error(errorMsg);
      }
    } catch (error) {
      console.error("Error updating verifier status:", error);
      const errorMsg = "Failed to update verifier status";
      setError(errorMsg);
      showToast.error(errorMsg);
    } finally {
      setIsUpdating(false);
    }
  };

  const handlePageChange = (newPage) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
  };

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    setPagination((prev) => ({ ...prev, page: 1 })); // Reset to first page when filter changes
  };

  // Show loading state while checking authentication
  if (authLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Verifier Management
          </h1>
          <p className="text-gray-600">Checking authentication...</p>
        </div>
        <div className="flex items-center justify-center h-64">
          <div className="loading loading-spinner loading-lg text-primary"></div>
        </div>
      </div>
    );
  }

  // Show MetaMask connection required message
  if (!isConnected) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Verifier Management
          </h1>
          <p className="text-gray-600">MetaMask connection required</p>
        </div>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-yellow-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">
                MetaMask Not Connected
              </h3>
              <div className="mt-2 text-sm text-yellow-700">
                <p>
                  Please connect your MetaMask wallet to access the verifier
                  management system.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show authentication required message
  if (!isAuthenticated) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Verifier Management
          </h1>
          <p className="text-gray-600">Authentication required</p>
        </div>
        <WalletLogin onLoginSuccess={() => window.location.reload()} />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Verifier Management
          </h1>
          <p className="text-gray-600">Loading verifiers...</p>
        </div>
        <div className="flex items-center justify-center h-64">
          <div className="loading loading-spinner loading-lg text-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Verifier Management
          </h1>
          <p className="text-gray-600">
            Manage verifier organizations and DAO voting
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <div
              className={`w-3 h-3 rounded-full ${
                isConnected ? "bg-green-500" : "bg-red-500"
              }`}
            ></div>
            <span className="text-sm text-gray-600">
              {isConnected ? "MetaMask Connected" : "MetaMask Disconnected"}
            </span>
          </div>
          {account && (
            <div className="text-sm text-gray-500">
              {account.slice(0, 6)}...{account.slice(-4)}
            </div>
          )}
        </div>
      </div>

      {/* Create Verifier Form */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium text-gray-900">
            Create New Verifier
          </h2>
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="btn btn-primary btn-sm"
          >
            {showCreateForm ? "Cancel" : "Add Verifier"}
          </button>
        </div>

        {showCreateForm && (
          <form onSubmit={handleCreateVerifier} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Organization Name
                </label>
                <input
                  type="text"
                  required
                  value={createFormData.organizationName}
                  onChange={(e) =>
                    setCreateFormData({
                      ...createFormData,
                      organizationName: e.target.value,
                    })
                  }
                  className="input input-bordered w-full"
                  placeholder="Enter organization name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={createFormData.email}
                  onChange={(e) =>
                    setCreateFormData({
                      ...createFormData,
                      email: e.target.value,
                    })
                  }
                  className="input input-bordered w-full"
                  placeholder="contact@organization.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Wallet Address
                </label>
                <input
                  type="text"
                  required
                  value={createFormData.walletAddress}
                  onChange={(e) =>
                    setCreateFormData({
                      ...createFormData,
                      walletAddress: e.target.value,
                    })
                  }
                  className="input input-bordered w-full"
                  placeholder="0x..."
                />
              </div>
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isUpdating}
                className="btn btn-primary"
              >
                {isUpdating ? "Creating..." : "Create Verifier"}
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filter by Status
            </label>
            <select
              value={filter}
              onChange={(e) => handleFilterChange(e.target.value)}
              className="select select-bordered w-full"
            >
              <option value="all">All Verifiers</option>
              <option value="pending">Pending</option>
              <option value="active">Active</option>
              <option value="rejected">Rejected</option>
              <option value="banned">Banned</option>
            </select>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Verifiers Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium text-gray-900">
              Verifiers ({pagination.total})
            </h2>
            <button
              onClick={fetchVerifiers}
              disabled={isLoading}
              className="btn btn-sm btn-outline"
            >
              {isLoading ? (
                <div className="loading loading-spinner loading-xs"></div>
              ) : (
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
              )}
              Refresh
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          {verifiers.length === 0 ? (
            <div className="text-center py-12">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                No verifiers found
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Get started by creating a new verifier organization.
              </p>
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Organization
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Wallet Address
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Voting
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {verifiers.map((verifier) => (
                  <tr key={verifier._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {verifier.organizationName}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {verifier.email}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {verifier.walletAddress}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                          verifier.status === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : verifier.status === "active"
                            ? "bg-green-100 text-green-800"
                            : verifier.status === "rejected"
                            ? "bg-red-100 text-red-800"
                            : verifier.status === "banned"
                            ? "bg-gray-100 text-gray-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {verifier.status === "pending"
                          ? "Pending"
                          : verifier.status === "active"
                          ? "Active"
                          : verifier.status === "rejected"
                          ? "Rejected"
                          : verifier.status === "banned"
                          ? "Banned"
                          : verifier.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                          verifier.voteStarted
                            ? "bg-blue-100 text-blue-800"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {verifier.voteStarted ? "Voting Active" : "No Vote"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(verifier.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        {verifier.status === "pending" &&
                          !verifier.voteStarted && (
                            <>
                              <button
                                onClick={() => handleStartVote(verifier._id)}
                                disabled={isUpdating}
                                className="btn btn-sm btn-primary"
                              >
                                {isUpdating ? "Starting..." : "Start Vote"}
                              </button>
                              <button
                                onClick={() =>
                                  handleUpdateStatus(verifier._id, "active")
                                }
                                disabled={isUpdating}
                                className="btn btn-sm btn-success"
                              >
                                {isUpdating ? "Updating..." : "Approve"}
                              </button>
                              <button
                                onClick={() =>
                                  handleUpdateStatus(verifier._id, "rejected")
                                }
                                disabled={isUpdating}
                                className="btn btn-sm btn-error"
                              >
                                {isUpdating ? "Updating..." : "Reject"}
                              </button>
                            </>
                          )}
                        {verifier.status === "pending" &&
                          verifier.voteStarted && (
                            <div className="flex space-x-2">
                              <span className="text-xs text-blue-600 font-medium px-2 py-1 bg-blue-50 rounded">
                                Vote in Progress
                              </span>
                              <button
                                onClick={() =>
                                  handleSyncVotingStatus(verifier._id)
                                }
                                disabled={isUpdating}
                                className="btn btn-sm btn-outline btn-info"
                                title="Sync voting status from blockchain"
                              >
                                {isUpdating ? "Syncing..." : "Sync"}
                              </button>
                              {/* <button
                                onClick={() =>
                                  handleUpdateStatus(verifier._id, "active")
                                }
                                disabled={isUpdating}
                                className="btn btn-sm btn-success"
                              >
                                {isUpdating ? "Updating..." : "Approve"}
                              </button>
                              <button
                                onClick={() =>
                                  handleUpdateStatus(verifier._id, "rejected")
                                }
                                disabled={isUpdating}
                                className="btn btn-sm btn-error"
                              >
                                {isUpdating ? "Updating..." : "Reject"}
                              </button> */}
                            </div>
                          )}
                        {/* {verifier.status === "active" && (
                          <button
                            onClick={() =>
                              handleUpdateStatus(verifier._id, "banned")
                            }
                            disabled={isUpdating}
                            className="btn btn-sm btn-warning"
                          >
                            {isUpdating ? "Updating..." : "Ban"}
                          </button>
                        )}
                        {verifier.status === "banned" && (
                          <button
                            onClick={() =>
                              handleUpdateStatus(verifier._id, "active")
                            }
                            disabled={isUpdating}
                            className="btn btn-sm btn-info"
                          >
                            {isUpdating ? "Updating..." : "Unban"}
                          </button>
                        )} */}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
                {Math.min(pagination.page * pagination.limit, pagination.total)}{" "}
                of {pagination.total} results
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                  className="btn btn-sm btn-outline"
                >
                  Previous
                </button>
                <span className="flex items-center px-3 py-2 text-sm text-gray-700">
                  Page {pagination.page} of {pagination.pages}
                </span>
                <button
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page === pagination.pages}
                  className="btn btn-sm btn-outline"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

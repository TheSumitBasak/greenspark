"use client";

import { useState, useEffect } from "react";
import apiService from "@/services/api";
import { showToast } from "@/utils/toast";
import { useAuth } from "@/contexts/AuthContext";
import WalletLogin from "@/components/WalletLogin";

export default function UserManagement() {
  const {
    isConnected,
    isAuthenticated,
    account,
    isLoading: authLoading,
  } = useAuth();
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  });
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (isAuthenticated && !authLoading) {
      fetchUsers();
    }
  }, [pagination.page, filter, isAuthenticated, authLoading]);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      setError("");

      const status = filter === "all" ? null : filter;
      const response = await apiService.getAllUsers(
        pagination.page,
        pagination.limit,
        status
      );

      if (response.success) {
        setUsers(response.users);
        setPagination((prev) => ({
          ...prev,
          total: response.pagination.total,
          pages: response.pagination.pages,
        }));
      } else {
        const errorMsg = response.error || "Failed to fetch users";
        setError(errorMsg);
        showToast.error(errorMsg);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      const errorMsg = "Failed to fetch users";
      setError(errorMsg);
      showToast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyUser = async (userId, verified) => {
    try {
      setIsUpdating(true);
      setError("");

      const response = await apiService.verifyUser(userId, verified);

      if (response.success) {
        if (verified) {
          // User verified - update status in local state
          setUsers(
            users.map((user) =>
              user._id === userId ? { ...user, status: "verified" } : user
            )
          );
        } else {
          // User rejected - remove from local state
          setUsers(users.filter((user) => user._id !== userId));

          // Update pagination total count
          setPagination((prev) => ({
            ...prev,
            total: prev.total - 1,
            pages: Math.ceil((prev.total - 1) / prev.limit),
          }));
        }

        // Show success message
        showToast.success(
          `User ${verified ? "verified" : "rejected"} successfully`
        );
      } else {
        const errorMsg =
          response.error || `Failed to ${verified ? "verify" : "reject"} user`;
        setError(errorMsg);
        showToast.error(errorMsg);
      }
    } catch (error) {
      console.error("Error updating user status:", error);
      const errorMsg = `Failed to ${verified ? "verify" : "reject"} user`;
      setError(errorMsg);
      showToast.error(errorMsg);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleBanUser = async (userId, banned) => {
    try {
      setIsUpdating(true);
      setError("");

      const response = await apiService.banUser(userId, banned);

      if (response.success) {
        // Update the user in the local state
        setUsers(
          users.map((user) =>
            user._id === userId
              ? { ...user, status: banned ? "banned" : "pending" }
              : user
          )
        );

        // Show success message
        showToast.success(
          `User ${banned ? "banned" : "unbanned"} successfully`
        );
      } else {
        const errorMsg =
          response.error || `Failed to ${banned ? "ban" : "unban"} user`;
        setError(errorMsg);
        showToast.error(errorMsg);
      }
    } catch (error) {
      console.error("Error updating user status:", error);
      const errorMsg = `Failed to ${banned ? "ban" : "unban"} user`;
      setError(errorMsg);
      showToast.error(errorMsg);
    } finally {
      setIsUpdating(false);
    }
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

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
          <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
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
          <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
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
                  Please connect your MetaMask wallet to access the user
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
          <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
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
          <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-600">Loading users...</p>
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
          <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-600">
            Manage user accounts and verification status
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
              <option value="all">All Users</option>
              <option value="pending">Pending Verification</option>
              <option value="verified">Verified</option>
              <option value="banned">Banned</option>
            </select>
          </div>

          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search Users
            </label>
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input input-bordered w-full"
            />
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

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium text-gray-900">
              Users ({pagination.total})
            </h2>
            <button
              onClick={fetchUsers}
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
          {filteredUsers.length === 0 ? (
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
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                No users found
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm
                  ? "Try adjusting your search terms."
                  : "Get started by creating a new user."}
              </p>
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Country
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {user.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {user.email}
                        </div>
                        <div className="text-xs text-gray-400">
                          {user.walletAddress}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                          user.role === "buyer"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-purple-100 text-purple-800"
                        }`}
                      >
                        {user.role === "buyer" ? "Buyer" : "Seller"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                          user.status === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : user.status === "verified"
                            ? "bg-green-100 text-green-800"
                            : user.status === "banned"
                            ? "bg-red-100 text-red-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {user.status === "pending"
                          ? "Pending"
                          : user.status === "verified"
                          ? "Verified"
                          : user.status === "banned"
                          ? "Banned"
                          : user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {user.country}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {user.status === "pending" && (
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleVerifyUser(user._id, true)}
                            disabled={isUpdating}
                            className="btn btn-sm btn-success"
                          >
                            {isUpdating ? "Verifying..." : "Verify"}
                          </button>
                          <button
                            onClick={() => handleVerifyUser(user._id, false)}
                            disabled={isUpdating}
                            className="btn btn-sm btn-error"
                          >
                            {isUpdating ? "Rejecting..." : "Reject"}
                          </button>
                        </div>
                      )}
                      {user.status === "verified" && (
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleBanUser(user._id, true)}
                            disabled={isUpdating}
                            className="btn btn-sm btn-warning"
                          >
                            {isUpdating ? "Banning..." : "Ban"}
                          </button>
                        </div>
                      )}
                      {user.status === "banned" && (
                        <button
                          onClick={() => handleBanUser(user._id, false)}
                          disabled={isUpdating}
                          className="btn btn-sm btn-info"
                        >
                          {isUpdating ? "Unbanning..." : "Unban"}
                        </button>
                      )}
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

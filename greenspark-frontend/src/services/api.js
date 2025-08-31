const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;

    // Get auth token from cookies
    let token = null;
    if (typeof window !== "undefined") {
      try {
        const { getCookie } = await import("../utils/cookies");
        token = getCookie("authToken");
      } catch (error) {
        console.error("Error importing cookie utility:", error);
      }
    }

    const config = {
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.error || `HTTP error! status: ${response.status}`
        );
      }

      return await response.json();
    } catch (error) {
      console.error("API request failed:", error);
      throw error;
    }
  }

  // Leaderboard API methods
  async getCurrentLeaderboard() {
    return this.request("/leaderboard/current");
  }

  async getLeaderboardByMonth(month) {
    return this.request(`/leaderboard/month/${month}`);
  }

  // Blockchain API methods
  async getBlockchainHealth() {
    return this.request("/blockchain/health");
  }

  async getBlockchainUserData(walletAddress) {
    return this.request(`/blockchain/user/${walletAddress}`);
  }

  async getBlockchainBalance(walletAddress) {
    return this.request(`/blockchain/balance/${walletAddress}`);
  }

  // User data methods
  async getUserProfile(userId) {
    return this.request(`/users/${userId}`);
  }

  // Auth methods
  async loginWithWallet(walletAddress) {
    return this.request("/auth/login", {
      method: "POST",
      body: JSON.stringify({ walletAddress }),
    });
  }

  async registerUser(userData) {
    return this.request("/users/register", {
      method: "POST",
      body: JSON.stringify(userData),
    });
  }

  // Smart contract data methods
  async getContractStats() {
    try {
      // This would typically call smart contract methods
      // For now, we'll return mock data or call backend endpoints
      const health = await this.getBlockchainHealth();
      return {
        network: health.network,
        contractAddress: health.contractAddress,
        isHealthy: health.success,
      };
    } catch (error) {
      console.error("Failed to get contract stats:", error);
      return null;
    }
  }

  // Admin API methods
  async getDashboardStats() {
    return this.request("/admin/stats");
  }

  async getRecentActivity() {
    return this.request("/admin/activity");
  }

  async getAllUsers(page = 1, limit = 10, status = null, role = null) {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    if (status) params.append("status", status);
    if (role) params.append("role", role);
    return this.request(`/users?${params.toString()}`);
  }

  async verifyUser(userId, verified) {
    return this.request(`/users/${userId}/verify`, {
      method: "PUT",
      body: JSON.stringify({ verified }),
    });
  }

  async banUser(userId, banned) {
    return this.request(`/users/${userId}/ban`, {
      method: "PUT",
      body: JSON.stringify({ banned }),
    });
  }

  async getAllVerifiers(page = 1, limit = 10, status = null) {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    if (status) params.append("status", status);
    return this.request(`/verifiers?${params.toString()}`);
  }

  async createVerifier(verifierData) {
    return this.request("/verifiers/register", {
      method: "POST",
      body: JSON.stringify(verifierData),
    });
  }

  async updateVerifierStatus(verifierId, status) {
    return this.request(`/verifiers/${verifierId}/status`, {
      method: "PUT",
      body: JSON.stringify({ status }),
    });
  }

  async startVerifierVote(verifierId) {
    return this.request(`/verifiers/${verifierId}/start-vote`, {
      method: "POST",
    });
  }

  async syncVotingStatus(verifierId) {
    return this.request(`/verifiers/${verifierId}/sync-voting`, {
      method: "POST",
    });
  }

  async getVotingStatus(verifierId) {
    return this.request(`/verifiers/${verifierId}/voting-status`);
  }

  async checkVotingEligibility(verifierId, walletAddress) {
    return this.request(`/verifiers/${verifierId}/check-eligibility`, {
      method: "POST",
      body: JSON.stringify({ walletAddress }),
    });
  }

  async getAllVotes() {
    return this.request("/admin/votes");
  }

  async createVote(voteData) {
    return this.request("/admin/votes", {
      method: "POST",
      body: JSON.stringify(voteData),
    });
  }

  async updateVoteStatus(voteId, status) {
    return this.request(`/admin/votes/${voteId}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
  }
}

export default new ApiService();

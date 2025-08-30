const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
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
}

export default new ApiService();

// MetaMask utility functions

export const isMetaMaskInstalled = () => {
  return (
    typeof window !== "undefined" && typeof window.ethereum !== "undefined"
  );
};

export const getCurrentAccount = async () => {
  if (!isMetaMaskInstalled()) {
    throw new Error("MetaMask is not installed");
  }

  try {
    const accounts = await window.ethereum.request({
      method: "eth_accounts",
    });
    return accounts[0] || null;
  } catch (error) {
    console.error("Error getting current account:", error);
    throw error;
  }
};

export const requestAccountAccess = async () => {
  if (!isMetaMaskInstalled()) {
    throw new Error("MetaMask is not installed");
  }

  try {
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    return accounts[0] || null;
  } catch (error) {
    console.error("Error requesting account access:", error);
    throw error;
  }
};

export const getNetworkId = async () => {
  if (!isMetaMaskInstalled()) {
    throw new Error("MetaMask is not installed");
  }

  try {
    const networkId = await window.ethereum.request({
      method: "net_version",
    });
    return networkId;
  } catch (error) {
    console.error("Error getting network ID:", error);
    throw error;
  }
};

export const switchNetwork = async (networkId) => {
  if (!isMetaMaskInstalled()) {
    throw new Error("MetaMask is not installed");
  }

  try {
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: `0x${Number(networkId).toString(16)}` }],
    });
  } catch (error) {
    console.error("Error switching network:", error);
    throw error;
  }
};

export const addNetwork = async (networkConfig) => {
  if (!isMetaMaskInstalled()) {
    throw new Error("MetaMask is not installed");
  }

  try {
    await window.ethereum.request({
      method: "wallet_addEthereumChain",
      params: [networkConfig],
    });
  } catch (error) {
    console.error("Error adding network:", error);
    throw error;
  }
};

// Listen for account changes
export const onAccountsChanged = (callback) => {
  if (!isMetaMaskInstalled()) {
    return () => {};
  }

  window.ethereum.on("accountsChanged", callback);

  // Return cleanup function
  return () => {
    window.ethereum.removeListener("accountsChanged", callback);
  };
};

// Listen for network changes
export const onChainChanged = (callback) => {
  if (!isMetaMaskInstalled()) {
    return () => {};
  }

  window.ethereum.on("chainChanged", callback);

  // Return cleanup function
  return () => {
    window.ethereum.removeListener("chainChanged", callback);
  };
};

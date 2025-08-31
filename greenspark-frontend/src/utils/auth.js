// Authentication utility functions
import { setCookie, getCookie, deleteCookie } from "./cookies";
import { getCurrentAccount } from "./metamask";

export const isAuthenticated = () => {
  if (typeof window === "undefined") return false;
  const token = getCookie("authToken");
  const userData = getCookie("userData");
  return !!(token && userData);
};

export const getUserData = () => {
  if (typeof window === "undefined") return null;
  try {
    const userData = getCookie("userData");
    return userData ? JSON.parse(decodeURIComponent(userData)) : null;
  } catch (error) {
    console.error("Error parsing user data:", error);
    return null;
  }
};

export const getToken = () => {
  if (typeof window === "undefined") return null;
  return getCookie("authToken");
};

export const getUserType = () => {
  if (typeof window === "undefined") return null;
  return getCookie("userType");
};

export const logout = () => {
  if (typeof window === "undefined") return;
  deleteCookie("authToken");
  deleteCookie("userData");
  deleteCookie("userType");
  // Also clear localStorage for backward compatibility
  localStorage.removeItem("token");
  localStorage.removeItem("userData");
  localStorage.removeItem("userType");
};

export const setAuthData = (token, userData, userType) => {
  if (typeof window === "undefined") return;
  // Store in cookies (primary storage)
  setCookie("authToken", token, 7); // 7 days expiry
  setCookie("userData", encodeURIComponent(JSON.stringify(userData)), 7);
  setCookie("userType", userType, 7);
  
  // Also store in localStorage for backward compatibility
  localStorage.setItem("token", token);
  localStorage.setItem("userData", JSON.stringify(userData));
  localStorage.setItem("userType", userType);
};

// Check MetaMask connection and validate token
export const checkMetaMaskAndToken = async () => {
  try {
    // Check if MetaMask is connected
    const currentAccount = await getCurrentAccount();
    
    if (!currentAccount) {
      // MetaMask not connected, clear all auth data
      logout();
      return { isConnected: false, isAuthenticated: false, account: null };
    }
    
    // MetaMask is connected, check if we have a valid token
    const token = getToken();
    const userData = getUserData();
    
    if (!token || !userData) {
      // No token or user data, clear any existing data
      logout();
      return { isConnected: true, isAuthenticated: false, account: currentAccount };
    }
    
    // Check if the token belongs to the current account
    if (userData.walletAddress && userData.walletAddress.toLowerCase() !== currentAccount.toLowerCase()) {
      // Account changed, clear auth data
      logout();
      return { isConnected: true, isAuthenticated: false, account: currentAccount };
    }
    
    return { isConnected: true, isAuthenticated: true, account: currentAccount };
  } catch (error) {
    console.error("Error checking MetaMask and token:", error);
    // MetaMask error, clear auth data
    logout();
    return { isConnected: false, isAuthenticated: false, account: null };
  }
};

export const formatWalletAddress = (address) => {
  if (!address) return "";
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

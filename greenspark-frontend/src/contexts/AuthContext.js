"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { checkMetaMaskAndToken, isAuthenticated, getUserData } from "@/utils/auth";
import { onAccountsChanged, onChainChanged } from "@/utils/metamask";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    isConnected: false,
    isAuthenticated: false,
    account: null,
    userData: null,
    isLoading: true,
  });

  const checkAuth = async () => {
    try {
      const result = await checkMetaMaskAndToken();
      const userData = result.isAuthenticated ? getUserData() : null;
      
      setAuthState({
        ...result,
        userData,
        isLoading: false,
      });
    } catch (error) {
      console.error("Error checking authentication:", error);
      setAuthState({
        isConnected: false,
        isAuthenticated: false,
        account: null,
        userData: null,
        isLoading: false,
      });
    }
  };

  useEffect(() => {
    // Check authentication on mount
    checkAuth();

    // Set up MetaMask event listeners
    const cleanupAccounts = onAccountsChanged(async (accounts) => {
      if (accounts.length === 0) {
        // MetaMask disconnected
        setAuthState({
          isConnected: false,
          isAuthenticated: false,
          account: null,
          userData: null,
          isLoading: false,
        });
      } else {
        // Account changed, recheck authentication
        await checkAuth();
      }
    });

    const cleanupChain = onChainChanged(() => {
      // Network changed, recheck authentication
      checkAuth();
    });

    // Cleanup listeners on unmount
    return () => {
      cleanupAccounts();
      cleanupChain();
    };
  }, []);

  const value = {
    ...authState,
    checkAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

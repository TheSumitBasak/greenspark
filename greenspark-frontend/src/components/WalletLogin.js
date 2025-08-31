"use client";

import { useState } from "react";
import { requestAccountAccess } from "@/utils/metamask";
import { setAuthData } from "@/utils/auth";
import apiService from "@/services/api";
import { showToast } from "@/utils/toast";

export default function WalletLogin({ onLoginSuccess }) {
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnectWallet = async () => {
    try {
      setIsConnecting(true);
      
      // Request MetaMask account access
      const account = await requestAccountAccess();
      
      if (!account) {
        showToast.error("Failed to connect MetaMask wallet");
        return;
      }

      // Attempt to login with the wallet
      const response = await apiService.loginWithWallet(account);
      
      if (response.success) {
        // Store authentication data
        setAuthData(
          response.token,
          response.user,
          response.user.role || 'user'
        );
        
        showToast.success("Successfully connected and authenticated!");
        
        // Notify parent component
        if (onLoginSuccess) {
          onLoginSuccess();
        }
      } else {
        showToast.error(response.error || "Authentication failed");
      }
    } catch (error) {
      console.error("Error connecting wallet:", error);
      showToast.error("Failed to connect wallet. Please try again.");
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
      <div className="flex">
        <div className="flex-shrink-0">
          <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-blue-800">
            Connect Your Wallet
          </h3>
          <div className="mt-2 text-sm text-blue-700">
            <p>Click the button below to connect your MetaMask wallet and authenticate.</p>
          </div>
          <div className="mt-4">
            <button
              onClick={handleConnectWallet}
              disabled={isConnecting}
              className="btn btn-primary btn-sm"
            >
              {isConnecting ? (
                <>
                  <div className="loading loading-spinner loading-xs"></div>
                  Connecting...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  Connect MetaMask
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

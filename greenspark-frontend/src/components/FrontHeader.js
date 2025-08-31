"use client";

import { useState, useEffect } from "react";
import { Logo } from "./brand/logo";
import Link from "next/link";
import { isMetaMaskInstalled, requestAccountAccess } from "../utils/metamask";
import {
  setAuthData,
  getUserData,
  logout,
  formatWalletAddress,
} from "../utils/auth";
import apiService from "../services/api";

// Login Dialog Component
function LoginDialog({ children, onLoginSuccess }) {
  const [open, setOpen] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState("");

  const connectMetaMask = async () => {
    setIsConnecting(true);
    setError("");

    try {
      // Check if MetaMask is installed
      if (!isMetaMaskInstalled()) {
        setError(
          "MetaMask is not installed. Please install MetaMask to continue."
        );
        setIsConnecting(false);
        return;
      }

      // Request account access
      const walletAddress = await requestAccountAccess();

      if (!walletAddress) {
        setError("No accounts found. Please connect your MetaMask wallet.");
        setIsConnecting(false);
        return;
      }

      console.log("Connected wallet:", walletAddress);

      // Call backend login API
      try {
        const response = await apiService.loginWithWallet(walletAddress);

        if (response.success) {
          // Store token and user data using utility function
          setAuthData(response.token, response.user, response.userType);

          console.log("Login successful:", response);

          // Close modal and notify parent component
          setOpen(false);
          onLoginSuccess(response);
        } else {
          setError(response.error || "Login failed");
        }
      } catch (apiError) {
        console.error("API login error:", apiError);
        if (apiError.message.includes("404")) {
          setError("Wallet not registered. Please sign up first.");
        } else if (apiError.message.includes("403")) {
          setError("Account not verified or banned. Please contact support.");
        } else {
          setError("Login failed. Please try again.");
        }
      }
    } catch (error) {
      console.error("MetaMask connection error:", error);
      if (error.code === 4001) {
        setError("Connection rejected by user.");
      } else if (error.code === -32002) {
        setError("Please check MetaMask for pending requests.");
      } else {
        setError("Failed to connect to MetaMask. Please try again.");
      }
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <>
      <div onClick={() => setOpen(true)}>{children}</div>

      <div className={`modal ${open ? "modal-open" : ""}`}>
        <div className="modal-box">
          <h3 className="font-bold text-lg mb-4">Login with MetaMask</h3>

          <div className="space-y-4">
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-5 h-5 text-orange-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
              <p className="text-gray-600 mb-6">
                Connect your MetaMask wallet to access your account securely
              </p>
            </div>

            {error && (
              <div className="alert alert-error">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>{error}</span>
              </div>
            )}

            <button
              onClick={connectMetaMask}
              disabled={isConnecting}
              className="btn btn-primary w-full"
            >
              {isConnecting ? (
                <>
                  <span className="loading loading-spinner loading-sm"></span>
                  Connecting...
                </>
              ) : (
                <>
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                  Connect MetaMask
                </>
              )}
            </button>

            <div className="text-center">
              <p className="text-sm text-gray-500 mb-2">Don't have a wallet?</p>
              <Link
                href="https://metamask.io/download/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 hover:underline"
              >
                Download MetaMask
              </Link>
            </div>
          </div>

          <div className="modal-action">
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => setOpen(false)}
            >
              Cancel
            </button>
          </div>
        </div>
        <div className="modal-backdrop" onClick={() => setOpen(false)}></div>
      </div>
    </>
  );
}

export default function FrontHeader() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on component mount
    const userData = getUserData();
    if (userData) {
      setUser(userData);
    }
    setIsLoading(false);
  }, []);

  const handleLoginSuccess = (loginResponse) => {
    setUser(loginResponse.user);
  };

  const handleLogout = () => {
    logout();
    setUser(null);
  };

  if (isLoading) {
    return (
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 md:py-5">
          <div className="w-32 h-8 bg-gray-200 rounded animate-pulse"></div>
          <div className="w-64 h-8 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </header>
    );
  }

  return (
    <header className="border-b border-border">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 md:py-5">
        <a
          href="/"
          aria-label="GreenSpark Home"
          className="flex items-center gap-2"
        >
          <Logo />
        </a>
        <nav aria-label="Primary" className="hidden md:block">
          <ul className="flex items-center gap-6">
            <li>
              <a
                href="#about"
                className="text-sm font-medium text-foreground hover:underline underline-offset-4"
              >
                About
              </a>
            </li>
            <li>
              <a
                href="#how"
                className="text-sm font-medium text-foreground hover:underline underline-offset-4"
              >
                How it works
              </a>
            </li>
            <li>
              <a
                href="#reviews"
                className="text-sm font-medium text-foreground hover:underline underline-offset-4"
              >
                Reviews
              </a>
            </li>
            <li>
              <a
                href="/leaderboards"
                className="text-sm font-medium text-foreground hover:underline underline-offset-4"
              >
                Leaderboards
              </a>
            </li>
          </ul>
        </nav>

        {/* Auth Buttons */}
        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3">
              <div className="hidden md:flex items-center gap-2 text-sm text-gray-600">
                <span className="font-medium">
                  {user.name || user.organizationName || "User"}
                </span>
                <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                  {user.type === "user" ? user.role : user.type}
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-500 bg-gray-100 px-3 py-2 rounded">
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
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
                {formatWalletAddress(user.walletAddress)}
              </div>
              <button
                onClick={handleLogout}
                className="btn btn-ghost btn-sm rounded-sm"
              >
                Logout
              </button>
            </div>
          ) : (
            <>
              <LoginDialog onLoginSuccess={handleLoginSuccess}>
                <button className="btn btn-ghost btn-sm rounded-sm">
                  Login
                </button>
              </LoginDialog>
              <Link
                href="/signup"
                className="btn btn-primary btn-sm rounded-sm"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

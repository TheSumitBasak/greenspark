"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Logo } from "@/components/brand/logo";
import Link from "next/link";
import { isMetaMaskInstalled, requestAccountAccess } from "@/utils/metamask";
import apiService from "@/services/api";

export default function SignupPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialRole = searchParams.get("role") || "buyer";

  const [step, setStep] = useState(1);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState("");
  const [walletAddress, setWalletAddress] = useState("");
  const [formData, setFormData] = useState({
    role: initialRole,
    organizationName: "",
    country: "",
    email: "",
  });

  const handleRoleSelect = (role) => {
    setFormData((prev) => ({ ...prev, role }));
    setStep(2);
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

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
      const address = await requestAccountAccess();

      if (!address) {
        setError("No accounts found. Please connect your MetaMask wallet.");
        setIsConnecting(false);
        return;
      }

      setWalletAddress(address);
      console.log("Connected wallet:", address);
      setStep(3);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsRegistering(true);
    setError("");

    try {
      // Prepare user data for registration
      const userData = {
        role: formData.role,
        name: formData.organizationName,
        email: formData.email,
        walletAddress: walletAddress,
        country: formData.country,
        documents: [], // Empty for now, can be added later
      };

      console.log("Registering user:", userData);

      // Call registration API
      const response = await apiService.registerUser(userData);

      if (response.success) {
        console.log("Registration successful:", response);
        setStep(4); // Show success message
      } else {
        setError(response.error || "Registration failed");
      }
    } catch (apiError) {
      console.error("Registration error:", apiError);
      if (apiError.message.includes("400")) {
        setError("Invalid data provided. Please check your information.");
      } else if (apiError.message.includes("409")) {
        setError("User already exists with this email or wallet address.");
      } else {
        setError("Registration failed. Please try again.");
      }
    } finally {
      setIsRegistering(false);
    }
  };

  const countries = [
    "United States",
    "Canada",
    "United Kingdom",
    "Germany",
    "France",
    "Australia",
    "Japan",
    "China",
    "India",
    "Brazil",
    "South Africa",
    "Netherlands",
    "Sweden",
    "Norway",
    "Denmark",
    "Finland",
    "Switzerland",
    "Austria",
    "Italy",
    "Spain",
    "Portugal",
    "Belgium",
    "Luxembourg",
    "New Zealand",
    "Singapore",
    "South Korea",
    "Taiwan",
    "Hong Kong",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br relative">
      <Link href="/" className="absolute left-5 top-5">
        <Logo />
      </Link>
      <div className="mx-auto px-15 py-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[80vh]">
          {/* Left Section - Headline */}
          <div className="space-y-6 md:block hidden">
            <div className="space-y-4">
              <h1 className="text-4xl lg:text-5xl font-bold  leading-tight">
                Join the <span className="text-green-600">Green Hydrogen</span>{" "}
                Revolution
              </h1>
              <p className="text-xl  leading-relaxed">
                Connect with verified producers and buyers in the sustainable
                energy marketplace. Start trading green hydrogen with confidence
                and transparency.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <span className="">Verified producers and buyers only</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <span className="">Blockchain-powered transparency</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <span className="">Secure and compliant trading</span>
              </div>
            </div>
          </div>

          {/* Right Section - Steps */}
          <div data-theme="light" className="rounded-2xl shadow-xl p-8">
            <div className="space-y-6">
              {/* Progress Steps */}
              <div className="flex items-center justify-between mb-8">
                <div
                  className={`flex items-center ${
                    step >= 1 ? "text-green-600" : ""
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                      step >= 1 ? "bg-green-100 text-green-600" : "bg-gray-100 "
                    }`}
                  >
                    1
                  </div>
                  <span className="ml-2 text-sm font-medium">Select Role</span>
                </div>
                <div className="flex-1 h-0.5 bg-gray-200 mx-4"></div>
                <div
                  className={`flex items-center ${
                    step >= 2 ? "text-green-600" : ""
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                      step >= 2 ? "bg-green-100 text-green-600" : "bg-gray-100 "
                    }`}
                  >
                    2
                  </div>
                  <span className="ml-2 text-sm font-medium">Organization</span>
                </div>
                <div className="flex-1 h-0.5 bg-gray-200 mx-4"></div>
                <div
                  className={`flex items-center ${
                    step >= 3 ? "text-green-600" : ""
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                      step >= 3 ? "bg-green-100 text-green-600" : "bg-gray-100 "
                    }`}
                  >
                    3
                  </div>
                  <span className="ml-2 text-sm font-medium">
                    Connect Wallet
                  </span>
                </div>
              </div>

              {/* Step 1: Role Selection */}
              {step === 1 && (
                <div className="space-y-6">
                  {error && (
                    <div className="alert alert-error mb-4">
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

                  <div className="text-center">
                    <h2 className="text-2xl font-bold  mb-2">
                      Choose Your Role
                    </h2>
                    <p className="">
                      Select how you'll participate in the marketplace
                    </p>
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    <button
                      onClick={() => handleRoleSelect("buyer")}
                      className={`p-6 border-2 rounded-xl text-left transition-all hover:shadow-md ${
                        formData.role === "buyer"
                          ? "border-green-500 bg-green-50 ring-2 ring-green-200"
                          : "border-gray-200 hover:border-green-300"
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <div
                          className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                            formData.role === "buyer"
                              ? "bg-green-100"
                              : "bg-gray-100"
                          }`}
                        >
                          <svg
                            className={`w-6 h-6 ${
                              formData.role === "buyer" ? "text-green-600" : ""
                            }`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                            />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold  mb-1">Buyer</h3>
                          <p className=" text-sm">
                            Purchase verified green hydrogen from certified
                            producers
                          </p>
                        </div>
                      </div>
                    </button>

                    <button
                      onClick={() => handleRoleSelect("seller")}
                      className={`p-6 border-2 rounded-xl text-left transition-all hover:shadow-md ${
                        formData.role === "seller"
                          ? "border-green-500 bg-green-50 ring-2 ring-green-200"
                          : "border-gray-200 hover:border-green-300"
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <div
                          className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                            formData.role === "seller"
                              ? "bg-green-100"
                              : "bg-gray-100"
                          }`}
                        >
                          <svg
                            className={`w-6 h-6 ${
                              formData.role === "seller" ? "text-green-600" : ""
                            }`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                            />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold  mb-1">
                            Seller/Producer
                          </h3>
                          <p className=" text-sm">
                            List and sell your verified green hydrogen
                            production
                          </p>
                        </div>
                      </div>
                    </button>
                  </div>
                </div>
              )}

              {/* Step 2: Organization Details */}
              {step === 2 && (
                <div className="space-y-6">
                  <div className="text-center">
                    <h2 className="text-2xl font-bold  mb-2">
                      Organization Details
                    </h2>
                    <p className="">Tell us about your organization</p>
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

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-medium ">
                          Organization Name *
                        </span>
                      </label>
                      <input
                        type="text"
                        placeholder="Enter your organization name"
                        className="input input-bordered w-full"
                        value={formData.organizationName}
                        onChange={(e) =>
                          handleInputChange("organizationName", e.target.value)
                        }
                        required
                      />
                    </div>

                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-medium ">
                          Country *
                        </span>
                      </label>
                      <select
                        className="select select-bordered w-full"
                        value={formData.country}
                        onChange={(e) =>
                          handleInputChange("country", e.target.value)
                        }
                        required
                      >
                        <option value="">Select your country</option>
                        {countries.map((country) => (
                          <option key={country} value={country}>
                            {country}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-medium ">
                          Email Address *
                        </span>
                      </label>
                      <input
                        type="email"
                        placeholder="Enter your business email"
                        className="input input-bordered w-full"
                        value={formData.email}
                        onChange={(e) =>
                          handleInputChange("email", e.target.value)
                        }
                        required
                      />
                    </div>

                    <div className="flex gap-3 pt-4">
                      <button
                        type="button"
                        onClick={() => setStep(1)}
                        className="btn btn-ghost flex-1 rounded"
                      >
                        Back
                      </button>
                      <button
                        type="button"
                        onClick={connectMetaMask}
                        className="rounded btn btn-primary flex-1"
                      >
                        Connect MetaMask
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Step 3: MetaMask Connection */}
              {step === 3 && (
                <div className="space-y-6">
                  <div className="text-center">
                    <h2 className="text-2xl font-bold  mb-2">
                      Connect Your Wallet
                    </h2>
                    <p className="">
                      Connect MetaMask to complete registration
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg
                          className="w-8 h-8 text-orange-600"
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
                        Your wallet address:{" "}
                        <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                          {walletAddress}
                        </span>
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

                    <div className="flex gap-3 pt-4">
                      <button
                        type="button"
                        onClick={() => setStep(2)}
                        className="btn btn-ghost flex-1"
                      >
                        Back
                      </button>
                      <button
                        onClick={handleSubmit}
                        disabled={isRegistering}
                        className="btn btn-primary flex-1"
                      >
                        {isRegistering ? (
                          <>
                            <span className="loading loading-spinner loading-sm"></span>
                            Registering...
                          </>
                        ) : (
                          "Complete Registration"
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 4: Success Message */}
              {step === 4 && (
                <div className="space-y-6 text-center">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg
                      className="w-10 h-10 text-green-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>

                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    Registration Successful!
                  </h2>

                  <div className="space-y-4 text-gray-600">
                    <p>
                      Thank you for joining the GreenSpark. Your
                      account has been created successfully.
                    </p>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h3 className="font-semibold text-blue-800 mb-2">
                        Next Steps:
                      </h3>
                      <ul className="text-sm text-blue-700 space-y-1 text-left">
                        <li>
                          • Admin will verify your account within 24 hours
                        </li>
                        <li>
                          • You'll receive an email notification once verified
                        </li>
                        <li>• After verification, you can start trading</li>
                      </ul>
                    </div>

                    <p className="text-sm text-gray-500">
                      If you have any questions, please contact our support
                      team.
                    </p>
                  </div>

                  <div className="pt-4">
                    <Link href="/" className="btn btn-primary">
                      Return to Home
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

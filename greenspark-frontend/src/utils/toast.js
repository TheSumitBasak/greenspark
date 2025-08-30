import toast from "react-hot-toast";

// Toast utility functions for consistent messaging
export const showToast = {
  // Success notifications
  success: (message, options = {}) => {
    return toast.success(message, {
      duration: 3000,
      ...options,
    });
  },

  // Error notifications
  error: (message, options = {}) => {
    return toast.error(message, {
      duration: 5000,
      ...options,
    });
  },

  // Loading notifications
  loading: (message, options = {}) => {
    return toast.loading(message, {
      ...options,
    });
  },

  // Info notifications (using regular toast)
  info: (message, options = {}) => {
    return toast(message, {
      duration: 4000,
      ...options,
    });
  },

  // Warning notifications
  warning: (message, options = {}) => {
    return toast(message, {
      duration: 4000,
      style: {
        background: "#f59e0b",
        color: "#fff",
      },
      ...options,
    });
  },

  // Dismiss a specific toast
  dismiss: (toastId) => {
    toast.dismiss(toastId);
  },

  // Dismiss all toasts
  dismissAll: () => {
    toast.dismiss();
  },
};

// Specific toast messages for common actions
export const toastMessages = {
  // Leaderboard related
  leaderboard: {
    loading: "Loading leaderboard data...",
    success: "Leaderboard data loaded successfully!",
    error: "Failed to fetch leaderboard data",
    noData: "No leaderboard data available for this month",
    monthChanged: (month) => `Switched to ${month}`,
    refreshing: "Refreshing data...",
    profileView: (name) => `Viewing ${name}'s profile`,
  },

  // Blockchain related
  blockchain: {
    connected: "Blockchain connection established",
    error: "Failed to connect to blockchain",
    loading: "Connecting to blockchain...",
  },

  // General
  general: {
    welcome: "Welcome to the Leaderboard! 🏆",
    error: "Something went wrong",
    loading: "Loading...",
  },
};

export default showToast;

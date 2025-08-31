# User Management System

## Overview

The user management system allows administrators to view, filter, and manage user accounts with pagination support and verification functionality. The system now includes MetaMask authentication and secure token management using cookies.

## Features

### 1. User Listing with Pagination

- **API Endpoint**: `GET /api/users`
- **Query Parameters**:
  - `page`: Page number (default: 1)
  - `limit`: Items per page (default: 10)
  - `status`: Filter by user status (pending, verified, rejected, banned)
  - `role`: Filter by user role (buyer, seller)

### 2. User Verification

- **API Endpoint**: `PUT /api/users/:userId/verify`
- **Request Body**: `{ "verified": boolean }`
- **Actions**:
  - Verify user: Sets status to "verified" and registers on blockchain
  - Reject user: Removes user from database and user management interface

### 3. User Banning

- **API Endpoint**: `PUT /api/users/:userId/ban`
- **Request Body**: `{ "banned": boolean }`
- **Actions**:
  - Ban user: Sets status to "banned"
  - Unban user: Sets status to "pending"

### 4. MetaMask Authentication

- **Automatic Checking**: On page load, checks MetaMask connection status
- **Token Validation**: Validates stored tokens against current wallet address
- **Auto-Cleanup**: Automatically removes invalid/expired tokens
- **Real-time Updates**: Listens for wallet account and network changes

## Frontend Components

### User Management Page (`/admin/users`)

- **Location**: `greenspark-frontend/src/app/admin/users/page.jsx`
- **Features**:
  - Real-time user data fetching with pagination
  - Status filtering (All, Pending, Verified, Banned)
  - Search functionality by name or email
  - Verify/Reject buttons for pending users
  - Ban/Unban buttons for verified/banned users
  - Loading states and error handling
  - Toast notifications for success/error feedback
  - Refresh button to reload data
  - MetaMask connection status indicator
  - Wallet address display

### Authentication Context

- **Location**: `greenspark-frontend/src/contexts/AuthContext.js`
- **Features**:
  - Global authentication state management
  - MetaMask connection monitoring
  - Automatic token validation
  - Event listener management

### Wallet Login Component

- **Location**: `greenspark-frontend/src/components/WalletLogin.js`
- **Features**:
  - MetaMask wallet connection
  - Authentication flow
  - Loading states and error handling

### API Service

- **Location**: `greenspark-frontend/src/services/api.js`
- **Methods**:
  - `getAllUsers(page, limit, status, role)`: Fetch users with pagination
  - `verifyUser(userId, verified)`: Verify or reject a user
  - `banUser(userId, banned)`: Ban or unban a user
  - **Authentication**: Automatically includes cookies-based tokens

## User Status Flow

1. **Pending**: New user registration awaiting verification
2. **Verified**: User approved and registered on blockchain
3. **Rejected**: User rejected and permanently removed from system
4. **Banned**: User temporarily suspended

## Authentication & Security

### MetaMask Integration

- **Connection Check**: Verifies MetaMask is installed and connected
- **Account Validation**: Ensures token belongs to current wallet address
- **Network Monitoring**: Detects network changes and revalidates

### Token Management

- **Storage**: Tokens stored in secure HTTP-only cookies (7-day expiry)
- **Auto-Cleanup**: Invalid tokens automatically removed
- **Backward Compatibility**: Also stores in localStorage for legacy support

### Security Features

- **SameSite=Strict**: Prevents CSRF attacks
- **Automatic Cleanup**: Removes tokens on wallet disconnect/change
- **Real-time Validation**: Continuous authentication state monitoring

## Error Handling

- **Network errors** are caught and displayed as toast notifications
- **API errors** include detailed error messages
- **Loading states** prevent multiple simultaneous requests
- **Error boundaries** provide fallback UI
- **Authentication errors** trigger automatic cleanup

## Usage Example

```javascript
// Fetch users with pagination
const response = await apiService.getAllUsers(1, 10, "pending");

// Verify a user
await apiService.verifyUser("userId123", true);

// Ban a user
await apiService.banUser("userId123", true);

// Check authentication status
const { isConnected, isAuthenticated, account } = useAuth();
```

## Dependencies

- **React Hot Toast** for notifications
- **DaisyUI** for UI components
- **Next.js** for routing and API integration
- **MetaMask** for wallet authentication
- **Custom Cookie Utils** for secure token storage

## Setup & Configuration

### Environment Variables

```bash
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

### Cookie Configuration

- **Expiry**: 7 days
- **SameSite**: Strict
- **Secure**: HTTPS only (in production)
- **Path**: Root domain

### MetaMask Requirements

- MetaMask extension installed
- Wallet connected to appropriate network
- User account unlocked

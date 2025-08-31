// Smart Contract Configuration
export const CONTRACT_CONFIG = {
  // Contract address on ganache network
  ADDRESS: "0xf59212C3aCA5aB43bee6891002611D4082B4AceE",

  // Contract ABI - only the functions we need for voting
  ABI: [
    {
      inputs: [],
      stateMutability: "nonpayable",
      type: "constructor",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "sender",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "tokenId",
          type: "uint256",
        },
        {
          internalType: "address",
          name: "owner",
          type: "address",
        },
      ],
      name: "ERC721IncorrectOwner",
      type: "error",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "operator",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "tokenId",
          type: "uint256",
        },
      ],
      name: "ERC721InsufficientApproval",
      type: "error",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "approver",
          type: "address",
        },
      ],
      name: "ERC721InvalidApprover",
      type: "error",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "operator",
          type: "address",
        },
      ],
      name: "ERC721InvalidOperator",
      type: "error",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "owner",
          type: "address",
        },
      ],
      name: "ERC721InvalidOwner",
      type: "error",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "receiver",
          type: "address",
        },
      ],
      name: "ERC721InvalidReceiver",
      type: "error",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "sender",
          type: "address",
        },
      ],
      name: "ERC721InvalidSender",
      type: "error",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "tokenId",
          type: "uint256",
        },
      ],
      name: "ERC721NonexistentToken",
      type: "error",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "owner",
          type: "address",
        },
      ],
      name: "OwnableInvalidOwner",
      type: "error",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "account",
          type: "address",
        },
      ],
      name: "OwnableUnauthorizedAccount",
      type: "error",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "owner",
          type: "address",
        },
        {
          indexed: true,
          internalType: "address",
          name: "approved",
          type: "address",
        },
        {
          indexed: true,
          internalType: "uint256",
          name: "tokenId",
          type: "uint256",
        },
      ],
      name: "Approval",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "owner",
          type: "address",
        },
        {
          indexed: true,
          internalType: "address",
          name: "operator",
          type: "address",
        },
        {
          indexed: false,
          internalType: "bool",
          name: "approved",
          type: "bool",
        },
      ],
      name: "ApprovalForAll",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "previousOwner",
          type: "address",
        },
        {
          indexed: true,
          internalType: "address",
          name: "newOwner",
          type: "address",
        },
      ],
      name: "OwnershipTransferred",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "uint256",
          name: "tokenId",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "address",
          name: "owner",
          type: "address",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "amount",
          type: "uint256",
        },
      ],
      name: "TokenMinted",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "uint256",
          name: "tokenId",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "address",
          name: "from",
          type: "address",
        },
        {
          indexed: false,
          internalType: "address",
          name: "to",
          type: "address",
        },
      ],
      name: "TokenTransferred",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "uint256",
          name: "transactionId",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "address",
          name: "from",
          type: "address",
        },
        {
          indexed: false,
          internalType: "address",
          name: "to",
          type: "address",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "amount",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "string",
          name: "transactionType",
          type: "string",
        },
      ],
      name: "TransactionRecorded",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "from",
          type: "address",
        },
        {
          indexed: true,
          internalType: "address",
          name: "to",
          type: "address",
        },
        {
          indexed: true,
          internalType: "uint256",
          name: "tokenId",
          type: "uint256",
        },
      ],
      name: "Transfer",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "address",
          name: "wallet",
          type: "address",
        },
        {
          indexed: false,
          internalType: "bool",
          name: "banned",
          type: "bool",
        },
      ],
      name: "UserBanned",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "address",
          name: "wallet",
          type: "address",
        },
        {
          indexed: false,
          internalType: "string",
          name: "role",
          type: "string",
        },
      ],
      name: "UserRegistered",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "address",
          name: "wallet",
          type: "address",
        },
        {
          indexed: false,
          internalType: "bool",
          name: "verified",
          type: "bool",
        },
      ],
      name: "UserVerified",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "uint256",
          name: "submissionId",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "address",
          name: "verifier",
          type: "address",
        },
      ],
      name: "VerificationApproved",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "uint256",
          name: "submissionId",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "address",
          name: "verifier",
          type: "address",
        },
      ],
      name: "VerificationRejected",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "uint256",
          name: "submissionId",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "address",
          name: "seller",
          type: "address",
        },
      ],
      name: "VerificationSubmitted",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "address",
          name: "wallet",
          type: "address",
        },
        {
          indexed: false,
          internalType: "string",
          name: "organizationName",
          type: "string",
        },
      ],
      name: "VerifierRegistered",
      type: "event",
    },
    {
      inputs: [],
      name: "MIN_VOTES_FOR_APPROVAL",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "VOTE_DURATION",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "admin",
          type: "address",
        },
      ],
      name: "addAdmin",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "",
          type: "address",
        },
      ],
      name: "admins",
      outputs: [
        {
          internalType: "bool",
          name: "",
          type: "bool",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "to",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "tokenId",
          type: "uint256",
        },
      ],
      name: "approve",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "submissionId",
          type: "uint256",
        },
        {
          internalType: "address",
          name: "verifier",
          type: "address",
        },
      ],
      name: "approveVerification",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "owner",
          type: "address",
        },
      ],
      name: "balanceOf",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "wallet",
          type: "address",
        },
        {
          internalType: "bool",
          name: "banned",
          type: "bool",
        },
      ],
      name: "banUser",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "verifier",
          type: "address",
        },
        {
          internalType: "address",
          name: "voter",
          type: "address",
        },
      ],
      name: "canVote",
      outputs: [
        {
          internalType: "bool",
          name: "",
          type: "bool",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "getActiveVotingVerifiers",
      outputs: [
        {
          internalType: "address[]",
          name: "wallets",
          type: "address[]",
        },
        {
          internalType: "string[]",
          name: "organizationNames",
          type: "string[]",
        },
        {
          internalType: "string[]",
          name: "emails",
          type: "string[]",
        },
        {
          internalType: "uint256[]",
          name: "yesVotes",
          type: "uint256[]",
        },
        {
          internalType: "uint256[]",
          name: "noVotes",
          type: "uint256[]",
        },
        {
          internalType: "uint256[]",
          name: "totalVotes",
          type: "uint256[]",
        },
        {
          internalType: "uint256[]",
          name: "votesNeeded",
          type: "uint256[]",
        },
        {
          internalType: "uint256[]",
          name: "voteEnds",
          type: "uint256[]",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "getAllVerifiers",
      outputs: [
        {
          internalType: "address[]",
          name: "wallets",
          type: "address[]",
        },
        {
          internalType: "string[]",
          name: "organizationNames",
          type: "string[]",
        },
        {
          internalType: "string[]",
          name: "emails",
          type: "string[]",
        },
        {
          internalType: "bool[]",
          name: "active",
          type: "bool[]",
        },
        {
          internalType: "bool[]",
          name: "banned",
          type: "bool[]",
        },
        {
          internalType: "bool[]",
          name: "voteStarted",
          type: "bool[]",
        },
        {
          internalType: "uint256[]",
          name: "yesVotes",
          type: "uint256[]",
        },
        {
          internalType: "uint256[]",
          name: "noVotes",
          type: "uint256[]",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "tokenId",
          type: "uint256",
        },
      ],
      name: "getApproved",
      outputs: [
        {
          internalType: "address",
          name: "",
          type: "address",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "tokenId",
          type: "uint256",
        },
      ],
      name: "getTokenData",
      outputs: [
        {
          components: [
            {
              internalType: "uint256",
              name: "tokenId",
              type: "uint256",
            },
            {
              internalType: "address",
              name: "owner",
              type: "address",
            },
            {
              internalType: "uint256",
              name: "amount",
              type: "uint256",
            },
            {
              internalType: "string[]",
              name: "documents",
              type: "string[]",
            },
            {
              internalType: "bool",
              name: "verified",
              type: "bool",
            },
            {
              internalType: "uint256",
              name: "timestamp",
              type: "uint256",
            },
            {
              internalType: "address",
              name: "producer",
              type: "address",
            },
          ],
          internalType: "struct GHCToken.GHCTokenData",
          name: "",
          type: "tuple",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "transactionId",
          type: "uint256",
        },
      ],
      name: "getTransaction",
      outputs: [
        {
          internalType: "uint256",
          name: "id",
          type: "uint256",
        },
        {
          internalType: "address",
          name: "from",
          type: "address",
        },
        {
          internalType: "address",
          name: "to",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "amount",
          type: "uint256",
        },
        {
          internalType: "string",
          name: "transactionType",
          type: "string",
        },
        {
          internalType: "uint256",
          name: "timestamp",
          type: "uint256",
        },
        {
          internalType: "bool",
          name: "success",
          type: "bool",
        },
        {
          internalType: "string",
          name: "details",
          type: "string",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "wallet",
          type: "address",
        },
      ],
      name: "getUserData",
      outputs: [
        {
          components: [
            {
              internalType: "address",
              name: "wallet",
              type: "address",
            },
            {
              internalType: "string",
              name: "role",
              type: "string",
            },
            {
              internalType: "string[]",
              name: "documents",
              type: "string[]",
            },
            {
              internalType: "string",
              name: "country",
              type: "string",
            },
            {
              internalType: "bool",
              name: "verified",
              type: "bool",
            },
            {
              internalType: "bool",
              name: "banned",
              type: "bool",
            },
            {
              internalType: "string[]",
              name: "badges",
              type: "string[]",
            },
          ],
          internalType: "struct GHCToken.User",
          name: "",
          type: "tuple",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "user",
          type: "address",
        },
      ],
      name: "getUserTransactionCount",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "user",
          type: "address",
        },
      ],
      name: "getUserTransactionHistory",
      outputs: [
        {
          internalType: "uint256[]",
          name: "transactionIds",
          type: "uint256[]",
        },
        {
          internalType: "address[]",
          name: "fromAddresses",
          type: "address[]",
        },
        {
          internalType: "address[]",
          name: "toAddresses",
          type: "address[]",
        },
        {
          internalType: "uint256[]",
          name: "amounts",
          type: "uint256[]",
        },
        {
          internalType: "string[]",
          name: "transactionTypes",
          type: "string[]",
        },
        {
          internalType: "uint256[]",
          name: "timestamps",
          type: "uint256[]",
        },
        {
          internalType: "bool[]",
          name: "successStatuses",
          type: "bool[]",
        },
        {
          internalType: "string[]",
          name: "details",
          type: "string[]",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "submissionId",
          type: "uint256",
        },
      ],
      name: "getVerificationSubmission",
      outputs: [
        {
          components: [
            {
              internalType: "uint256",
              name: "id",
              type: "uint256",
            },
            {
              internalType: "address",
              name: "seller",
              type: "address",
            },
            {
              internalType: "uint256",
              name: "amount",
              type: "uint256",
            },
            {
              internalType: "string[]",
              name: "documents",
              type: "string[]",
            },
            {
              internalType: "address",
              name: "verifier",
              type: "address",
            },
            {
              internalType: "bool",
              name: "approved",
              type: "bool",
            },
            {
              internalType: "bool",
              name: "rejected",
              type: "bool",
            },
            {
              internalType: "uint256",
              name: "timestamp",
              type: "uint256",
            },
          ],
          internalType: "struct GHCToken.VerificationSubmission",
          name: "",
          type: "tuple",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "verifier",
          type: "address",
        },
      ],
      name: "getVerifierData",
      outputs: [
        {
          internalType: "address",
          name: "wallet",
          type: "address",
        },
        {
          internalType: "string",
          name: "organizationName",
          type: "string",
        },
        {
          internalType: "string",
          name: "email",
          type: "string",
        },
        {
          internalType: "bool",
          name: "active",
          type: "bool",
        },
        {
          internalType: "bool",
          name: "banned",
          type: "bool",
        },
        {
          internalType: "bool",
          name: "voteStarted",
          type: "bool",
        },
        {
          internalType: "uint256",
          name: "voteStart",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "voteEnd",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "yesVotes",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "noVotes",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "verifier",
          type: "address",
        },
        {
          internalType: "address",
          name: "voter",
          type: "address",
        },
      ],
      name: "hasVoted",
      outputs: [
        {
          internalType: "bool",
          name: "",
          type: "bool",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "wallet",
          type: "address",
        },
      ],
      name: "isAdmin",
      outputs: [
        {
          internalType: "bool",
          name: "",
          type: "bool",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "owner",
          type: "address",
        },
        {
          internalType: "address",
          name: "operator",
          type: "address",
        },
      ],
      name: "isApprovedForAll",
      outputs: [
        {
          internalType: "bool",
          name: "",
          type: "bool",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "verifier",
          type: "address",
        },
      ],
      name: "isVoteStarted",
      outputs: [
        {
          internalType: "bool",
          name: "",
          type: "bool",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "name",
      outputs: [
        {
          internalType: "string",
          name: "",
          type: "string",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "owner",
      outputs: [
        {
          internalType: "address",
          name: "",
          type: "address",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "tokenId",
          type: "uint256",
        },
      ],
      name: "ownerOf",
      outputs: [
        {
          internalType: "address",
          name: "",
          type: "address",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "wallet",
          type: "address",
        },
        {
          internalType: "string",
          name: "role",
          type: "string",
        },
        {
          internalType: "string",
          name: "country",
          type: "string",
        },
        {
          internalType: "string[]",
          name: "documents",
          type: "string[]",
        },
      ],
      name: "registerUser",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "wallet",
          type: "address",
        },
        {
          internalType: "string",
          name: "organizationName",
          type: "string",
        },
        {
          internalType: "string",
          name: "email",
          type: "string",
        },
        {
          internalType: "string[]",
          name: "documents",
          type: "string[]",
        },
      ],
      name: "registerVerifier",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "submissionId",
          type: "uint256",
        },
        {
          internalType: "address",
          name: "verifier",
          type: "address",
        },
      ],
      name: "rejectVerification",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [],
      name: "renounceOwnership",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "from",
          type: "address",
        },
        {
          internalType: "address",
          name: "to",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "tokenId",
          type: "uint256",
        },
      ],
      name: "safeTransferFrom",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "from",
          type: "address",
        },
        {
          internalType: "address",
          name: "to",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "tokenId",
          type: "uint256",
        },
        {
          internalType: "bytes",
          name: "data",
          type: "bytes",
        },
      ],
      name: "safeTransferFrom",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "operator",
          type: "address",
        },
        {
          internalType: "bool",
          name: "approved",
          type: "bool",
        },
      ],
      name: "setApprovalForAll",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "verifier",
          type: "address",
        },
      ],
      name: "startVerifierVote",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "amount",
          type: "uint256",
        },
        {
          internalType: "string[]",
          name: "documents",
          type: "string[]",
        },
      ],
      name: "submitVerification",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "bytes4",
          name: "interfaceId",
          type: "bytes4",
        },
      ],
      name: "supportsInterface",
      outputs: [
        {
          internalType: "bool",
          name: "",
          type: "bool",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "symbol",
      outputs: [
        {
          internalType: "string",
          name: "",
          type: "string",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "tokenId",
          type: "uint256",
        },
      ],
      name: "tokenURI",
      outputs: [
        {
          internalType: "string",
          name: "",
          type: "string",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      name: "tokens",
      outputs: [
        {
          internalType: "uint256",
          name: "tokenId",
          type: "uint256",
        },
        {
          internalType: "address",
          name: "owner",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "amount",
          type: "uint256",
        },
        {
          internalType: "bool",
          name: "verified",
          type: "bool",
        },
        {
          internalType: "uint256",
          name: "timestamp",
          type: "uint256",
        },
        {
          internalType: "address",
          name: "producer",
          type: "address",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      name: "transactions",
      outputs: [
        {
          internalType: "uint256",
          name: "id",
          type: "uint256",
        },
        {
          internalType: "address",
          name: "from",
          type: "address",
        },
        {
          internalType: "address",
          name: "to",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "amount",
          type: "uint256",
        },
        {
          internalType: "string",
          name: "transactionType",
          type: "string",
        },
        {
          internalType: "uint256",
          name: "timestamp",
          type: "uint256",
        },
        {
          internalType: "bool",
          name: "success",
          type: "bool",
        },
        {
          internalType: "string",
          name: "details",
          type: "string",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "from",
          type: "address",
        },
        {
          internalType: "address",
          name: "to",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "tokenId",
          type: "uint256",
        },
      ],
      name: "transferFrom",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "newOwner",
          type: "address",
        },
      ],
      name: "transferOwnership",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "tokenId",
          type: "uint256",
        },
        {
          internalType: "address",
          name: "to",
          type: "address",
        },
      ],
      name: "transferToken",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      name: "userTransactions",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "",
          type: "address",
        },
      ],
      name: "users",
      outputs: [
        {
          internalType: "address",
          name: "wallet",
          type: "address",
        },
        {
          internalType: "string",
          name: "role",
          type: "string",
        },
        {
          internalType: "string",
          name: "country",
          type: "string",
        },
        {
          internalType: "bool",
          name: "verified",
          type: "bool",
        },
        {
          internalType: "bool",
          name: "banned",
          type: "bool",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      name: "verificationSubmissions",
      outputs: [
        {
          internalType: "uint256",
          name: "id",
          type: "uint256",
        },
        {
          internalType: "address",
          name: "seller",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "amount",
          type: "uint256",
        },
        {
          internalType: "address",
          name: "verifier",
          type: "address",
        },
        {
          internalType: "bool",
          name: "approved",
          type: "bool",
        },
        {
          internalType: "bool",
          name: "rejected",
          type: "bool",
        },
        {
          internalType: "uint256",
          name: "timestamp",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      name: "verifierList",
      outputs: [
        {
          internalType: "address",
          name: "",
          type: "address",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "",
          type: "address",
        },
      ],
      name: "verifiers",
      outputs: [
        {
          internalType: "address",
          name: "wallet",
          type: "address",
        },
        {
          internalType: "string",
          name: "organizationName",
          type: "string",
        },
        {
          internalType: "string",
          name: "email",
          type: "string",
        },
        {
          internalType: "bool",
          name: "active",
          type: "bool",
        },
        {
          internalType: "bool",
          name: "banned",
          type: "bool",
        },
        {
          internalType: "bool",
          name: "voteStarted",
          type: "bool",
        },
        {
          internalType: "uint256",
          name: "voteStart",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "voteEnd",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "yesVotes",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "noVotes",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "wallet",
          type: "address",
        },
        {
          internalType: "bool",
          name: "verified",
          type: "bool",
        },
      ],
      name: "verifyUser",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "verifier",
          type: "address",
        },
        {
          internalType: "bool",
          name: "support",
          type: "bool",
        },
      ],
      name: "voteForVerifier",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
  ],
  // Network configuration
  NETWORKS: {
    // Local development (Ganache)
    ganache: {
      chainId: 1337,
      name: "Ganache Local",
      rpcUrl: "http://127.0.0.1:7545",
    },
    // Sepolia testnet
    sepolia: {
      chainId: 11155111,
      name: "Sepolia Testnet",
      rpcUrl: "https://sepolia.infura.io/v3/YOUR-PROJECT-ID",
    },
    // Mainnet
    mainnet: {
      chainId: 1,
      name: "Ethereum Mainnet",
      rpcUrl: "https://mainnet.infura.io/v3/YOUR-PROJECT-ID",
    },
  },

  // Default network to use
  DEFAULT_NETWORK: "ganache",
};

// Helper function to get contract instance
export const getContractInstance = (signer) => {
  const { ethers } = require("ethers");

  // Validate contract address
  if (
    !CONTRACT_CONFIG.ADDRESS ||
    CONTRACT_CONFIG.ADDRESS === "0x1234567890123456789012345678901234567890"
  ) {
    throw new Error(
      "Please set a valid contract address in src/config/contract.js"
    );
  }

  // Validate address format
  if (!ethers.utils.isAddress(CONTRACT_CONFIG.ADDRESS)) {
    throw new Error(`Invalid contract address: ${CONTRACT_CONFIG.ADDRESS}`);
  }

  return new ethers.Contract(
    CONTRACT_CONFIG.ADDRESS,
    CONTRACT_CONFIG.ABI,
    signer
  );
};

// Helper function to get provider
export const getProvider = () => {
  const { ethers } = require("ethers");
  if (typeof window !== "undefined" && window.ethereum) {
    return new ethers.providers.Web3Provider(window.ethereum);
  }
  return null;
};

// Helper function to get signer
export const getSigner = async () => {
  const provider = await getProvider();
  if (provider) {
    return await provider.getSigner();
  }
  return null;
};

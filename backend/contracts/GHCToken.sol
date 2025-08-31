// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
contract GHCToken is ERC721, Ownable {
    uint256 private _tokenIds;
    
    struct GHCTokenData {
        uint256 tokenId;
        address owner;
        uint256 amount;
        string[] documents;
        bool verified;
        uint256 timestamp;
        address producer;
    }
    
    struct User {
        address wallet;
        string role;
        string[] documents;
        string country;
        bool verified;
        bool banned;
        string[] badges;
    }
    
    struct Verifier {
        address wallet;
        string organizationName;
        string email;
        string[] documents;
        bool active;
        bool banned;
        bool voteStarted;
        uint256 voteStart;
        uint256 voteEnd;
        uint256 yesVotes;
        uint256 noVotes;
        mapping(address => bool) hasVoted;
    }
    
    struct VerificationSubmission {
        uint256 id;
        address seller;
        uint256 amount;
        string[] documents;
        address verifier;
        bool approved;
        bool rejected;
        uint256 timestamp;
    }
    
    struct Transaction {
        uint256 id;
        address from;
        address to;
        uint256 amount;
        string transactionType; // "mint", "transfer", "verification"
        uint256 timestamp;
        bool success;
        string details;
    }
    
    mapping(uint256 => GHCTokenData) public tokens;
    mapping(address => User) public users;
    mapping(address => Verifier) public verifiers;
    mapping(uint256 => VerificationSubmission) public verificationSubmissions;
    mapping(address => bool) public admins;
    
    // Array to track all registered verifier addresses for iteration
    address[] public verifierList;
    
    // Transaction tracking
    uint256 private _transactionIds;
    mapping(uint256 => Transaction) public transactions;
    mapping(address => uint256[]) public userTransactions;
    
    event TokenMinted(uint256 tokenId, address owner, uint256 amount);
    event TokenTransferred(uint256 tokenId, address from, address to);
    event UserRegistered(address wallet, string role);
    event UserVerified(address wallet, bool verified);
    event UserBanned(address wallet, bool banned);
    event VerifierRegistered(address wallet, string organizationName);
    event VerificationSubmitted(uint256 submissionId, address seller);
    event VerificationApproved(uint256 submissionId, address verifier);
    event VerificationRejected(uint256 submissionId, address verifier);
    event TransactionRecorded(uint256 transactionId, address from, address to, uint256 amount, string transactionType);
    
    uint256 public constant VOTE_DURATION = 7 days;
    uint256 public constant MIN_VOTES_FOR_APPROVAL = 3;
    
    constructor() ERC721("Green Hydrogen Credit", "GHC") Ownable(msg.sender) {
        admins[msg.sender] = true;
    }
    
    modifier onlyAdmin() {
        require(admins[msg.sender], "Only admin can call this function");
        _;
    }
    
    modifier onlyVerifier() {
        require(verifiers[msg.sender].active && !verifiers[msg.sender].banned, "Only active verifier");
        _;
    }
    
    modifier onlyVerifiedUser() {
        require(users[msg.sender].verified && !users[msg.sender].banned, "User must be verified");
        _;
    }
    
    function addAdmin(address admin) external onlyOwner {
        admins[admin] = true;
    }
    
    function registerUser(
        address wallet,
        string memory role,
        string memory country,
        string[] memory documents
    ) external onlyAdmin {
        require(!users[wallet].verified, "User already registered");
        
        users[wallet] = User({
            wallet: wallet,
            role: role,
            documents: documents,
            country: country,
            verified: false,
            banned: false,
            badges: new string[](0)
        });
        
        emit UserRegistered(wallet, role);
    }
    
    function verifyUser(address wallet, bool verified) external onlyAdmin {
        require(users[wallet].wallet != address(0), "User not found");
        users[wallet].verified = verified;
        emit UserVerified(wallet, verified);
    }
    
    function banUser(address wallet, bool banned) external onlyAdmin {
        require(users[wallet].wallet != address(0), "User not found");
        users[wallet].banned = banned;
        emit UserBanned(wallet, banned);
    }
    
    function registerVerifier(
        address wallet,
        string memory organizationName,
        string memory email,
        string[] memory documents
    ) external onlyAdmin {
        require(verifiers[wallet].wallet == address(0), "Verifier already registered");
        
        Verifier storage verifier = verifiers[wallet];
        verifier.wallet = wallet;
        verifier.organizationName = organizationName;
        verifier.email = email;
        verifier.documents = documents;
        verifier.active = false;
        verifier.banned = false;
        verifier.voteStarted = false;
        verifier.voteStart = 0;
        verifier.voteEnd = 0;
        verifier.yesVotes = 0;
        verifier.noVotes = 0;
        
        // Add to verifier list for iteration
        verifierList.push(wallet);
        
        emit VerifierRegistered(wallet, organizationName);
    }
    
    function startVerifierVote(address verifier) external onlyAdmin {
        require(verifiers[verifier].wallet != address(0), "Verifier not found");
        require(!verifiers[verifier].active, "Verifier already active");
        require(!verifiers[verifier].voteStarted, "Voting already started");
        
        verifiers[verifier].voteStarted = true;
        verifiers[verifier].voteStart = block.timestamp;
        verifiers[verifier].voteEnd = block.timestamp + VOTE_DURATION;
    }
    function getActiveVotingVerifiers() external view returns (
        address[] memory wallets,
        string[] memory organizationNames,
        string[] memory emails,
        uint256[] memory yesVotes,
        uint256[] memory noVotes,
        uint256[] memory totalVotes,
        uint256[] memory votesNeeded,
        uint256[] memory voteEnds
    ) {
        // First, count how many verifiers have voting ongoing and not closed
        uint256 count = 0;
        for (uint256 i = 0; i < verifierList.length; i++) {
            Verifier storage v = verifiers[verifierList[i]];
            if (
                v.voteStarted &&
                block.timestamp >= v.voteStart &&
                block.timestamp <= v.voteEnd &&
                !v.active &&
                !v.banned
            ) {
                count++;
            }
        }

        // Prepare arrays
        wallets = new address[](count);
        organizationNames = new string[](count);
        emails = new string[](count);
        yesVotes = new uint256[](count);
        noVotes = new uint256[](count);
        totalVotes = new uint256[](count);
        votesNeeded = new uint256[](count);
        voteEnds = new uint256[](count);

        uint256 idx = 0;
        for (uint256 i = 0; i < verifierList.length; i++) {
            Verifier storage v = verifiers[verifierList[i]];
            if (
                v.voteStarted &&
                block.timestamp >= v.voteStart &&
                block.timestamp <= v.voteEnd &&
                !v.active &&
                !v.banned
            ) {
                wallets[idx] = v.wallet;
                organizationNames[idx] = v.organizationName;
                emails[idx] = v.email;
                yesVotes[idx] = v.yesVotes;
                noVotes[idx] = v.noVotes;
                totalVotes[idx] = v.yesVotes + v.noVotes;
                votesNeeded[idx] = MIN_VOTES_FOR_APPROVAL;
                voteEnds[idx] = v.voteEnd;
                idx++;
            }
        }
        // Default return for view
        return (
            wallets,
            organizationNames,
            emails,
            yesVotes,
            noVotes,
            totalVotes,
            votesNeeded,
            voteEnds
        );
    }
    function getAllVerifiers() external view returns (
        address[] memory wallets,
        string[] memory organizationNames,
        string[] memory emails,
        bool[] memory active,
        bool[] memory banned,
        bool[] memory voteStarted,
        uint256[] memory yesVotes,
        uint256[] memory noVotes
    ) {
        uint256 count = verifierList.length;

        wallets = new address[](count);
        organizationNames = new string[](count);
        emails = new string[](count);
        active = new bool[](count);
        banned = new bool[](count);
        voteStarted = new bool[](count);
        yesVotes = new uint256[](count);
        noVotes = new uint256[](count);

        for (uint256 i = 0; i < count; i++) {
            Verifier storage v = verifiers[verifierList[i]];
            wallets[i] = v.wallet;
            organizationNames[i] = v.organizationName;
            emails[i] = v.email;
            active[i] = v.active;
            banned[i] = v.banned;
            voteStarted[i] = v.voteStarted;
            yesVotes[i] = v.yesVotes;
            noVotes[i] = v.noVotes;
        }
        // Default return for view
        return (
            wallets,
            organizationNames,
            emails,
            active,
            banned,
            voteStarted,
            yesVotes,
            noVotes
        );
    }

    function voteForVerifier(address verifier, bool support) external {
        require(verifiers[verifier].wallet != address(0), "Verifier not found");
        require(block.timestamp <= verifiers[verifier].voteEnd, "Voting period ended");
        require(!verifiers[verifier].hasVoted[msg.sender], "Already voted");
        
        // Check if the voter is a registered user or verifier
        bool isRegisteredUser = users[msg.sender].wallet != address(0);
        bool isRegisteredVerifier = verifiers[msg.sender].wallet != address(0);
        
        require(isRegisteredUser || isRegisteredVerifier, "Only registered users and verifiers can vote");
        
        // If it's a user, they must be verified and not banned
        if (isRegisteredUser) {
            require(users[msg.sender].verified && !users[msg.sender].banned, "User must be verified and not banned to vote");
        }
        
        // If it's a verifier, they must be active and not banned
        if (isRegisteredVerifier) {
            require(verifiers[msg.sender].active && !verifiers[msg.sender].banned, "Verifier must be active and not banned to vote");
        }
        
        verifiers[verifier].hasVoted[msg.sender] = true;
        
        if (support) {
            verifiers[verifier].yesVotes++;
        } else {
            verifiers[verifier].noVotes++;
        }
        
        if (verifiers[verifier].yesVotes >= MIN_VOTES_FOR_APPROVAL) {
            verifiers[verifier].active = true;
        }
    }
    
    function submitVerification(
        uint256 amount,
        string[] memory documents
    ) external onlyVerifiedUser returns (uint256) {
        require(keccak256(bytes(users[msg.sender].role)) == keccak256(bytes("seller")), "Only sellers");
        
        uint256 submissionId = _tokenIds;
        _tokenIds++;
        
        verificationSubmissions[submissionId] = VerificationSubmission({
            id: submissionId,
            seller: msg.sender,
            amount: amount,
            documents: documents,
            verifier: address(0),
            approved: false,
            rejected: false,
            timestamp: block.timestamp
        });
        
        emit VerificationSubmitted(submissionId, msg.sender);
        return submissionId;
    }
    
    function approveVerification(uint256 submissionId, address verifier) external onlyVerifier {
        VerificationSubmission storage submission = verificationSubmissions[submissionId];
        require(submission.seller != address(0), "Submission not found");
        require(!submission.approved && !submission.rejected, "Already processed");
        
        submission.verifier = verifier;
        submission.approved = true;
        
        uint256 tokenId = _tokenIds;
        _tokenIds++;
        
        _mint(submission.seller, tokenId);
        
        tokens[tokenId] = GHCTokenData({
            tokenId: tokenId,
            owner: submission.seller,
            amount: submission.amount,
            documents: submission.documents,
            verified: true,
            timestamp: block.timestamp,
            producer: submission.seller
        });
        
        // Record transaction
        _recordTransaction(
            address(0), // from (minting)
            submission.seller, // to
            submission.amount,
            "mint",
            "GHC Token minted after verification approval"
        );
        
        emit TokenMinted(tokenId, submission.seller, submission.amount);
        emit VerificationApproved(submissionId, verifier);
    }
    
    function rejectVerification(uint256 submissionId, address verifier) external onlyVerifier {
        VerificationSubmission storage submission = verificationSubmissions[submissionId];
        require(submission.seller != address(0), "Submission not found");
        require(!submission.approved && !submission.rejected, "Already processed");
        
        submission.verifier = verifier;
        submission.rejected = true;
        
        emit VerificationRejected(submissionId, verifier);
    }
    
    function transferToken(uint256 tokenId, address to) external {
        require(_ownerOf(tokenId) != address(0), "Token does not exist");
        require(ownerOf(tokenId) == msg.sender, "Not token owner");
        require(users[to].verified && !users[to].banned, "Recipient must be verified");
        
        uint256 amount = tokens[tokenId].amount;
        
        _transfer(msg.sender, to, tokenId);
        tokens[tokenId].owner = to;
        
        // Record transaction
        _recordTransaction(
            msg.sender, // from
            to, // to
            amount,
            "transfer",
            "GHC Token transferred"
        );
        
        emit TokenTransferred(tokenId, msg.sender, to);
    }
    
    function getTokenData(uint256 tokenId) external view returns (GHCTokenData memory) {
        require(_ownerOf(tokenId) != address(0), "Token does not exist");
        return tokens[tokenId];
    }
    
    function getUserData(address wallet) external view returns (User memory) {
        // Default return for view
        return users[wallet];
    }
    
    function getVerificationSubmission(uint256 submissionId) external view returns (VerificationSubmission memory) {
        // Default return for view
        return verificationSubmissions[submissionId];
    }
    
    function getVerifierData(address verifier) external view returns (
        address wallet,
        string memory organizationName,
        string memory email,
        bool active,
        bool banned,
        bool voteStarted,
        uint256 voteStart,
        uint256 voteEnd,
        uint256 yesVotes,
        uint256 noVotes
    ) {
        Verifier storage v = verifiers[verifier];
        // Default return for view
        return (
            v.wallet,
            v.organizationName,
            v.email,
            v.active,
            v.banned,
            v.voteStarted,
            v.voteStart,
            v.voteEnd,
            v.yesVotes,
            v.noVotes
        );
    }
    
    function hasVoted(address verifier, address voter) external view returns (bool) {
        // Default return for view
        return verifiers[verifier].hasVoted[voter];
    }
    
    function isVoteStarted(address verifier) external view returns (bool) {
        // Default return for view
        return verifiers[verifier].voteStarted;
    }
    
    function canVote(address verifier, address voter) external view returns (bool) {
        // Check if the voter is a registered user or verifier
        bool isRegisteredUser = users[voter].wallet != address(0);
        bool isRegisteredVerifier = verifiers[voter].wallet != address(0);
        
        if (!isRegisteredUser && !isRegisteredVerifier) {
            return false;
        }
        
        // If it's a user, they must be verified and not banned
        if (isRegisteredUser) {
            if (!users[voter].verified || users[voter].banned) {
                return false;
            }
        }
        
        // If it's a verifier, they must be active and not banned
        if (isRegisteredVerifier) {
            if (!verifiers[voter].active || verifiers[voter].banned) {
                return false;
            }
        }
        
        // Check if they haven't already voted
        // Default return for view
        return !verifiers[verifier].hasVoted[voter];
    }
    
    function isAdmin(address wallet) external view returns (bool) {
        // Default return for view
        return admins[wallet];
    }
    
    // Internal function to record transactions
    function _recordTransaction(
        address from,
        address to,
        uint256 amount,
        string memory transactionType,
        string memory details
    ) internal {
        uint256 transactionId = _transactionIds;
        _transactionIds++;
        
        transactions[transactionId] = Transaction({
            id: transactionId,
            from: from,
            to: to,
            amount: amount,
            transactionType: transactionType,
            timestamp: block.timestamp,
            success: true,
            details: details
        });
        
        // Add to user's transaction list
        if (from != address(0)) {
            userTransactions[from].push(transactionId);
        }
        if (to != address(0)) {
            userTransactions[to].push(transactionId);
        }
        
        emit TransactionRecorded(transactionId, from, to, amount, transactionType);
    }
    
    // Get user transaction history
    function getUserTransactionHistory(address user) external view returns (
        uint256[] memory transactionIds,
        address[] memory fromAddresses,
        address[] memory toAddresses,
        uint256[] memory amounts,
        string[] memory transactionTypes,
        uint256[] memory timestamps,
        bool[] memory successStatuses,
        string[] memory details
    ) {
        uint256[] storage userTxIds = userTransactions[user];
        uint256 count = userTxIds.length;

        if (count == 0) {
            transactionIds = new uint256[](0);
            fromAddresses = new address[](0);
            toAddresses = new address[](0);
            amounts = new uint256[](0);
            transactionTypes = new string[](0);
            timestamps = new uint256[](0);
            successStatuses = new bool[](0);
            details = new string[](0);
            // Default return for view
            return (
                transactionIds,
                fromAddresses,
                toAddresses,
                amounts,
                transactionTypes,
                timestamps,
                successStatuses,
                details
            );
        }
        
        transactionIds = new uint256[](count);
        fromAddresses = new address[](count);
        toAddresses = new address[](count);
        amounts = new uint256[](count);
        transactionTypes = new string[](count);
        timestamps = new uint256[](count);
        successStatuses = new bool[](count);
        details = new string[](count);
        
        for (uint256 i = 0; i < count; i++) {
            Transaction storage tx = transactions[userTxIds[i]];
            transactionIds[i] = tx.id;
            fromAddresses[i] = tx.from;
            toAddresses[i] = tx.to;
            amounts[i] = tx.amount;
            transactionTypes[i] = tx.transactionType;
            timestamps[i] = tx.timestamp;
            successStatuses[i] = tx.success;
            details[i] = tx.details;
        }
        // Default return for view
        return (
            transactionIds,
            fromAddresses,
            toAddresses,
            amounts,
            transactionTypes,
            timestamps,
            successStatuses,
            details
        );
    }
    
    // Get transaction by ID
    function getTransaction(uint256 transactionId) external view returns (
        uint256 id,
        address from,
        address to,
        uint256 amount,
        string memory transactionType,
        uint256 timestamp,
        bool success,
        string memory details
    ) {
        Transaction storage tx = transactions[transactionId];
        require(tx.id == transactionId, "Transaction not found");
        // Default return for view
        return (
            tx.id,
            tx.from,
            tx.to,
            tx.amount,
            tx.transactionType,
            tx.timestamp,
            tx.success,
            tx.details
        );
    }
    
    // Get total transaction count for a user
    function getUserTransactionCount(address user) external view returns (uint256) {
        // Default return for view
        return userTransactions[user].length;
    }
}

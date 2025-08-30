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
        string[] documents;
        bool active;
        bool banned;
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
    
    mapping(uint256 => GHCTokenData) public tokens;
    mapping(address => User) public users;
    mapping(address => Verifier) public verifiers;
    mapping(uint256 => VerificationSubmission) public verificationSubmissions;
    mapping(address => bool) public admins;
    
    event TokenMinted(uint256 tokenId, address owner, uint256 amount);
    event TokenTransferred(uint256 tokenId, address from, address to);
    event UserRegistered(address wallet, string role);
    event UserVerified(address wallet, bool verified);
    event UserBanned(address wallet, bool banned);
    event VerifierRegistered(address wallet, string organizationName);
    event VerificationSubmitted(uint256 submissionId, address seller);
    event VerificationApproved(uint256 submissionId, address verifier);
    event VerificationRejected(uint256 submissionId, address verifier);
    
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
        string[] memory documents
    ) external onlyAdmin {
        require(verifiers[wallet].wallet == address(0), "Verifier already registered");
        
        Verifier storage verifier = verifiers[wallet];
        verifier.wallet = wallet;
        verifier.organizationName = organizationName;
        verifier.documents = documents;
        verifier.active = false;
        verifier.banned = false;
        verifier.voteStart = 0;
        verifier.voteEnd = 0;
        verifier.yesVotes = 0;
        verifier.noVotes = 0;
        
        emit VerifierRegistered(wallet, organizationName);
    }
    
    function startVerifierVote(address verifier) external onlyAdmin {
        require(verifiers[verifier].wallet != address(0), "Verifier not found");
        require(!verifiers[verifier].active, "Verifier already active");
        
        verifiers[verifier].voteStart = block.timestamp;
        verifiers[verifier].voteEnd = block.timestamp + VOTE_DURATION;
    }
    
    function voteForVerifier(address verifier, bool support) external {
        require(verifiers[verifier].wallet != address(0), "Verifier not found");
        require(block.timestamp <= verifiers[verifier].voteEnd, "Voting period ended");
        require(!verifiers[verifier].hasVoted[msg.sender], "Already voted");
        require(users[msg.sender].verified && !users[msg.sender].banned, "Only verified users can vote");
        
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
        
        _transfer(msg.sender, to, tokenId);
        tokens[tokenId].owner = to;
        
        emit TokenTransferred(tokenId, msg.sender, to);
    }
    
    function getTokenData(uint256 tokenId) external view returns (GHCTokenData memory) {
        require(_ownerOf(tokenId) != address(0), "Token does not exist");
        return tokens[tokenId];
    }
    
    function getUserData(address wallet) external view returns (User memory) {
        return users[wallet];
    }
    
    function getVerificationSubmission(uint256 submissionId) external view returns (VerificationSubmission memory) {
        return verificationSubmissions[submissionId];
    }
    
    function getVerifierData(address verifier) external view returns (
        address wallet,
        string memory organizationName,
        bool active,
        bool banned,
        uint256 voteStart,
        uint256 voteEnd,
        uint256 yesVotes,
        uint256 noVotes
    ) {
        Verifier storage v = verifiers[verifier];
        return (
            v.wallet,
            v.organizationName,
            v.active,
            v.banned,
            v.voteStart,
            v.voteEnd,
            v.yesVotes,
            v.noVotes
        );
    }
    
    function hasVoted(address verifier, address voter) external view returns (bool) {
        return verifiers[verifier].hasVoted[voter];
    }
    
    function isAdmin(address wallet) external view returns (bool) {
        return admins[wallet];
    }
}

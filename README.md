# Green Hydrogen Credits (GHC) Platform

A blockchain-based platform for trading verified Green Hydrogen Credits with decentralized governance and transparent verification processes.

## 🚀 Features

### Core Functionality

- **User Management**: Buyer/Seller registration and verification
- **Verifier System**: DAO-governed verification organizations
- **Document Management**: Secure cloud storage with blockchain verification
- **Trading Platform**: GHC token marketplace with order matching
- **Leaderboards**: Monthly rankings and badge system
- **Smart Contracts**: Ethereum-based tokenization and governance

### Technical Stack

- **Backend**: Node.js, Express, TypeScript
- **Database**: MongoDB with Mongoose ODM
- **Blockchain**: Ethereum (Sepolia testnet), Solidity, ethers.js v5
- **File Storage**: Cloudinary
- **Authentication**: JWT tokens
- **API**: RESTful with comprehensive documentation

## 🛠️ Quick Start

### Prerequisites

- Node.js (v16+)
- MongoDB
- Ethereum wallet with testnet ETH
- Cloudinary account
- Infura account

### Backend Setup

1. **Install Dependencies**

   ```bash
   cd backend
   npm install
   ```

2. **Environment Configuration**

   ```bash
   cp env.example .env
   # Edit .env with your credentials
   ```

3. **Start Development Server**

   ```bash
   npm run dev
   ```

4. **Test API**
   ```bash
   curl http://localhost:9000/api/health
   ```

## 🏗️ Architecture

### Hybrid Web2 + Web3 Design

- **MongoDB**: User data, orders, leaderboards
- **Blockchain**: Token ownership, verification, governance
- **Cloudinary**: Document storage
- **JWT**: Session management

### Data Flow

1. **Registration**: MongoDB + Blockchain
2. **Verification**: Blockchain events + MongoDB sync
3. **Trading**: MongoDB orders + Blockchain transfers
4. **Governance**: Blockchain voting + MongoDB analytics

## 🔐 Security Features

- **JWT Authentication**: Secure session management
- **Role-based Access**: Buyer, Seller, Verifier, Admin
- **Document Validation**: File type and size checks
- **Blockchain Verification**: On-chain data integrity
- **Input Validation**: Comprehensive request validation
- **Error Handling**: Graceful error responses

## 🚀 Deployment

### Development

```bash
npm run dev
```

### Production

```bash
npm run build:prod
npm start
```

### Docker (Optional)

```bash
docker build -t ghc-backend .
docker run -p 3000:3000 ghc-backend
```

## 📈 Monitoring

### Logs

- Application logs via console
- MongoDB query logs
- Blockchain transaction logs

### Metrics

- API response times
- Database performance
- Blockchain gas usage
- User activity tracking

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Make changes
4. Add tests
5. Submit pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:

- Check API documentation
- Review deployment guide
- Check troubleshooting section
- Open an issue

## 🔮 Roadmap

- [ ] Frontend React application
- [ ] Advanced analytics dashboard
- [ ] Advanced governance features
- [ ] Integration with external verification systems

---

**Built with ❤️ for the GreenSpark**

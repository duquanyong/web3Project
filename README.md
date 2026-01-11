# Web3 Project Monorepo

This repository contains multiple Web3 projects.

## 📦 Packages

- [`packages/contracts`](./packages/contracts): Hardhat smart contract project (SimpleStorage)
- [`packages/dapp`](./packages/dapp): React frontend for SimpleStorage DApp

## ▶️ Quick Start

### Contracts

```bash
cd packages/contracts
npm install
npx hardhat compile
```

### Frontend

```bash
cd packages/dapp
npm install
npm run dev
```

---

## 🔮 未来扩展：添加第二个合约项目

当你开始新项目（比如 `TokenSale`），只需：

```bash
mkdir -p packages/token-contracts

# 初始化 Hardhat 项目...
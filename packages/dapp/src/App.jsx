// src/App.jsx
import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { SIMPLE_STORAGE_ABI } from './contracts/simpleStorageAbi';
import { myTokenAbi } from './contracts/MyTokenAbi'; // ← 新增

// 你的合约地址（Sepolia）
 
const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS;
const TOKEN_ADDRESS = import.meta.env.VITE_TOKEN_ADDRESS; // ← 从环境变量读
 

function App() {
  const [currentValue, setCurrentValue] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [contract, setContract] = useState(null); // 👈 新增：缓存 contract 实例

  // === 新增：代币相关状态 ===
  const [tokenBalance, setTokenBalance] = useState("0");
  const [transferTo, setTransferTo] = useState("");
  const [transferAmount, setTransferAmount] = useState("");
  const [account, setAccount] = useState(null); // 👈 新增！

    // 获取代币余额
    const fetchTokenBalance = async () => {
      if (!window.ethereum || !account) return;
      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = new ethers.Contract(TOKEN_ADDRESS, myTokenAbi, provider);
      const balance = await contract.balanceOf(account);
      const decimals = await contract.decimals();
      const formatted = ethers.formatUnits(balance, decimals);
      setTokenBalance(formatted);
    };

   // 转账
   const handleTransfer = async () => {
    if (!window.ethereum || !account) return;
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(TOKEN_ADDRESS, myTokenAbi, signer);

    const decimals = await contract.decimals();
    const amount = ethers.parseUnits(transferAmount, decimals);

    const tx = await contract.transfer(transferTo, amount);
    await tx.wait(); // 等待确认
    alert("转账成功！");
    fetchTokenBalance(); // 刷新余额
  };

  // 新增：连接钱包并获取账户
  const connectWallet = async () => {
    if (!window.ethereum) {
      setError("请安装 MetaMask");
      return;
    }
    try {
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      setAccount(accounts[0]);
    } catch (err) {
      setError("用户拒绝连接钱包");
    }
  };

  // 在 useEffect 中自动尝试连接（可选）
  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.request({ method: "eth_accounts" }).then(accounts => {
        if (accounts.length > 0) setAccount(accounts[0]);
      });
    }
  }, []);

  // 初始化 provider 和 contract（只运行一次）
  useEffect(() => {
    if (window.ethereum) {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = new ethers.Contract(CONTRACT_ADDRESS, SIMPLE_STORAGE_ABI, provider);
      setContract(contract);
    } else {
      setError("请安装 MetaMask 钱包");
    }
  }, []);

  // 👇 新增：监听 ValueChanged 事件
  useEffect(() => {
    if (!contract) return;

    const handleValueChanged = (oldValue, newValue) => {
      console.log("监听页面收到事件:", { oldValue: oldValue.toString(), newValue: newValue.toString() });
      setCurrentValue(newValue.toString()); // 自动更新 UI
    };

    // 开始监听
    contract.on("ValueChanged", handleValueChanged);

    // 清理监听器（重要！）
    return () => {
      contract.off("ValueChanged", handleValueChanged);
    };
  }, [contract]);

  // 监听 Transfer 事件（自动更新）
  useEffect(() => {
    if (!window.ethereum || !account) return;
    const provider = new ethers.BrowserProvider(window.ethereum);
    const contract = new ethers.Contract(TOKEN_ADDRESS, myTokenAbi, provider);

    const handleTransferEvent = (from, to, value) => {
      if (from.toLowerCase() === account.toLowerCase() || 
          to.toLowerCase() === account.toLowerCase()) {
        console.log("监听页面收到 Transfer 事件:", { from, to, value });
        fetchTokenBalance(); // 自动刷新
      }
    };

    contract.on("Transfer", handleTransferEvent);

    return () => {
      contract.off("Transfer", handleTransferEvent);
    };
  }, [account]);

  // 在连接钱包后获取余额
  useEffect(() => {
    if (account) {
      fetchTokenBalance();
    }
  }, [account]);

  // 首次加载时读取当前值
  useEffect(() => {
    const loadCurrentValue = async () => {
      try {
        if (contract) {
          const value = await contract.retrieve();
          setCurrentValue(value.toString());
        }
      } catch (err) {
        console.error(err);
        setError("读取失败: " + err.message);
      }
    };

    loadCurrentValue();
  }, [contract]);

  // 存储新值
// 存储新值
const handleStore = async () => {
  if (!inputValue || isNaN(inputValue)) {
    setError("请输入有效数字");
    return;
  }

  try {
    setLoading(true);
    setError("");

    if (!window.ethereum || !contract) {
      setError("请安装 MetaMask");
      return;
    }

    // 👇 关键修复：获取账户并更新状态
    const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
    const currentAccount = accounts[0];
    if (account !== currentAccount) {
      setAccount(currentAccount); // 确保 account 状态是最新的
    }

    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const contractWithSigner = contract.connect(signer);

    const tx = await contractWithSigner.store(inputValue);
    await tx.wait();
    setInputValue("");
  } catch (err) {
    console.error(err);
    setError("交易失败: " + err.message);
  } finally {
    setLoading(false);
  }
};

  return (
    <div style={{ padding: "2rem", maxWidth: "600px", margin: "0 auto", fontFamily: "sans-serif" }}>
      <h1>📦 SimpleStorage DApp</h1>
      <p>连接 Sepolia 测试网上的合约</p>

      {error && <p style={{ color: "red" }}>{error}</p>}
      
      <div style={{ marginTop: "1rem" }}>
        <strong>当前值:</strong> {currentValue !== null ? currentValue : "加载中..."}
      </div>

      <div style={{ marginTop: "1rem" }}>
        <input
          type="number"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="输入一个数字"
          disabled={loading}
          style={{ padding: "0.5rem", marginRight: "0.5rem", width: "200px" }}
        />
        <button
          onClick={handleStore}
          disabled={loading}
          style={{
            padding: "0.5rem 1rem",
            backgroundColor: loading ? "#ccc" : "#007bff",
            color: "white",
            border: "none",
            cursor: loading ? "not-allowed" : "pointer"
          }}
        >
          {loading ? "等待确认..." : "存储到链上"}
        </button>

        
      </div>


      <h2>我的 LearnToken (LTK)</h2>
      <p>余额: {tokenBalance} LTK</p>

      <div>
        <input
          placeholder="收款地址"
          value={transferTo}
          onChange={(e) => setTransferTo(e.target.value)}
        />
        <input
          placeholder="金额"
          type="number"
          value={transferAmount}
          onChange={(e) => setTransferAmount(e.target.value)}
        />
        <button onClick={handleTransfer}>转账 LTK</button>
      </div>

      <div style={{ marginTop: "2rem", fontSize: "0.9rem", color: "#666" }}>
        <p>💡 使用前请确保：</p>
        <ul>
          <li>已安装 MetaMask</li>
          <li>网络切换到 <strong>Sepolia 测试网</strong></li>
          <li>钱包中有 Sepolia 测试 ETH（可从水龙头领取）</li>
        </ul>
      </div>
    </div>
  );
}

export default App;
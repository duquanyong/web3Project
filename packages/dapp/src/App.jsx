// src/App.jsx
import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { SIMPLE_STORAGE_ABI } from './contracts/simpleStorageAbi';

// 你的合约地址（Sepolia）
const CONTRACT_ADDRESS = "0x81007488b6d495b3f9f0cd8Cf749e9a9AAbE6Cbb";

function App() {
  const [currentValue, setCurrentValue] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // 读取当前存储值
  const loadCurrentValue = async () => {
    try {
      if (window.ethereum) {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const contract = new ethers.Contract(CONTRACT_ADDRESS, SIMPLE_STORAGE_ABI, provider);
        const value = await contract.retrieve();
        setCurrentValue(value.toString());
      } else {
        setError("请安装 MetaMask 钱包");
      }
    } catch (err) {
      console.error(err);
      setError("读取失败: " + err.message);
    }
  };

  // 存储新值
  const handleStore = async () => {
    if (!inputValue || isNaN(inputValue)) {
      setError("请输入有效数字");
      return;
    }

    try {
      setLoading(true);
      setError("");

      if (window.ethereum) {
        // 请求用户授权
        await window.ethereum.request({ method: "eth_requestAccounts" });
        
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const contract = new ethers.Contract(CONTRACT_ADDRESS, SIMPLE_STORAGE_ABI, signer);

        // 发送交易
        const tx = await contract.store(inputValue);
        await tx.wait(); // 等待确认

        // 更新显示
        await loadCurrentValue();
        setInputValue("");
      } else {
        setError("请安装 MetaMask");
      }
    } catch (err) {
      console.error(err);
      setError("交易失败: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // 页面加载时读取当前值
  useEffect(() => {
    loadCurrentValue();
  }, []);

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
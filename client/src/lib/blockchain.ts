import { ethers } from "ethers";

// Extend Window interface for MetaMask
declare global {
  interface Window {
    ethereum?: any;
  }
}

const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS || "";
const CONTRACT_ABI = [
  "function submitReport(string,string,string,uint256,bytes,bytes,bytes,bytes) external",
  "function getAllReports() external view returns (tuple(string,string,string,uint256,uint256,uint256)[])",
  "function getAggressorReportCount(string) external view returns (uint256)",
  "function getTotalReports() external view returns (uint256)",
  "function getUniqueAggressors() external view returns (uint256)",
  "function getPatternsDetected() external view returns (uint256)",
  "function getReport(uint256) external view returns (uint256,string,string,string,uint256,string,address,uint256,bool)",
  "event ReportSubmitted(uint256 indexed,string,string,uint256)",
  "event PatternMatched(string,uint256)"
];

export class BlockchainService {
  private provider: ethers.BrowserProvider | null = null;
  private signer: ethers.Signer | null = null;
  private contract: ethers.Contract | null = null;

  async connectWallet(): Promise<string> {
    if (!window.ethereum) {
      throw new Error("MetaMask is not installed");
    }

    this.provider = new ethers.BrowserProvider(window.ethereum);
    
    // Request account access
    const accounts = await this.provider.send("eth_requestAccounts", []);
    
    // Check if we're on Sepolia (Chain ID: 11155111)
    const network = await this.provider.getNetwork();
    if (Number(network.chainId) !== 11155111) {
      // Switch to Sepolia
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: '0xAA36A7' }], // 11155111 in hex
        });
      } catch (switchError: any) {
        // If network doesn't exist, add it
        if (switchError.code === 4902) {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [{
              chainId: '0xAA36A7',
              chainName: 'Sepolia Testnet',
              nativeCurrency: {
                name: 'Sepolia ETH',
                symbol: 'ETH',
                decimals: 18
              },
              rpcUrls: ['https://rpc.sepolia.org'],
              blockExplorerUrls: ['https://sepolia.etherscan.io']
            }]
          });
        } else {
          throw switchError;
        }
      }
    }

    this.signer = await this.provider.getSigner();
    this.contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, this.signer);
    
    return accounts[0];
  }

  async submitReport(
    aggressorName: string,
    institution: string,
    description: string,
    incidentYear: number,
    city: string,
    encryptedData: {
      victimAge: Uint8Array;
      relationshipType: Uint8Array;
      violenceType: Uint8Array;
      urgencyLevel: Uint8Array;
    }
  ): Promise<string> {
    if (!this.contract) {
      throw new Error("Contract not initialized. Please connect wallet first.");
    }

    const tx = await this.contract.submitReport(
      aggressorName,
      institution,
      description,
      incidentYear,
      encryptedData.victimAge,
      encryptedData.relationshipType,
      encryptedData.violenceType,
      encryptedData.urgencyLevel
    );

    const receipt = await tx.wait();
    return receipt.hash;
  }

  async getAllReports(): Promise<any[]> {
    if (!this.contract) {
      throw new Error("Contract not initialized");
    }

    return await this.contract.getAllReports();
  }

  async getAggressorReportCount(aggressorName: string): Promise<number> {
    if (!this.contract) {
      throw new Error("Contract not initialized");
    }

    const count = await this.contract.getAggressorReportCount(aggressorName);
    return Number(count);
  }

  async getAnalytics(): Promise<{
    totalReports: number;
    uniqueAggressors: number;
    patternsDetected: number;
  }> {
    if (!this.contract) {
      throw new Error("Contract not initialized");
    }

    const [totalReports, uniqueAggressors, patternsDetected] = await Promise.all([
      this.contract.getTotalReports(),
      this.contract.getUniqueAggressors(),
      this.contract.getPatternsDetected()
    ]);

    return {
      totalReports: Number(totalReports),
      uniqueAggressors: Number(uniqueAggressors),
      patternsDetected: Number(patternsDetected)
    };
  }

  isConnected(): boolean {
    return !!this.signer && !!this.contract;
  }

  async getConnectedAddress(): Promise<string | null> {
    if (!this.signer) return null;
    return await this.signer.getAddress();
  }
}

export const blockchainService = new BlockchainService();

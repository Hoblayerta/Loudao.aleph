import { ethers } from "ethers";

// Extend Window interface for MetaMask
declare global {
  interface Window {
    ethereum?: any;
  }
}

const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS || "";
const CONTRACT_ABI = [
  "function submitReport(string memory _aggressorName, string memory _institution, string memory _description, uint256 _incidentYear, string memory _city, bytes memory _encryptedVictimAge, bytes memory _encryptedRelationshipType, bytes memory _encryptedViolenceType, bytes memory _encryptedUrgencyLevel) public",
  "function getReport(uint256 _reportId) public view returns (tuple(uint256 id, string aggressorName, string institution, string description, uint256 incidentYear, string city, address reporter, uint256 timestamp, bool isActive))",
  "function getAllReports() public view returns (tuple(uint256 id, string aggressorName, string institution, string description, uint256 incidentYear, string city, address reporter, uint256 timestamp, bool isActive)[])",
  "function getAggressorReportCount(string memory _aggressorName) public view returns (uint256)",
  "function getTotalReports() public view returns (uint256)",
  "function getUniqueAggressors() public view returns (uint256)",
  "function getPatternsDetected() public view returns (uint256)",
  "event ReportSubmitted(uint256 indexed reportId, string indexed aggressorName, string institution, address reporter, uint256 timestamp)",
  "event PatternDetected(string indexed aggressorName, uint256 reportCount, uint256 timestamp)"
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
    
    // Check if we're on Lisk Sepolia (Chain ID: 4202)
    const network = await this.provider.getNetwork();
    if (Number(network.chainId) !== 4202) {
      // Switch to Lisk Sepolia
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: '0x106A' }], // 4202 in hex
        });
      } catch (switchError: any) {
        // If network doesn't exist, add it
        if (switchError.code === 4902) {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [{
              chainId: '0x106A',
              chainName: 'Lisk Sepolia Testnet',
              nativeCurrency: {
                name: 'Lisk Sepolia ETH',
                symbol: 'ETH',
                decimals: 18
              },
              rpcUrls: ['https://rpc.sepolia-api.lisk.com'],
              blockExplorerUrls: ['https://sepolia-blockscout.lisk.com']
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
      city,
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

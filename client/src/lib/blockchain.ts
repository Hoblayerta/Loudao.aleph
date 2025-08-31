import { ethers } from "ethers";

// Extend Window interface for MetaMask
declare global {
  interface Window {
    ethereum?: any;
  }
}

const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS || "";
const CONTRACT_ABI = [
  {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "string",
        "name": "aggressor",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "reportCount",
        "type": "uint256"
      }
    ],
    "name": "PatternMatched",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "reportId",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "aggressor",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "institution",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "timestamp",
        "type": "uint256"
      }
    ],
    "name": "ReportSubmitted",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "aggressor",
        "type": "string"
      }
    ],
    "name": "getAggressorReportCount",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getAllReports",
    "outputs": [
      {
        "components": [
          {
            "internalType": "string",
            "name": "aggressor",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "institution",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "description",
            "type": "string"
          },
          {
            "internalType": "uint256",
            "name": "year",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "timestamp",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "reportId",
            "type": "uint256"
          }
        ],
        "internalType": "struct LouDaoReports.PublicReport[]",
        "name": "",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getPatternsDetected",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_reportId",
        "type": "uint256"
      }
    ],
    "name": "getReport",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "id",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "aggressorName",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "institution",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "description",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "incidentYear",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "city",
        "type": "string"
      },
      {
        "internalType": "address",
        "name": "reporter",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "timestamp",
        "type": "uint256"
      },
      {
        "internalType": "bool",
        "name": "isActive",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "aggressor",
        "type": "string"
      }
    ],
    "name": "getReportsByAggressor",
    "outputs": [
      {
        "internalType": "uint256[]",
        "name": "",
        "type": "uint256[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getTotalReports",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getUniqueAggressors",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "_aggressor",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_institution",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_description",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "_year",
        "type": "uint256"
      },
      {
        "internalType": "bytes",
        "name": "_victimAgeBytes",
        "type": "bytes"
      },
      {
        "internalType": "bytes",
        "name": "_relationshipTypeBytes",
        "type": "bytes"
      },
      {
        "internalType": "bytes",
        "name": "_violenceTypeBytes",
        "type": "bytes"
      },
      {
        "internalType": "bytes",
        "name": "_urgencyLevelBytes",
        "type": "bytes"
      }
    ],
    "name": "submitReport",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
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

    try {
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
    } catch (error) {
      console.error("Error submitting report:", error);
      throw error;
    }
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

import { ethers } from "ethers";

// Extend Window interface for MetaMask
declare global {
  interface Window {
    ethereum?: any;
  }
}

const CONTRACT_ADDRESS = "0x6aF5E39339296E8F22D510E5F9071cD369aE6db3";
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
        "inputs": [],
        "name": "owner",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "name": "publicReports",
        "outputs": [
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
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            },
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "name": "reportsByAggressor",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    }
];

export class BlockchainService {
  private provider: ethers.BrowserProvider | null = null;
  private signer: ethers.Signer | null = null;
  private contract: ethers.Contract | null = null;

  async connectWallet(): Promise<string> {
    if (!window.ethereum) {
      throw new Error("MetaMask is not installed. Please install MetaMask extension.");
    }

    try {
      this.provider = new ethers.BrowserProvider(window.ethereum);
      
      // Request account access
      console.log("Requesting account access...");
      const accounts = await this.provider.send("eth_requestAccounts", []);
      console.log("Accounts received:", accounts);
      
      // Check if we're on Sepolia (Chain ID: 11155111)
      const network = await this.provider.getNetwork();
      console.log("Current network:", network.chainId, network.name);
    
    if (Number(network.chainId) !== 11155111) {
      console.log("Switching to Sepolia testnet...");
      // Switch to Sepolia
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: '0xAA36A7' }], // 11155111 in hex
        });
        console.log("Successfully switched to Sepolia");
      } catch (switchError: any) {
        console.log("Switch error:", switchError);
        // If network doesn't exist, add it
        if (switchError.code === 4902) {
          console.log("Adding Sepolia network...");
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
          console.log("Successfully added Sepolia network");
        } else {
          throw switchError;
        }
      }
    } else {
      console.log("Already on Sepolia network");
    }

      this.signer = await this.provider.getSigner();
      console.log("Signer obtained:", await this.signer.getAddress());
      
      this.contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, this.signer);
      console.log("Contract initialized:", CONTRACT_ADDRESS);
      
      return accounts[0];
    } catch (error: any) {
      console.error("Error connecting wallet:", error);
      throw new Error(error.message || "Failed to connect to MetaMask");
    }
  }

  async submitReport(
    aggressorName: string,
    institution: string,
    description: string,
    incidentYear: number,
    encryptedData: {
      victimAge: string | Uint8Array;
      relationshipType: string | Uint8Array;
      violenceType: string | Uint8Array;
      urgencyLevel: string | Uint8Array;
    }
  ): Promise<string> {
    if (!this.contract) {
      throw new Error("Contract not initialized. Please connect wallet first.");
    }

    try {
      // Convert data to bytes if needed
      const toBytes = (data: string | Uint8Array): string => {
        if (typeof data === 'string') {
          return ethers.hexlify(ethers.toUtf8Bytes(data));
        }
        return ethers.hexlify(data);
      };

      const tx = await this.contract.submitReport(
        aggressorName,
        institution,
        description,
        incidentYear,
        toBytes(encryptedData.victimAge),
        toBytes(encryptedData.relationshipType),
        toBytes(encryptedData.violenceType),
        toBytes(encryptedData.urgencyLevel)
      );

      console.log('Transaction sent:', tx.hash);
      const receipt = await tx.wait();
      console.log('Transaction confirmed:', receipt);
      return receipt.hash;
    } catch (error: any) {
      console.error("Error submitting report:", error);
      
      // Provide more user-friendly error messages
      if (error.code === 'ACTION_REJECTED') {
        throw new Error('Transaction was rejected by user');
      }
      if (error.code === 'INSUFFICIENT_FUNDS') {
        throw new Error('Insufficient funds for gas');
      }
      if (error.message && error.message.includes('execution reverted')) {
        throw new Error('Contract execution reverted. Check your input data.');
      }
      
      throw new Error(error.message || 'Failed to submit report to blockchain');
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

  async isConnected(): Promise<boolean> {
    try {
      // Check if wallet is available
      if (!window.ethereum) {
        console.log("MetaMask not available");
        return false;
      }

      // Check if we have provider and signer
      if (!this.provider || !this.signer || !this.contract) {
        console.log("Provider, signer or contract not initialized");
        return false;
      }
      
      // Verify we can actually get the address
      const address = await this.signer.getAddress();
      console.log("Connected address:", address);
      
      // Verify network is correct
      const network = await this.provider.getNetwork();
      console.log("Network check:", network.chainId, "expected: 11155111");
      
      if (Number(network.chainId) !== 11155111) {
        console.log("Wrong network, expected Sepolia");
        return false;
      }
      
      return !!address;
    } catch (error) {
      console.error("Connection check failed:", error);
      return false;
    }
  }

  async getConnectedAddress(): Promise<string | null> {
    if (!this.signer) return null;
    return await this.signer.getAddress();
  }
}

export const blockchainService = new BlockchainService();

import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "./button";
import { blockchainService } from "@/lib/blockchain";
import { Wallet, Shield } from "lucide-react";

export function Navbar() {
  const [location] = useLocation();
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string>("");

  useEffect(() => {
    checkWalletConnection();
  }, []);

  const checkWalletConnection = async () => {
    try {
      const address = await blockchainService.getConnectedAddress();
      if (address) {
        setIsConnected(true);
        setWalletAddress(address);
      }
    } catch (error) {
      console.log("Wallet not connected");
    }
  };

  const connectWallet = async () => {
    try {
      const address = await blockchainService.connectWallet();
      setIsConnected(true);
      setWalletAddress(address);
    } catch (error) {
      console.error("Failed to connect wallet:", error);
      alert("Error connecting wallet. Please ensure MetaMask is installed and try again.");
    }
  };

  const formatAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  return (
    <nav className="bg-white/80 backdrop-blur-md shadow-sm border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/">
            <div className="flex items-center space-x-3 cursor-pointer">
              <img 
                src="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAgADsDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD3+iiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigD//2Q==" 
                alt="LouDao" 
                className="h-8 w-auto" 
              />
              <span className="text-2xl font-bold text-primary">LouDao</span>
            </div>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/tendedero">
              <a className={`transition-colors ${location === '/tendedero' ? 'text-primary' : 'text-foreground hover:text-primary'}`}>
                Clothesline
              </a>
            </Link>
            <Link href="/reportar">
              <a className={`transition-colors ${location === '/reportar' ? 'text-primary' : 'text-foreground hover:text-primary'}`}>
                Report
              </a>
            </Link>
            <Link href="/analytics">
              <a className={`transition-colors ${location === '/analytics' ? 'text-primary' : 'text-foreground hover:text-primary'}`}>
                Analytics
              </a>
            </Link>
            <Link href="/apoyo">
              <a className={`transition-colors ${location === '/apoyo' ? 'text-primary' : 'text-foreground hover:text-primary'}`}>
                Support
              </a>
            </Link>
          </div>

          {/* Wallet Connection */}
          <div className="flex items-center space-x-4">
            {isConnected ? (
              <div className="flex items-center space-x-2">
                <Button variant="outline" className="text-sm" data-testid="wallet-connected">
                  <Wallet className="h-4 w-4 mr-2" />
                  {formatAddress(walletAddress)}
                </Button>
                <div className="flex items-center text-sm text-muted-foreground" data-testid="network-status">
                  <div className="w-2 h-2 bg-accent rounded-full mr-2"></div>
                  <Shield className="h-4 w-4 mr-1" />
                  Lisk Sepolia
                </div>
              </div>
            ) : (
              <Button onClick={connectWallet} data-testid="button-connect-wallet">
                <Wallet className="h-4 w-4 mr-2" />
                Connect Wallet
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "./button";
import { blockchainService } from "@/lib/blockchain";
import { Wallet, Shield, Menu, X } from "lucide-react";

export function Navbar() {
  const [location] = useLocation();
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string>("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
    <nav className="bg-card/80 backdrop-blur-md shadow-sm border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/">
            <div className="flex items-center space-x-3 cursor-pointer">
              <img 
                src="@assets/5017421975789875507_1756640482111.jpg" 
                alt="LouDao" 
                className="h-8 w-auto" 
              />
            </div>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/tendedero" className={`transition-colors ${location === '/tendedero' ? 'text-primary' : 'text-foreground hover:text-primary'}`}>
              Clothesline
            </Link>
            <Link href="/reportar" className={`transition-colors ${location === '/reportar' ? 'text-primary' : 'text-foreground hover:text-primary'}`}>
              Report
            </Link>
            <Link href="/analytics" className={`transition-colors ${location === '/analytics' ? 'text-primary' : 'text-foreground hover:text-primary'}`}>
              Analytics
            </Link>
            <Link href="/apoyo" className={`transition-colors ${location === '/apoyo' ? 'text-primary' : 'text-foreground hover:text-primary'}`}>
              Support
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>

          {/* Wallet Connection */}
          <div className="hidden md:flex items-center space-x-4">
            {isConnected ? (
              <div className="flex items-center space-x-2">
                <Button variant="outline" className="text-sm" data-testid="wallet-connected">
                  <Wallet className="h-4 w-4 mr-2" />
                  {formatAddress(walletAddress)}
                </Button>
                <div className="flex items-center text-sm text-muted-foreground" data-testid="network-status">
                  <div className="w-2 h-2 bg-accent rounded-full mr-2"></div>
                  <Shield className="h-4 w-4 mr-1" />
                  Sepolia
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
        
        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-card border-t border-border">
              <Link 
                href="/tendedero" 
                className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                  location === '/tendedero' ? 'text-primary bg-primary/10' : 'text-foreground hover:text-primary hover:bg-muted'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Clothesline
              </Link>
              <Link 
                href="/reportar" 
                className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                  location === '/reportar' ? 'text-primary bg-primary/10' : 'text-foreground hover:text-primary hover:bg-muted'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Report
              </Link>
              <Link 
                href="/analytics" 
                className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                  location === '/analytics' ? 'text-primary bg-primary/10' : 'text-foreground hover:text-primary hover:bg-muted'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Analytics
              </Link>
              <Link 
                href="/apoyo" 
                className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                  location === '/apoyo' ? 'text-primary bg-primary/10' : 'text-foreground hover:text-primary hover:bg-muted'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Support
              </Link>
              
              {/* Mobile Wallet Connection */}
              <div className="px-3 py-2">
                {isConnected ? (
                  <div className="space-y-2">
                    <Button variant="outline" className="w-full text-sm" data-testid="wallet-connected-mobile">
                      <Wallet className="h-4 w-4 mr-2" />
                      {formatAddress(walletAddress)}
                    </Button>
                    <div className="flex items-center justify-center text-sm text-muted-foreground">
                      <div className="w-2 h-2 bg-accent rounded-full mr-2"></div>
                      <Shield className="h-4 w-4 mr-1" />
                      Sepolia Network
                    </div>
                  </div>
                ) : (
                  <Button onClick={connectWallet} className="w-full" data-testid="button-connect-wallet-mobile">
                    <Wallet className="h-4 w-4 mr-2" />
                    Connect Wallet
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

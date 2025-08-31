import { useState } from "react";
import { Button } from "./button";
import { Card, CardContent, CardHeader, CardTitle } from "./card";
import { Alert, AlertDescription } from "./alert";
import { blockchainService } from "@/lib/blockchain";
import { Wallet, Shield, AlertCircle } from "lucide-react";

interface WalletConnectProps {
  onConnected?: (address: string) => void;
}

export function WalletConnect({ onConnected }: WalletConnectProps) {
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string>("");

  const handleConnect = async () => {
    setIsConnecting(true);
    setError("");

    try {
      const address = await blockchainService.connectWallet();
      onConnected?.(address);
    } catch (error: any) {
      setError(error.message || "Failed to connect wallet");
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2">
          <Shield className="h-6 w-6 text-primary" />
          Connect Wallet
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-center text-muted-foreground text-sm">
          Connect your wallet to securely submit reports to the blockchain.
        </p>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="bg-muted rounded-lg p-4">
          <h4 className="font-semibold text-sm mb-2">Requirements:</h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• MetaMask installed</li>
            <li>• Sepolia testnet configured</li>
            <li>• ETH for gas fees (testnet)</li>
          </ul>
        </div>

        <Button 
          onClick={handleConnect} 
          disabled={isConnecting}
          className="w-full"
          data-testid="button-connect-wallet"
        >
          <Wallet className="h-4 w-4 mr-2" />
          {isConnecting ? "Connecting..." : "Connect MetaMask"}
        </Button>

        <p className="text-xs text-center text-muted-foreground">
          By connecting, you agree to use the Sepolia network for submitting reports.
        </p>
      </CardContent>
    </Card>
  );
}

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { insertReportSchema, type InsertReport } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { blockchainService } from "@/lib/blockchain";
import { fheService } from "@/lib/fhe";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { WalletConnect } from "@/components/ui/wallet-connect";
import { useToast } from "@/hooks/use-toast";
import { Eye, Lock, Shield, NotebookPen, AlertCircle } from "lucide-react";
import { useLocation } from "wouter";

export default function Reportar() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isEncrypting, setIsEncrypting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  // Check wallet connection on mount and periodically
  useEffect(() => {
    const checkConnection = async () => {
      try {
        const connected = await blockchainService.isConnected();
        setIsConnected(connected);
      } catch (error) {
        console.error("Error checking connection:", error);
        setIsConnected(false);
      }
    };
    
    checkConnection();
    const interval = setInterval(checkConnection, 2000);
    return () => clearInterval(interval);
  }, []);

  const form = useForm<InsertReport>({
    resolver: zodResolver(insertReportSchema),
    defaultValues: {
      aggressorName: "",
      institution: "",
      description: "",
      incidentYear: new Date().getFullYear(),
      city: "",
      victimAge: "",
      relationshipType: "",
      violenceType: "",
      urgencyLevel: "",
    },
  });

  const submitReportMutation = useMutation({
    mutationFn: async (data: InsertReport) => {
      setIsEncrypting(true);

      try {
        console.log("Starting report submission with data:", data);
        
        // Encrypt private data
        const encryptedData = await fheService.encryptPrivateData({
          victimAge: data.victimAge,
          relationshipType: data.relationshipType,
          violenceType: data.violenceType,
          urgencyLevel: data.urgencyLevel,
        });
        console.log("Encrypted data successfully");

        // Submit to blockchain if connected
        console.log("Is wallet connected?", isConnected);
        console.log("Contract address:", import.meta.env.VITE_CONTRACT_ADDRESS);
        
        if (isConnected) {
          console.log("Submitting to blockchain with parameters:");
          console.log("- Aggressor:", data.aggressorName);
          console.log("- Institution:", data.institution); 
          console.log("- Year:", data.incidentYear);
          console.log("- Description length:", data.description.length);
          
          const txHash = await blockchainService.submitReport(
            data.aggressorName,
            data.institution,
            data.description,
            data.incidentYear,
            data.city || "",
            encryptedData
          );
          console.log("Transaction successful! Hash:", txHash);

          // Submit to backend with blockchain transaction hash
          return await apiRequest("POST", "/api/reports", {
            ...data,
            transactionHash: txHash,
          });
        } else {
          // Submit to backend only (for demo purposes)
          return await apiRequest("POST", "/api/reports", data);
        }
      } finally {
        setIsEncrypting(false);
      }
    },
    onSuccess: () => {
      toast({
        title: "Report submitted successfully",
        description: "It has been recorded on the blockchain and will appear on the clothesline.",
      });
      
      queryClient.invalidateQueries({ queryKey: ["/api/reports"] });
      queryClient.invalidateQueries({ queryKey: ["/api/analytics"] });
      
      form.reset();
      setLocation("/tendedero");
    },
    onError: (error: any) => {
      toast({
        title: "Error submitting report",
        description: error.message || "Please try again",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertReport) => {
    submitReportMutation.mutate(data);
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen py-16 px-4">
        <div className="max-w-md mx-auto">
          <WalletConnect onConnected={async () => {
            console.log("Wallet connected, checking status...");
            const connected = await blockchainService.isConnected();
            console.log("Connection status after connect:", connected);
            setIsConnected(connected);
          }} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-foreground mb-4">Make a Report</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Your personal information remains private and encrypted. Only the aggressor and institution data will be public.
          </p>
        </div>

        <div className="floating-form rounded-2xl p-8 clip-shadow">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {/* Public Data Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Eye className="h-5 w-5 text-primary mr-3" />
                    Public Information (Visible on Clothesline)
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="aggressorName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Aggressor Name *</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Full name of the aggressor" 
                              {...field} 
                              data-testid="input-aggressor-name"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="institution"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Institution *</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Company, university, organization" 
                              {...field} 
                              data-testid="input-institution"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="incidentYear"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Incident Year *</FormLabel>
                          <Select onValueChange={(value) => field.onChange(parseInt(value))} value={field.value?.toString()}>
                            <FormControl>
                              <SelectTrigger data-testid="select-incident-year">
                                <SelectValue placeholder="Select year" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {Array.from({ length: 5 }, (_, i) => 2024 - i).map(year => (
                                <SelectItem key={year} value={year.toString()}>
                                  {year}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>City</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="City where it occurred" 
                              {...field} 
                              data-testid="input-city"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>General Description *</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Briefly describe the incident (without details that could identify you)"
                            rows={4}
                            {...field} 
                            data-testid="textarea-description"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Private Data Section */}
              <Card className="bg-muted/50">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Lock className="h-5 w-5 text-accent mr-3" />
                    Private Information (Encrypted with FHE)
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    This information is encrypted before sending and is only used for anonymous statistical analysis.
                  </p>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="victimAge"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Your Age</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger data-testid="select-victim-age">
                                <SelectValue placeholder="Select range" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="1">18-25 years</SelectItem>
                              <SelectItem value="2">26-35 years</SelectItem>
                              <SelectItem value="3">36-45 years</SelectItem>
                              <SelectItem value="4">46-55 years</SelectItem>
                              <SelectItem value="5">56+ years</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="relationshipType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Relationship with Aggressor</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger data-testid="select-relationship-type">
                                <SelectValue placeholder="Select relationship" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="1">Unknown</SelectItem>
                              <SelectItem value="2">Boss/Superior</SelectItem>
                              <SelectItem value="3">Coworker</SelectItem>
                              <SelectItem value="4">Professor/Academic Authority</SelectItem>
                              <SelectItem value="5">Partner/Ex-partner</SelectItem>
                              <SelectItem value="6">Acquaintance</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="violenceType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Type of Violence</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger data-testid="select-violence-type">
                                <SelectValue placeholder="Select type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="1">Verbal harassment</SelectItem>
                              <SelectItem value="2">Physical harassment</SelectItem>
                              <SelectItem value="3">Discrimination</SelectItem>
                              <SelectItem value="4">Abuse of power</SelectItem>
                              <SelectItem value="5">Psychological violence</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="urgencyLevel"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Urgency Level</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger data-testid="select-urgency-level">
                                <SelectValue placeholder="Select urgency" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="1">Low - Controlled situation</SelectItem>
                              <SelectItem value="2">Medium - Requires attention</SelectItem>
                              <SelectItem value="3">High - Ongoing situation</SelectItem>
                              <SelectItem value="4">Critical - Immediate risk</SelectItem>
                              <SelectItem value="5">Emergency - Extreme danger</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Encryption Status */}
              {isEncrypting && (
                <Alert className="bg-accent/10 border-accent/20">
                  <Shield className="h-4 w-4" />
                  <AlertDescription className="flex items-center">
                    <span>Encrypting private data with FHEVM...</span>
                    <div className="ml-auto">
                      <div className="w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  </AlertDescription>
                </Alert>
              )}

              {/* Submit Button */}
              <div className="text-center">
                <Button 
                  type="submit" 
                  size="lg" 
                  disabled={submitReportMutation.isPending || isEncrypting}
                  className="text-lg font-semibold px-12 py-4"
                  data-testid="button-submit-report"
                >
                  <NotebookPen className="h-5 w-5 mr-3" />
                  {submitReportMutation.isPending ? "Submitting..." : "Submit Report to Blockchain"}
                </Button>
                <p className="text-sm text-muted-foreground mt-4">
                  By submitting, you agree that public information will be visible on the clothesline.
                </p>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}

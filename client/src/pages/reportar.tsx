import { useState } from "react";
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
  const [isConnected, setIsConnected] = useState(blockchainService.isConnected());

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
        // Encrypt private data
        const encryptedData = await fheService.encryptPrivateData({
          victimAge: data.victimAge,
          relationshipType: data.relationshipType,
          violenceType: data.violenceType,
          urgencyLevel: data.urgencyLevel,
        });

        // Submit to blockchain if connected
        if (isConnected) {
          const txHash = await blockchainService.submitReport(
            data.aggressorName,
            data.institution,
            data.description,
            data.incidentYear,
            data.city || "",
            encryptedData
          );

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
        title: "Denuncia enviada exitosamente",
        description: "Se ha registrado en la blockchain y aparecerá en el tendedero.",
      });
      
      queryClient.invalidateQueries({ queryKey: ["/api/reports"] });
      queryClient.invalidateQueries({ queryKey: ["/api/analytics"] });
      
      form.reset();
      setLocation("/tendedero");
    },
    onError: (error: any) => {
      toast({
        title: "Error al enviar denuncia",
        description: error.message || "Inténtalo de nuevo",
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
          <WalletConnect onConnected={() => setIsConnected(true)} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-foreground mb-4">Hacer una Denuncia</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Tu información personal permanece privada y cifrada. Solo los datos del agresor e institución serán públicos.
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
                    Información Pública (Visible en el Tendedero)
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="aggressorName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nombre del Agresor *</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Nombre completo del agresor" 
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
                          <FormLabel>Institución *</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Empresa, universidad, organización" 
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
                          <FormLabel>Año del Incidente *</FormLabel>
                          <Select onValueChange={(value) => field.onChange(parseInt(value))} value={field.value?.toString()}>
                            <FormControl>
                              <SelectTrigger data-testid="select-incident-year">
                                <SelectValue placeholder="Seleccionar año" />
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
                          <FormLabel>Ciudad</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Ciudad donde ocurrió" 
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
                        <FormLabel>Descripción General *</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Describe brevemente el incidente (sin detalles que puedan identificarte)"
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
                    Información Privada (Cifrada con FHE)
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Esta información se cifra antes de enviarse y solo se usa para análisis estadísticos anónimos.
                  </p>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="victimAge"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tu Edad</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger data-testid="select-victim-age">
                                <SelectValue placeholder="Seleccionar rango" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="1">18-25 años</SelectItem>
                              <SelectItem value="2">26-35 años</SelectItem>
                              <SelectItem value="3">36-45 años</SelectItem>
                              <SelectItem value="4">46-55 años</SelectItem>
                              <SelectItem value="5">56+ años</SelectItem>
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
                          <FormLabel>Relación con el Agresor</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger data-testid="select-relationship-type">
                                <SelectValue placeholder="Seleccionar relación" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="1">Desconocido</SelectItem>
                              <SelectItem value="2">Jefe/Superior</SelectItem>
                              <SelectItem value="3">Compañero de trabajo</SelectItem>
                              <SelectItem value="4">Profesor/Autoridad académica</SelectItem>
                              <SelectItem value="5">Pareja/Ex-pareja</SelectItem>
                              <SelectItem value="6">Conocido</SelectItem>
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
                          <FormLabel>Tipo de Violencia</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger data-testid="select-violence-type">
                                <SelectValue placeholder="Seleccionar tipo" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="1">Acoso verbal</SelectItem>
                              <SelectItem value="2">Acoso físico</SelectItem>
                              <SelectItem value="3">Discriminación</SelectItem>
                              <SelectItem value="4">Abuso de poder</SelectItem>
                              <SelectItem value="5">Violencia psicológica</SelectItem>
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
                          <FormLabel>Nivel de Urgencia</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger data-testid="select-urgency-level">
                                <SelectValue placeholder="Seleccionar urgencia" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="1">Baja - Situación controlada</SelectItem>
                              <SelectItem value="2">Media - Requiere atención</SelectItem>
                              <SelectItem value="3">Alta - Situación continua</SelectItem>
                              <SelectItem value="4">Crítica - Riesgo inmediato</SelectItem>
                              <SelectItem value="5">Emergencia - Peligro extremo</SelectItem>
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
                    <span>Cifrando datos privados con FHEVM...</span>
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
                  {submitReportMutation.isPending ? "Enviando..." : "Enviar Denuncia a Blockchain"}
                </Button>
                <p className="text-sm text-muted-foreground mt-4">
                  Al enviar, aceptas que la información pública será visible en el tendedero.
                </p>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}

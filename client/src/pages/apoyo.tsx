import { SupportDirectory } from "@/components/ui/support-directory";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { Heart, Phone, Brain, Shield } from "lucide-react";
import { SupportOrg } from "@shared/schema";

export default function Apoyo() {
  const { data: organizations = [], isLoading } = useQuery<SupportOrg[]>({
    queryKey: ["/api/support-organizations"],
  });

  if (isLoading) {
    return (
      <div className="min-h-screen py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold text-foreground mb-4">Support Directory</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Verified organizations in Mexico that provide comprehensive support to victims of gender-based violence.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-48 bg-muted rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-16 px-4 bg-white/30">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-foreground mb-4">Directorio de Apoyo</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Organizaciones verificadas en México que brindan apoyo integral a víctimas de violencia de género.
          </p>
        </div>

        {/* Emergency Banner */}
        <Card className="mb-8 bg-destructive/10 border-destructive/20">
          <CardHeader>
            <CardTitle className="flex items-center text-destructive">
              <Phone className="h-5 w-5 mr-3" />
              In Case of Emergency
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button 
                variant="destructive" 
                size="lg" 
                className="w-full"
                onClick={() => window.open('tel:911')}
                data-testid="button-emergency-911"
              >
                <Phone className="h-4 w-4 mr-2" />
                911 - National Emergency
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="w-full border-destructive text-destructive hover:bg-destructive hover:text-white"
                onClick={() => window.open('tel:01-800-822-4460')}
                data-testid="button-emergency-refugios"
              >
                <Heart className="h-4 w-4 mr-2" />
                01-800-822-4460 - Red Nacional de Refugios
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Support Organizations Directory */}
        <SupportDirectory organizations={organizations} />

        {/* Smart Recommendations */}
        <Card className="mt-8 bg-gradient-to-br from-primary/10 to-secondary/10 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Brain className="h-5 w-5 text-primary mr-3" />
              Recomendaciones Inteligentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-white/80 rounded-lg p-4">
              <p className="text-sm text-muted-foreground mb-3">
                Basado en datos cifrados, recomendamos contactar:
              </p>
              <div className="space-y-2">
                <div className="flex items-center text-sm">
                  <Shield className="h-4 w-4 text-accent mr-2" />
                  <span>Red Nacional de Refugios (urgencia alta)</span>
                </div>
                <div className="flex items-center text-sm">
                  <Shield className="h-4 w-4 text-accent mr-2" />
                  <span>SAPTEL (apoyo emocional)</span>
                </div>
                <div className="flex items-center text-sm">
                  <Shield className="h-4 w-4 text-accent mr-2" />
                  <span>CAVI (denuncia formal)</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Additional Resources */}
        <div className="mt-12 text-center">
          <h2 className="text-2xl font-bold text-foreground mb-6">Recursos Adicionales</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="pt-6 text-center">
                <Phone className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Líneas de Crisis</h3>
                <p className="text-sm text-muted-foreground">
                  Atención telefónica 24/7 para situaciones de emergencia
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6 text-center">
                <Heart className="h-12 w-12 text-secondary mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Refugios Seguros</h3>
                <p className="text-sm text-muted-foreground">
                  Espacios protegidos para víctimas y sus familias
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6 text-center">
                <Brain className="h-12 w-12 text-accent mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Apoyo Psicológico</h3>
                <p className="text-sm text-muted-foreground">
                  Terapia especializada en trauma y violencia de género
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

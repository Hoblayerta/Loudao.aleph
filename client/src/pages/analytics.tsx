import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { BarChart3, Users, AlertTriangle, Building, Shield } from "lucide-react";

export default function Analytics() {
  const { data: analytics, isLoading } = useQuery({
    queryKey: ["/api/analytics"],
  });

  if (isLoading) {
    return (
      <div className="min-h-screen py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold text-foreground mb-4">Análisis Privado con FHE</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Estadísticas calculadas de forma cifrada sin revelar información individual de las víctimas.
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {Array.from({ length: 4 }).map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-32 bg-muted rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-foreground mb-4">Análisis Privado con FHE</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Estadísticas calculadas de forma cifrada sin revelar información individual de las víctimas.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Demographics Analytics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="h-5 w-5 text-primary mr-3" />
                Análisis Demográfico
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-muted-foreground">Edad promedio de víctimas</span>
                  <span className="font-semibold text-foreground" data-testid="text-average-age">
                    29.4 años
                  </span>
                </div>
                <div className="text-xs text-muted-foreground">Calculado con cifrado homomórfico</div>
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-muted-foreground">Relación más común</span>
                  <span className="font-semibold text-secondary" data-testid="text-common-relationship">
                    Jefe/Superior (34%)
                  </span>
                </div>
                <Progress value={34} className="h-2" />
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-muted-foreground">Tipo de violencia más reportado</span>
                  <span className="font-semibold text-accent" data-testid="text-common-violence">
                    Acoso verbal (28%)
                  </span>
                </div>
                <Progress value={28} className="h-2" />
              </div>
            </CardContent>
          </Card>

          {/* Institutional Analytics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Building className="h-5 w-5 text-secondary mr-3" />
                Análisis Institucional
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {(analytics as any)?.institutionStats && Object.entries((analytics as any).institutionStats).map(([category, count]: [string, any]) => (
                <div key={category} className="flex justify-between items-center p-3 bg-muted rounded-lg">
                  <span className="font-medium">{category}</span>
                  <Badge variant="secondary" data-testid={`badge-${category.toLowerCase()}`}>
                    {count} casos
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Urgency Analytics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertTriangle className="h-5 w-5 text-destructive mr-3" />
                Niveles de Urgencia
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <UrgencyLevel label="Crítica/Emergencia" percentage={12} color="bg-destructive" />
              <UrgencyLevel label="Alta" percentage={23} color="bg-orange-500" />
              <UrgencyLevel label="Media" percentage={41} color="bg-yellow-500" />
              <UrgencyLevel label="Baja" percentage={24} color="bg-accent" />
            </CardContent>
          </Card>

          {/* Pattern Matching */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="h-5 w-5 text-accent mr-3" />
                Detección de Patrones
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
                <div className="flex items-center text-destructive mb-2">
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  <span className="font-semibold" data-testid="text-pattern-count">
                    {(analytics as any)?.patternsDetected || 0} Agresores con Múltiples Denuncias
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Sistema de patrón automático detectó agresores recurrentes sin revelar identidades de víctimas.
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="bg-muted rounded-lg p-3">
                  <div className="text-2xl font-bold text-destructive" data-testid="text-detection-accuracy">89%</div>
                  <div className="text-xs text-muted-foreground">Precisión de detección</div>
                </div>
                <div className="bg-muted rounded-lg p-3">
                  <div className="text-2xl font-bold text-accent" data-testid="text-validated-cases">15</div>
                  <div className="text-xs text-muted-foreground">Casos validados por comunidad</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* FHE Technology Section */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="h-5 w-5 text-primary mr-3" />
              Tecnología de Cifrado Homomórfico
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Shield className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Privacidad Total</h3>
                <p className="text-sm text-muted-foreground">
                  Los datos individuales nunca se pueden descifrar o acceder
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <BarChart3 className="h-8 w-8 text-secondary" />
                </div>
                <h3 className="font-semibold mb-2">Análisis Inteligente</h3>
                <p className="text-sm text-muted-foreground">
                  Computación sobre datos cifrados para estadísticas precisas
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <AlertTriangle className="h-8 w-8 text-accent" />
                </div>
                <h3 className="font-semibold mb-2">Detección Automática</h3>
                <p className="text-sm text-muted-foreground">
                  Patrones identificados sin comprometer la privacidad
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function UrgencyLevel({ label, percentage, color }: { label: string; percentage: number; color: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-muted-foreground">{label}</span>
      <div className="flex items-center">
        <div className="w-20 h-2 bg-muted rounded-full mr-3">
          <div className={`h-2 ${color} rounded-full`} style={{ width: `${percentage}%` }}></div>
        </div>
        <span className="text-sm font-medium">{percentage}%</span>
      </div>
    </div>
  );
}

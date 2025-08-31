import { Card, CardContent, CardHeader, CardTitle } from "./card";
import { Button } from "./button";
import { Badge } from "./badge";
import { Phone, ExternalLink, MapPin, Clock } from "lucide-react";
import { SupportOrg } from "@shared/schema";

interface SupportDirectoryProps {
  organizations: SupportOrg[];
  category?: string;
}

export function SupportDirectory({ organizations, category }: SupportDirectoryProps) {
  const categoryColors = {
    emergency: "bg-destructive/10 text-destructive border-destructive/20",
    government: "bg-primary/10 text-primary border-primary/20",
    ngo: "bg-secondary/10 text-secondary border-secondary/20",
    legal: "bg-accent/10 text-accent border-accent/20",
    psychological: "bg-orange-100 text-orange-700 border-orange-200"
  };

  const categoryIcons = {
    emergency: "🚨",
    government: "🏛️",
    ngo: "❤️",
    legal: "⚖️",
    psychological: "🧠"
  };

  const filteredOrgs = category ? organizations.filter(org => org.category === category) : organizations;

  const groupedOrgs = filteredOrgs.reduce((acc, org) => {
    if (!acc[org.category]) {
      acc[org.category] = [];
    }
    acc[org.category].push(org);
    return acc;
  }, {} as Record<string, SupportOrg[]>);

  const categoryOrder = ['emergency', 'government', 'ngo', 'legal', 'psychological'];
  const sortedCategories = categoryOrder.filter(cat => groupedOrgs[cat]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {sortedCategories.map(categoryKey => (
        <Card 
          key={categoryKey}
          className={`${categoryColors[categoryKey as keyof typeof categoryColors]} rounded-xl border`}
          data-testid={`card-category-${categoryKey}`}
        >
          <CardHeader>
            <CardTitle className="flex items-center text-xl">
              <span className="mr-3 text-2xl">
                {categoryIcons[categoryKey as keyof typeof categoryIcons]}
              </span>
              {getCategoryTitle(categoryKey)}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {groupedOrgs[categoryKey].map(org => (
              <div 
                key={org.id} 
                className="bg-white/80 rounded-lg p-4"
                data-testid={`org-card-${org.id}`}
              >
                <h4 className="font-semibold text-foreground mb-1" data-testid={`text-org-name-${org.id}`}>
                  {org.name}
                </h4>
                <p className="text-sm text-muted-foreground mb-2" data-testid={`text-org-description-${org.id}`}>
                  {org.description}
                </p>
                <p className="font-semibold text-lg mb-3" data-testid={`text-org-phone-${org.id}`}>
                  {org.phone}
                </p>
                
                <div className="flex items-center gap-2 mb-3 text-xs text-muted-foreground">
                  <MapPin className="h-3 w-3" />
                  <span>{org.region}</span>
                  {org.available24h && (
                    <>
                      <Clock className="h-3 w-3 ml-2" />
                      <span>24/7</span>
                    </>
                  )}
                </div>

                <div className="flex gap-2 flex-wrap">
                  <Button 
                    size="sm" 
                    className="text-xs"
                    onClick={() => window.open(`tel:${org.phone}`)}
                    data-testid={`button-call-${org.id}`}
                  >
                    <Phone className="h-3 w-3 mr-1" />
                    Llamar
                  </Button>
                  {org.website && (
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="text-xs"
                      onClick={() => org.website && window.open(org.website, '_blank')}
                      data-testid={`button-website-${org.id}`}
                    >
                      <ExternalLink className="h-3 w-3 mr-1" />
                      Web
                    </Button>
                  )}
                  {org.available24h && (
                    <Badge variant="secondary" className="text-xs">
                      24/7
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function getCategoryTitle(category: string): string {
  const titles = {
    emergency: "Emergencias",
    government: "Gobierno",
    ngo: "Organizaciones",
    legal: "Apoyo Legal",
    psychological: "Apoyo Psicológico"
  };
  
  return titles[category as keyof typeof titles] || category;
}

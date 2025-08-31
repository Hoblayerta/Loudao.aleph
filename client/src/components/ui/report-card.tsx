import { Card } from "./card";
import { Badge } from "./badge";
import { Button } from "./button";
import { AlertTriangle, Clock, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

interface ReportCardProps {
  report: {
    id: number;
    aggressorName: string;
    institution: string;
    description: string;
    incidentYear: number;
    city?: string;
    timestamp: number;
    patternCount?: number;
    category?: string;
  };
  onClick?: () => void;
  className?: string;
}

export function ReportCard({ report, onClick, className }: ReportCardProps) {
  const hasPattern = report.patternCount && report.patternCount > 1;
  const timeAgo = formatTimeAgo(report.timestamp);

  return (
    <Card 
      className={cn(
        "tendedero-card bg-card rounded-xl p-6 clip-shadow cursor-pointer transition-all duration-300",
        "transform hover:scale-102 hover:z-10",
        className
      )}
      onClick={onClick}
      data-testid={`card-report-${report.id}`}
    >
      {hasPattern && (
        <div className="pattern-alert bg-destructive/10 border border-destructive/20 rounded-lg p-2 mb-4">
          <div className="flex items-center text-destructive text-sm">
            <AlertTriangle className="h-4 w-4 mr-2" />
            <span className="font-medium">
              ⚠️ {report.patternCount} denuncias más contra este agresor
            </span>
          </div>
        </div>
      )}

      <h3 className="font-bold text-lg text-foreground mb-2" data-testid={`text-aggressor-${report.id}`}>
        {report.aggressorName}
      </h3>
      
      <p className="text-secondary font-medium mb-2" data-testid={`text-institution-${report.id}`}>
        {report.institution}
      </p>
      
      <p className="text-muted-foreground text-sm mb-3 line-clamp-3" data-testid={`text-description-${report.id}`}>
        {report.description}
      </p>

      <div className="flex justify-between items-center text-xs text-muted-foreground mb-4">
        <div className="flex items-center gap-4">
          <span data-testid={`text-year-${report.id}`}>{report.incidentYear}</span>
          {report.city && (
            <div className="flex items-center">
              <MapPin className="h-3 w-3 mr-1" />
              <span data-testid={`text-city-${report.id}`}>{report.city}</span>
            </div>
          )}
        </div>
        <div className="flex items-center">
          <Clock className="h-3 w-3 mr-1" />
          <span data-testid={`text-time-${report.id}`}>{timeAgo}</span>
        </div>
      </div>

      <div className="flex gap-2 flex-wrap">
        {report.category && (
          <Badge variant="secondary" className="text-xs">
            {report.category}
          </Badge>
        )}
        {hasPattern && (
          <Badge variant="destructive" className="text-xs">
            Patrón detectado
          </Badge>
        )}
      </div>
    </Card>
  );
}

function formatTimeAgo(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;
  
  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const weeks = Math.floor(diff / (1000 * 60 * 60 * 24 * 7));

  if (minutes < 60) {
    return `Hace ${minutes} min`;
  } else if (hours < 24) {
    return `Hace ${hours}h`;
  } else if (days < 7) {
    return `Hace ${days} día${days > 1 ? 's' : ''}`;
  } else {
    return `Hace ${weeks} semana${weeks > 1 ? 's' : ''}`;
  }
}

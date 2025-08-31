import { useState } from "react";
import { Input } from "./input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./select";
import { Button } from "./button";
import { ReportCard } from "./report-card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./dialog";
import { Badge } from "./badge";
import { Search, Filter, Plus, AlertTriangle, Heart, Phone, Info } from "lucide-react";
import { PublicReport } from "@shared/schema";

interface TendederoGridProps {
  reports: PublicReport[];
  isLoading?: boolean;
}

export function TendederoGrid({ reports, isLoading }: TendederoGridProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterYear, setFilterYear] = useState("");
  const [filterInstitution, setFilterInstitution] = useState("");
  const [selectedReport, setSelectedReport] = useState<PublicReport | null>(null);

  const filteredReports = reports.filter(report => {
    const matchesSearch = !searchTerm || 
      report.aggressorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.institution.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesYear = !filterYear || filterYear === 'all' || report.incidentYear.toString() === filterYear;
    const matchesInstitution = !filterInstitution || filterInstitution === 'all' || report.category === filterInstitution;

    return matchesSearch && matchesYear && matchesInstitution;
  });

  const years = Array.from(new Set(reports.map(r => r.incidentYear))).sort((a, b) => b - a);
  const categories = Array.from(new Set(reports.map(r => r.category).filter(Boolean)));

  return (
    <div className="space-y-8">
      {/* Filters */}
      <div className="bg-white/80 rounded-xl p-6 clip-shadow">
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar agresor o institución..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
                data-testid="input-search-reports"
              />
            </div>
            
            <Select value={filterYear} onValueChange={setFilterYear}>
              <SelectTrigger className="w-full sm:w-48" data-testid="select-filter-year">
                <SelectValue placeholder="Todos los años" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los años</SelectItem>
                {years.map(year => (
                  <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filterInstitution} onValueChange={setFilterInstitution}>
              <SelectTrigger className="w-full sm:w-48" data-testid="select-filter-institution">
                <SelectValue placeholder="Todas las categorías" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las categorías</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category} value={category!}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="text-sm text-muted-foreground" data-testid="text-results-count">
            <span className="font-medium">{filteredReports.length}</span> denuncias encontradas
          </div>
        </div>
      </div>

      {/* Clothesline */}
      <div className="clothesline relative">
        <div className="clothespin" style={{ left: "10%" }}></div>
        <div className="clothespin" style={{ left: "30%" }}></div>
        <div className="clothespin" style={{ left: "50%" }}></div>
        <div className="clothespin" style={{ left: "70%" }}></div>
        <div className="clothespin" style={{ left: "90%" }}></div>
      </div>

      {/* Reports Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="tendedero-card bg-card rounded-xl p-6 clip-shadow animate-pulse">
              <div className="h-4 bg-muted rounded mb-2"></div>
              <div className="h-3 bg-muted rounded mb-2 w-3/4"></div>
              <div className="h-16 bg-muted rounded mb-3"></div>
              <div className="flex justify-between">
                <div className="h-3 bg-muted rounded w-16"></div>
                <div className="h-3 bg-muted rounded w-20"></div>
              </div>
            </div>
          ))}
        </div>
      ) : filteredReports.length === 0 ? (
        <div className="text-center py-12">
          <Filter className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">No se encontraron denuncias</h3>
          <p className="text-muted-foreground">
            Intenta ajustar los filtros de búsqueda.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" data-testid="grid-reports">
          {filteredReports.map((report) => (
            <ReportCard
              key={report.id}
              report={report}
              onClick={() => setSelectedReport(report)}
            />
          ))}
        </div>
      )}

      {/* Load More Button */}
      {!isLoading && filteredReports.length > 0 && (
        <div className="text-center">
          <Button variant="outline" size="lg" data-testid="button-load-more">
            <Plus className="h-4 w-4 mr-2" />
            Cargar más denuncias
          </Button>
        </div>
      )}

      {/* Report Detail Modal */}
      <Dialog open={!!selectedReport} onOpenChange={() => setSelectedReport(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {selectedReport && (
            <>
              <DialogHeader>
                <DialogTitle>Detalles de la Denuncia</DialogTitle>
              </DialogHeader>
              
              <div className="space-y-6">
                {selectedReport.patternCount && selectedReport.patternCount > 1 && (
                  <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
                    <div className="flex items-center text-destructive mb-2">
                      <AlertTriangle className="h-4 w-4 mr-2" />
                      <span className="font-semibold">
                        ⚠️ {selectedReport.patternCount} denuncias contra este agresor
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Nuestro sistema de detección automática ha identificado múltiples denuncias contra esta persona.
                    </p>
                  </div>
                )}

                <div>
                  <h3 className="font-semibold text-foreground mb-2">Agresor</h3>
                  <p className="text-lg text-primary font-medium">{selectedReport.aggressorName}</p>
                </div>

                <div>
                  <h3 className="font-semibold text-foreground mb-2">Institución</h3>
                  <p className="text-secondary font-medium">{selectedReport.institution}</p>
                </div>

                <div>
                  <h3 className="font-semibold text-foreground mb-2">Descripción Completa</h3>
                  <p className="text-muted-foreground leading-relaxed">{selectedReport.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">Año del Incidente</h3>
                    <p className="text-muted-foreground">{selectedReport.incidentYear}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">Ciudad</h3>
                    <p className="text-muted-foreground">{selectedReport.city || "No especificada"}</p>
                  </div>
                </div>

                <div className="border-t border-border pt-6">
                  <h3 className="font-semibold text-foreground mb-4">Buscar Apoyo Relevante</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Button variant="outline" className="w-full">
                      <Heart className="h-4 w-4 mr-2" />
                      Organizaciones de Apoyo
                    </Button>
                    <Button variant="destructive" className="w-full">
                      <Phone className="h-4 w-4 mr-2" />
                      Emergencias: 911
                    </Button>
                  </div>
                </div>

                <div className="bg-muted rounded-lg p-4">
                  <p className="text-sm text-muted-foreground">
                    <Info className="h-4 w-4 inline mr-2" />
                    Esta denuncia está registrada en blockchain de forma inmutable. 
                    Los datos privados están cifrados y no pueden ser accedidos individualmente.
                  </p>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

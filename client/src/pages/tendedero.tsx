import { TendederoGrid } from "@/components/ui/tendedero-grid";
import { useQuery } from "@tanstack/react-query";
import { PublicReport } from "@shared/schema";

export default function Tendedero() {
  const { data: reports = [], isLoading } = useQuery<PublicReport[]>({
    queryKey: ["/api/reports"],
  });

  return (
    <div className="min-h-screen py-16 px-4 bg-white/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-foreground mb-4">Tendedero de Denuncias</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Todas las denuncias públicas están aquí. La información privada permanece cifrada y se usa solo para análisis.
          </p>
        </div>

        <TendederoGrid reports={reports} isLoading={isLoading} />
      </div>
    </div>
  );
}

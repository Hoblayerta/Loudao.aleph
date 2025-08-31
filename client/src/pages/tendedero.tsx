import { TendederoGrid } from "@/components/ui/tendedero-grid";
import { useQuery } from "@tanstack/react-query";
import { PublicReport } from "@shared/schema";

// Placeholder data for demonstration
const PLACEHOLDER_REPORTS: PublicReport[] = [
  {
    id: 1,
    aggressorName: "Carlos Mendez",
    institution: "Universidad Nacional",
    description: "Acoso verbal constante durante clases y tutorías. Comentarios inapropiados sobre apariencia física.",
    incidentYear: 2024,
    city: "Ciudad de México",
    category: "Universidad",
    patternCount: 3,
    supportOrganizations: [],
    transactionHash: "0x123...abc"
  },
  {
    id: 2,
    aggressorName: "Roberto Silva",
    institution: "Tech Corp Solutions",
    description: "Abuso de poder y discriminación laboral. Amenazas de despido por no acceder a solicitudes inapropiadas.",
    incidentYear: 2024,
    city: "Guadalajara",
    category: "Empresa",
    patternCount: 1,
    supportOrganizations: [],
    transactionHash: "0x456...def"
  },
  {
    id: 3,
    aggressorName: "Diego Martinez",
    institution: "Hospital General",
    description: "Comportamiento inapropiado durante consultas médicas. Contacto físico no consensual.",
    incidentYear: 2023,
    city: "Monterrey",
    category: "Salud",
    patternCount: 2,
    supportOrganizations: [],
    transactionHash: "0x789...ghi"
  },
  {
    id: 4,
    aggressorName: "Fernando Lopez",
    institution: "Instituto Tecnológico",
    description: "Acoso psicológico y discriminación por género. Comentarios despectivos en clase.",
    incidentYear: 2024,
    city: "Puebla",
    category: "Universidad",
    patternCount: 1,
    supportOrganizations: [],
    transactionHash: "0xabc...123"
  }
];

export default function Tendedero() {
  const { data: apiReports = [], isLoading } = useQuery<PublicReport[]>({
    queryKey: ["/api/reports"],
  });

  // Combine API reports with placeholder data (API reports take precedence)
  const reports = apiReports.length > 0 ? apiReports : PLACEHOLDER_REPORTS;

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

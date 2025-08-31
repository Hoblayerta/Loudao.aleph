import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { Plus, Eye, BarChart3, Heart } from "lucide-react";

export default function Home() {
  const { data: analytics } = useQuery({
    queryKey: ["/api/analytics"],
  });

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
            Digital <span className="text-primary">Clothesline</span> for{" "}
            <span className="text-secondary">Reports</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            A hybrid platform that combines public transparency with intelligent privacy 
            to report gender-based violence using blockchain technology.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/reportar">
              <Button size="lg" className="text-lg font-semibold" data-testid="button-make-report">
                <Plus className="h-5 w-5 mr-2" />
                Hacer Denuncia
              </Button>
            </Link>
            <Link href="/tendedero">
              <Button size="lg" variant="secondary" className="text-lg font-semibold" data-testid="button-view-tendedero">
                <Eye className="h-5 w-5 mr-2" />
                View Clothesline
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Statistics Bar */}
      <section className="bg-white/50 py-8 border-y border-border" id="statistics">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div data-testid="stat-total-reports">
              <div className="text-3xl font-bold text-primary">
                {(analytics as any)?.totalReports || 0}
              </div>
              <div className="text-muted-foreground">Total Reports</div>
            </div>
            <div data-testid="stat-unique-aggressors">
              <div className="text-3xl font-bold text-secondary">
                {(analytics as any)?.uniqueAggressors || 0}
              </div>
              <div className="text-muted-foreground">Unique Aggressors</div>
            </div>
            <div data-testid="stat-patterns-detected">
              <div className="text-3xl font-bold text-accent">
                {(analytics as any)?.patternsDetected || 0}
              </div>
              <div className="text-muted-foreground">Patterns Detected</div>
            </div>
            <div data-testid="stat-support-organizations">
              <div className="text-3xl font-bold text-destructive">
                {(analytics as any)?.supportOrganizations || 0}
              </div>
              <div className="text-muted-foreground">Support Organizations</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">How It Works?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Hybrid blockchain technology that protects victims while detecting patterns.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="text-center p-6">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Plus className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Secure Reports</h3>
                <p className="text-sm text-muted-foreground">
                  Public information visible, private data encrypted with FHE
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-6">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Eye className="h-6 w-6 text-secondary" />
                </div>
                <h3 className="font-semibold mb-2">Public Clothesline</h3>
                <p className="text-sm text-muted-foreground">
                  Transparent visualization of all registered reports
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-6">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <BarChart3 className="h-6 w-6 text-accent" />
                </div>
                <h3 className="font-semibold mb-2">Private Analysis</h3>
                <p className="text-sm text-muted-foreground">
                  Statistics computed without revealing individual data
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-6">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-destructive/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Heart className="h-6 w-6 text-destructive" />
                </div>
                <h3 className="font-semibold mb-2">Support Network</h3>
                <p className="text-sm text-muted-foreground">
                  Verified directory of support organizations in Mexico
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Technology Section */}
      <section className="py-16 px-4 bg-white/30">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-foreground mb-4">Cutting-Edge Technology</h2>
          <p className="text-muted-foreground mb-8">
            We use the most advanced technologies to ensure privacy and transparency.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white/80 rounded-xl p-6">
              <h3 className="font-semibold text-lg mb-2">Zama FHEVM</h3>
              <p className="text-sm text-muted-foreground">
                Fully Homomorphic Encryption for private data analysis
              </p>
            </div>
            <div className="bg-white/80 rounded-xl p-6">
              <h3 className="font-semibold text-lg mb-2">Blockchain Security</h3>
              <p className="text-sm text-muted-foreground">
                Scalable and efficient blockchain for immutable record keeping
              </p>
            </div>
            <div className="bg-white/80 rounded-xl p-6">
              <h3 className="font-semibold text-lg mb-2">Automatic Detection</h3>
              <p className="text-sm text-muted-foreground">
                Pattern matching algorithms to identify repeat offenders
              </p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-xl p-6">
            <h3 className="font-semibold text-lg mb-2">Hybrid by Design</h3>
            <p className="text-muted-foreground">
              Aggressor and institution information is public to alert the community, 
              while victim data remains private and encrypted for statistical analysis.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

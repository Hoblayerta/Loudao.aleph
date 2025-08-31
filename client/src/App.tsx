import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Navbar } from "@/components/ui/navbar";
import Home from "@/pages/home";
import Tendedero from "@/pages/tendedero";
import Reportar from "@/pages/reportar";
import Analytics from "@/pages/analytics";
import Apoyo from "@/pages/apoyo";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/tendedero" component={Tendedero} />
      <Route path="/reportar" component={Reportar} />
      <Route path="/analytics" component={Analytics} />
      <Route path="/apoyo" component={Apoyo} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen gradient-bg">
          <Navbar />
          <Router />
          
          {/* Footer */}
          <footer className="bg-card border-t border-border py-12">
            <div className="max-w-6xl mx-auto px-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div>
                  <div className="flex items-center space-x-3 mb-4">
                    <img 
                      src="@assets/5017421975789875507_1756640482111.jpg" 
                      alt="LouDao" 
                      className="h-8 w-auto" 
                    />
                  </div>
                  <p className="text-muted-foreground text-sm">
                    Hybrid platform for reporting gender-based violence with transparency and intelligent privacy.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-4 text-foreground">Links</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li><a href="/tendedero" className="hover:text-foreground transition-colors">Clothesline</a></li>
                    <li><a href="/reportar" className="hover:text-foreground transition-colors">Make Report</a></li>
                    <li><a href="/analytics" className="hover:text-foreground transition-colors">Analytics</a></li>
                    <li><a href="/apoyo" className="hover:text-foreground transition-colors">Support</a></li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-4 text-foreground">Technology</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>Zama FHEVM</li>
                    <li>Blockchain Security</li>
                    <li>Homomorphic Encryption</li>
                    <li>Hybrid Architecture</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-4 text-foreground">Emergency</h4>
                  <div className="space-y-2 text-sm">
                    <div className="bg-destructive text-destructive-foreground px-3 py-2 rounded">
                      <strong>911</strong> - National Emergency
                    </div>
                    <div className="bg-primary text-primary-foreground px-3 py-2 rounded">
                      <strong>01-800-822-4460</strong> - National Shelter Network
                    </div>
                  </div>
                </div>
              </div>
              <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground">
                <p>&copy; 2024 LouDao. Built with blockchain technology for social justice.</p>
              </div>
            </div>
          </footer>
        </div>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;

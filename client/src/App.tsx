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
          <footer className="bg-foreground text-background py-12">
            <div className="max-w-6xl mx-auto px-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div>
                  <div className="flex items-center space-x-3 mb-4">
                    <img 
                      src="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAgADsDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD3+iiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigD//2Q==" 
                      alt="LouDao" 
                      className="h-6 w-auto" 
                    />
                    <span className="text-xl font-bold">LouDao</span>
                  </div>
                  <p className="text-background/80 text-sm">
                    Hybrid platform for reporting gender-based violence with transparency and intelligent privacy.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-4">Links</h4>
                  <ul className="space-y-2 text-sm text-background/80">
                    <li><a href="/tendedero" className="hover:text-background transition-colors">Clothesline</a></li>
                    <li><a href="/reportar" className="hover:text-background transition-colors">Make Report</a></li>
                    <li><a href="/analytics" className="hover:text-background transition-colors">Analytics</a></li>
                    <li><a href="/apoyo" className="hover:text-background transition-colors">Support</a></li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-4">Technology</h4>
                  <ul className="space-y-2 text-sm text-background/80">
                    <li>Zama FHEVM</li>
                    <li>Blockchain Security</li>
                    <li>Homomorphic Encryption</li>
                    <li>Hybrid Architecture</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-4">Emergency</h4>
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
              <div className="border-t border-background/20 mt-8 pt-8 text-center text-sm text-background/60">
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

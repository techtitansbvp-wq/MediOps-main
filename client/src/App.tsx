import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";
import { Sidebar } from "@/components/Sidebar";

// Pages
import Dashboard from "@/pages/Dashboard";
import Consumers from "@/pages/Consumers";
import Inventory from "@/pages/Inventory";
import Subscription from "@/pages/Subscription";
import Emergency from "@/pages/Emergency";
import Settings from "@/pages/Settings";
import Login from "@/pages/Login";
import NotFound from "@/pages/not-found";

import { ThemeProvider } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/ThemeToggle";
import { DemoBanner } from "@/components/DemoBanner";
import { useDemoMode } from "@/hooks/use-demo";

function PrivateLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background flex flex-col transition-colors duration-300">
      <DemoBanner />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 lg:ml-64 min-h-screen bg-background/50 transition-colors duration-300 w-full overflow-x-hidden pt-16 lg:pt-0">
          {children}
        </main>
      </div>
    </div>
  );
}

function Router() {
  const { user, isLoading } = useAuth();
  const { isDemoMode } = useDemoMode();
  const [location] = useLocation();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Auth Guard - Bypass if in Demo Mode
  if (!user && !isDemoMode) {
    return <Login />;
  }

  // Define a mock user for Demo Mode if not logged in
  const displayUser = user || (isDemoMode ? {
    id: 0,
    username: "demo_user",
    firstName: "Demo",
    lastName: "User",
    email: "demo@mediops.com",
    role: "admin"
  } : null);

  return (
    <PrivateLayout>
      <Switch>
        <Route path="/" component={Dashboard} />
        <Route path="/consumers" component={Consumers} />
        <Route path="/inventory" component={Inventory} />
        <Route path="/subscription" component={Subscription} />
        <Route path="/emergency" component={Emergency} />
        <Route path="/settings" component={Settings} />
        <Route component={NotFound} />
      </Switch>
    </PrivateLayout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="system" storageKey="medi-ops-theme">
        <TooltipProvider>
          <ThemeToggle />
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;

import { Button } from "@/components/ui/button";
import { Activity, ArrowRight, ShieldCheck, HeartPulse } from "lucide-react";
import heroImg from "/logo.png";
import { useDemoMode } from "@/hooks/use-demo";
import { useLocation } from "wouter";

export default function Login() {
  const { setDemoMode } = useDemoMode();
  const [, setLocation] = useLocation();

  const handleLogin = () => {
    window.location.href = "/api/login";
  };

  const handleDemoMode = () => {
    setDemoMode(true);
    setLocation("/");
  };

  return (
    <div className="min-h-screen w-full flex bg-background">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-primary/10 via-background to-secondary/10 relative overflow-hidden flex-col justify-between p-12">
        {/* Decorative Elements */}
        <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-primary/20 rounded-full blur-3xl opacity-50" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-secondary/10 rounded-full blur-3xl opacity-50" />
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-8">
            <div className="bg-white p-2.5 rounded-xl shadow-lg shadow-black/5">
              <Activity className="w-8 h-8 text-primary" />
            </div>
            <span className="font-display font-bold text-2xl tracking-tight">MediOps</span>
          </div>
          
          <h1 className="text-5xl font-display font-bold leading-tight mb-6 text-foreground">
            Hyperlocal Pharmacy <br />
            <span className="text-primary">Support Platform</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-md leading-relaxed">
            Empowering elderly care focused pharmacies with simple, accessible tools for better patient outcomes.
          </p>
        </div>

        <div className="relative z-10 grid grid-cols-2 gap-6 mt-12">
          <div className="bg-white/60 backdrop-blur-md p-6 rounded-2xl border border-white/50 shadow-sm">
            <ShieldCheck className="w-8 h-8 text-secondary mb-4" />
            <h3 className="font-bold text-lg mb-2">Secure & Compliant</h3>
            <p className="text-sm text-muted-foreground">HIPAA compliant data storage and secure access controls.</p>
          </div>
          <div className="bg-white/60 backdrop-blur-md p-6 rounded-2xl border border-white/50 shadow-sm">
            <HeartPulse className="w-8 h-8 text-primary mb-4" />
            <h3 className="font-bold text-lg mb-2">Patient Focused</h3>
            <p className="text-sm text-muted-foreground">Streamlined profiles and medical history management.</p>
          </div>
        </div>
        
        <div className="text-sm text-muted-foreground relative z-10">
          © {new Date().getFullYear()} MediOps. All rights reserved.
        </div>
      </div>

      {/* Right Panel - Login */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center lg:text-left">
            <div className="inline-flex lg:hidden items-center gap-2 mb-8 bg-primary/10 px-4 py-2 rounded-full">
              <Activity className="w-5 h-5 text-primary" />
              <span className="font-display font-bold text-primary">MediOps OS</span>
            </div>
            <h2 className="text-3xl font-bold tracking-tight mb-2">Welcome Back</h2>
            <p className="text-muted-foreground">Sign in to manage your pharmacy operations</p>
          </div>

          <div className="space-y-4">
            <Button 
              size="lg" 
              className="w-full h-14 text-lg font-medium shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300"
              onClick={handleLogin}
            >
              Sign In with Replit Auth
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>

            <Button
              variant="outline"
              size="lg"
              className="w-full h-14 text-lg font-medium border-primary/20 hover:bg-primary/5 hover:border-primary/40 transition-all duration-300"
              onClick={handleDemoMode}
            >
              View Demo
            </Button>
            
            <p className="text-xs text-center text-muted-foreground mt-8">
              By signing in, you agree to our Terms of Service and Privacy Policy.
              <br />Access is restricted to authorized personnel only.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

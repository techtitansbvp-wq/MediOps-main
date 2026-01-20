import { useDemoMode } from "@/hooks/use-demo";
import { Button } from "@/components/ui/button";
import { XCircle, Info } from "lucide-react";

export function DemoBanner() {
  const { isDemoMode, setDemoMode } = useDemoMode();

  if (!isDemoMode) return null;

  return (
    <div className="bg-primary/10 border-b border-primary/20 py-2 px-4 flex items-center justify-between sticky top-0 z-[100] backdrop-blur-md">
      <div className="flex items-center gap-2 text-primary text-sm font-medium">
        <Info className="w-4 h-4" />
        <span>Demo Mode Active - Using Mock Data (Read-Only)</span>
      </div>
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={() => setDemoMode(false)}
        className="h-8 text-xs font-semibold hover:bg-primary/20 text-primary flex items-center gap-1"
      >
        <XCircle className="w-3 h-3" />
        Exit Demo
      </Button>
    </div>
  );
}

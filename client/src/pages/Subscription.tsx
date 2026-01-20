import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Star, Zap, Crown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

type Plan = "Basic" | "Pro" | "Premium";

interface PlanDetails {
  name: Plan;
  price: string;
  description: string;
  benefits: string[];
  icon: any;
  color: string;
}

const PLANS: PlanDetails[] = [
  {
    name: "Basic",
    price: "$0",
    description: "Essential features for individuals",
    benefits: ["Standard delivery", "No priority", "No consultation", "Mobile access"],
    icon: Zap,
    color: "bg-blue-500",
  },
  {
    name: "Pro",
    price: "$29",
    description: "Enhanced support for growing needs",
    benefits: ["Faster delivery", "Limited consultation", "Medium priority", "Priority support"],
    icon: Star,
    color: "bg-green-500",
  },
  {
    name: "Premium",
    price: "$99",
    description: "Maximum priority and full access",
    benefits: ["Fastest delivery", "Unlimited consultation", "Highest priority", "Emergency priority", "Dedicated account manager"],
    icon: Crown,
    color: "bg-purple-500",
  },
];

export default function Subscription() {
  const [currentPlan, setCurrentPlan] = useState<Plan>("Basic");
  const { toast } = useToast();

  useEffect(() => {
    const savedPlan = localStorage.getItem("medi-ops-plan") as Plan;
    if (savedPlan && ["Basic", "Pro", "Premium"].includes(savedPlan)) {
      setCurrentPlan(savedPlan);
    }
  }, []);

  const handleSwitchPlan = (plan: Plan) => {
    setCurrentPlan(plan);
    localStorage.setItem("medi-ops-plan", plan);
    toast({
      title: "Plan Updated",
      description: `You have successfully switched to the ${plan} plan.`,
    });
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-display font-bold tracking-tight text-foreground">Subscription Management</h1>
        <p className="text-muted-foreground">Manage your plan and explore premium benefits.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {PLANS.map((plan) => {
          const Icon = plan.icon;
          const isCurrent = currentPlan === plan.name;
          
          return (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className={`relative h-full flex flex-col hover-elevate transition-all duration-300 ${isCurrent ? "border-primary ring-2 ring-primary/20 shadow-xl" : "border-border"}`}>
                {isCurrent && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground font-semibold px-4 py-1">
                    Current Plan
                  </Badge>
                )}
                <CardHeader>
                  <div className={`w-12 h-12 rounded-xl ${plan.color} flex items-center justify-center mb-4 shadow-lg`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-1 space-y-6">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className="text-muted-foreground">/month</span>
                  </div>
                  <ul className="space-y-3">
                    {plan.benefits.map((benefit) => (
                      <li key={benefit} className="flex items-center gap-3 text-sm text-foreground/80">
                        <div className="bg-primary/10 p-1 rounded-full">
                          <Check className="w-3 h-3 text-primary" />
                        </div>
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button
                    variant={isCurrent ? "outline" : "default"}
                    className="w-full h-11 font-semibold transition-all active-elevate-2"
                    disabled={isCurrent}
                    onClick={() => handleSwitchPlan(plan.name)}
                  >
                    {isCurrent ? "Active" : `Upgrade to ${plan.name}`}
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          );
        })}
      </div>

      <Card className="bg-primary/5 border-primary/20 p-6">
        <div className="flex items-start gap-4">
          <div className="bg-primary/10 p-3 rounded-full">
            <Activity className="w-6 h-6 text-primary" />
          </div>
          <div className="space-y-1">
            <h3 className="font-semibold text-lg">Current Status: {currentPlan} Priority</h3>
            <p className="text-sm text-muted-foreground">
              {currentPlan === "Basic" && "You are currently on standard priority. Upgrade for faster responses."}
              {currentPlan === "Pro" && "Enjoy medium priority status and limited consultations."}
              {currentPlan === "Premium" && "You have highest priority access and unlimited emergency consultations."}
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}

import { Activity } from "lucide-react";

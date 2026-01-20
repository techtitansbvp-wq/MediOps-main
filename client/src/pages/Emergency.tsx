import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Emergency, InsertEmergency } from "@shared/schema";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Phone, MapPin, AlertCircle, Clock, CheckCircle2, Trash2, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertEmergencySchema } from "@shared/schema";

export default function EmergencyPage() {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);

  const { data: emergencies, isLoading } = useQuery<Emergency[]>({
    queryKey: ["/api/emergencies"],
  });

  const createMutation = useMutation({
    mutationFn: async (data: InsertEmergency) => {
      await apiRequest("POST", "/api/emergencies", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/emergencies"] });
      toast({ title: "Emergency Reported", description: "The request has been logged." });
      setOpen(false);
    },
  });

  const statusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      await apiRequest("PATCH", `/api/emergencies/${id}/status`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/emergencies"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/emergencies/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/emergencies"] });
      toast({ title: "Deleted", description: "Emergency record removed." });
    },
  });

  const form = useForm<InsertEmergency>({
    resolver: zodResolver(insertEmergencySchema),
    defaultValues: {
      consumerName: "",
      contactInfo: "",
      location: "",
      emergencyType: "",
      description: "",
      status: "Pending",
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold tracking-tight text-foreground flex items-center gap-3">
            <AlertCircle className="w-8 h-8 text-destructive animate-pulse" />
            Emergency Center
          </h1>
          <p className="text-muted-foreground">Monitor and respond to urgent medical requests.</p>
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="destructive" className="h-11 px-6 shadow-lg shadow-destructive/20 active-elevate-2">
              <Plus className="w-5 h-5 mr-2" />
              New Emergency
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Report Emergency</DialogTitle>
              <DialogDescription>Enter patient and emergency details immediately.</DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit((data) => createMutation.mutate(data))} className="space-y-4">
                <FormField
                  control={form.control}
                  name="consumerName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Patient Name</FormLabel>
                      <FormControl><Input {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="emergencyType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Emergency Type</FormLabel>
                      <FormControl><Input placeholder="Heart Attack, Fall, etc." {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="contactInfo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Contact Info</FormLabel>
                        <FormControl><Input {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Location</FormLabel>
                        <FormControl><Input {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl><Input {...field} value={field.value || ""} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={createMutation.isPending}>
                  {createMutation.isPending ? "Logging..." : "Create Emergency"}
                </Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {emergencies?.map((emergency) => (
          <Card key={emergency.id} className={`border-2 transition-all duration-300 hover-elevate ${
            emergency.status === "Pending" ? "border-destructive/30 bg-destructive/5" : 
            emergency.status === "In Progress" ? "border-amber-500/30 bg-amber-500/5" : "border-green-500/30 bg-green-500/5"
          }`}>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start mb-2">
                <Badge variant={
                  emergency.status === "Pending" ? "destructive" : 
                  emergency.status === "In Progress" ? "secondary" : "default"
                } className="font-bold">
                  {emergency.status}
                </Badge>
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {format(new Date(emergency.timestamp), "HH:mm")}
                </span>
              </div>
              <CardTitle className="text-xl">{emergency.emergencyType}</CardTitle>
              <CardDescription className="font-semibold text-foreground">{emergency.consumerName}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Phone className="w-4 h-4" />
                  <span>{emergency.contactInfo}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  <span>{emergency.location}</span>
                </div>
              </div>
              
              <div className="flex gap-2 pt-2">
                {emergency.status === "Pending" && (
                  <Button 
                    size="sm" 
                    className="flex-1 bg-amber-500 hover:bg-amber-600 text-white"
                    onClick={() => statusMutation.mutate({ id: emergency.id, status: "In Progress" })}
                  >
                    Start
                  </Button>
                )}
                {emergency.status === "In Progress" && (
                  <Button 
                    size="sm" 
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                    onClick={() => statusMutation.mutate({ id: emergency.id, status: "Resolved" })}
                  >
                    Resolve
                  </Button>
                )}
                <Button 
                  size="icon" 
                  variant="outline" 
                  className="text-destructive hover:bg-destructive/10"
                  onClick={() => deleteMutation.mutate(emergency.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

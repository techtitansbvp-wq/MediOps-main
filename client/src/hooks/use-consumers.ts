import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl, type CreateConsumerRequest, type UpdateConsumerRequest } from "@shared/routes";
import { useToast } from "@/hooks/use-toast";
import { useDemoMode } from "./use-demo";
import { MOCK_CONSUMERS } from "@shared/mockData";

export function useConsumers(search?: string) {
  const { isDemoMode } = useDemoMode();
  return useQuery({
    queryKey: [api.consumers.list.path, search, isDemoMode],
    queryFn: async () => {
      if (isDemoMode) {
        return MOCK_CONSUMERS.filter(c => 
          !search || 
          c.firstName.toLowerCase().includes(search.toLowerCase()) ||
          c.lastName.toLowerCase().includes(search.toLowerCase()) ||
          c.email.toLowerCase().includes(search.toLowerCase())
        );
      }
      const url = search 
        ? `${api.consumers.list.path}?search=${encodeURIComponent(search)}`
        : api.consumers.list.path;
      
      const res = await fetch(url, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch consumers");
      return api.consumers.list.responses[200].parse(await res.json());
    },
  });
}

export function useConsumer(id: number) {
  const { isDemoMode } = useDemoMode();
  return useQuery({
    queryKey: [api.consumers.get.path, id, isDemoMode],
    queryFn: async () => {
      if (isDemoMode) {
        return MOCK_CONSUMERS.find(c => c.id === id) || null;
      }
      const url = buildUrl(api.consumers.get.path, { id });
      const res = await fetch(url, { credentials: "include" });
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch consumer");
      return api.consumers.get.responses[200].parse(await res.json());
    },
    enabled: !!id,
  });
}

export function useCreateConsumer() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { isDemoMode } = useDemoMode();

  return useMutation({
    mutationFn: async (data: CreateConsumerRequest) => {
      if (isDemoMode) {
        toast({ title: "Demo Mode", description: "Write actions are disabled in demo mode." });
        return null;
      }
      const res = await fetch(api.consumers.create.path, {
        method: api.consumers.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });

      if (!res.ok) {
        if (res.status === 400) {
          const error = api.consumers.create.responses[400].parse(await res.json());
          throw new Error(error.message);
        }
        throw new Error("Failed to create consumer");
      }
      return api.consumers.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      if (!isDemoMode) {
        queryClient.invalidateQueries({ queryKey: [api.consumers.list.path] });
        toast({
          title: "Success",
          description: "Consumer added successfully",
          variant: "default",
        });
      }
    },
    onError: (error) => {
      if (!isDemoMode) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      }
    },
  });
}

export function useUpdateConsumer() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { isDemoMode } = useDemoMode();

  return useMutation({
    mutationFn: async ({ id, ...updates }: { id: number } & UpdateConsumerRequest) => {
      if (isDemoMode) {
        toast({ title: "Demo Mode", description: "Write actions are disabled in demo mode." });
        return null;
      }
      const url = buildUrl(api.consumers.update.path, { id });
      const res = await fetch(url, {
        method: api.consumers.update.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
        credentials: "include",
      });

      if (!res.ok) {
        if (res.status === 400) {
          const error = api.consumers.update.responses[400].parse(await res.json());
          throw new Error(error.message);
        }
        throw new Error("Failed to update consumer");
      }
      return api.consumers.update.responses[200].parse(await res.json());
    },
    onSuccess: () => {
      if (!isDemoMode) {
        queryClient.invalidateQueries({ queryKey: [api.consumers.list.path] });
        toast({
          title: "Success",
          description: "Consumer updated successfully",
          variant: "default",
        });
      }
    },
    onError: (error) => {
      if (!isDemoMode) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      }
    },
  });
}

export function useDeleteConsumer() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { isDemoMode } = useDemoMode();

  return useMutation({
    mutationFn: async (id: number) => {
      if (isDemoMode) {
        toast({ title: "Demo Mode", description: "Write actions are disabled in demo mode." });
        return;
      }
      const url = buildUrl(api.consumers.delete.path, { id });
      const res = await fetch(url, { 
        method: api.consumers.delete.method, 
        credentials: "include" 
      });
      
      if (!res.ok) throw new Error("Failed to delete consumer");
    },
    onSuccess: () => {
      if (!isDemoMode) {
        queryClient.invalidateQueries({ queryKey: [api.consumers.list.path] });
        toast({
          title: "Success",
          description: "Consumer deleted successfully",
          variant: "default",
        });
      }
    },
    onError: (error) => {
      if (!isDemoMode) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      }
    },
  });
}

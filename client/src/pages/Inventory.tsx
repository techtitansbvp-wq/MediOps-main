import { useState, useMemo } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Inventory, InsertInventory } from "@shared/schema";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Plus, 
  Search, 
  MoreHorizontal, 
  Pencil, 
  Trash2, 
  Loader2,
  Package,
  AlertTriangle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { InventoryDialog } from "@/components/InventoryDialog";
import { useDemoMode } from "@/hooks/use-demo";
import { MOCK_INVENTORY } from "@shared/mockData";

const LOW_STOCK_THRESHOLD = 10;

export default function InventoryPage() {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const { toast } = useToast();
  const { isDemoMode } = useDemoMode();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<(Inventory) | undefined>(undefined);

  const { data: inventory, isLoading } = useQuery<Inventory[]>({
    queryKey: ["/api/inventory", isDemoMode],
    queryFn: async () => {
      if (isDemoMode) return MOCK_INVENTORY;
      const res = await fetch("/api/inventory");
      if (!res.ok) throw new Error("Failed to fetch inventory");
      return res.json();
    }
  });

  const categories = useMemo(() => {
    if (!inventory) return [];
    const cats = new Set(inventory.map(item => item.category));
    return Array.from(cats);
  }, [inventory]);

  const filteredInventory = useMemo(() => {
    return inventory?.filter(item => {
      const matchesSearch = 
        item.productName.toLowerCase().includes(search.toLowerCase()) ||
        item.skuOrId.toLowerCase().includes(search.toLowerCase());
      
      const matchesCategory = categoryFilter === "all" || item.category === categoryFilter;
      const matchesStatus = statusFilter === "all" || item.availabilityStatus === statusFilter;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [inventory, search, categoryFilter, statusFilter]);

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      if (isDemoMode) {
        toast({ title: "Demo Mode", description: "Write actions are disabled in demo mode." });
        return;
      }
      await apiRequest("DELETE", `/api/inventory/${id}`);
    },
    onSuccess: () => {
      if (!isDemoMode) {
        queryClient.invalidateQueries({ queryKey: ["/api/inventory"] });
        toast({ title: "Item deleted", description: "Inventory item has been removed." });
      }
    },
  });

  const handleEdit = (item: Inventory) => {
    setEditingItem(item);
    setDialogOpen(true);
  };

  const handleAdd = () => {
    setEditingItem(undefined);
    setDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this item?")) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto h-full flex flex-col gap-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div className="space-y-1">
          <h1 className="text-3xl md:text-4xl font-display font-bold tracking-tight">Inventory</h1>
          <p className="text-base text-muted-foreground">Monitor and manage your pharmacy stock levels.</p>
        </div>
        <Button onClick={handleAdd} className="w-full sm:w-auto shadow-xl shadow-primary/20 rounded-xl font-semibold">
          <Plus className="w-5 h-5 mr-2" />
          Add Item
        </Button>
      </div>

      <div className="bg-card rounded-2xl border border-card-border shadow-xl shadow-foreground/5 flex flex-col flex-1 overflow-hidden min-h-[500px]">
        <div className="p-6 border-b border-border bg-muted/5 flex flex-col gap-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <Input 
                placeholder="Search by product name or SKU..." 
                className="pl-12 py-6 bg-background/50 border-border/50 focus:bg-background rounded-xl w-full"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            
            <div className="flex flex-wrap gap-4">
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-[180px] rounded-xl bg-background/50 border-border/50">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map(cat => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px] rounded-xl bg-background/50 border-border/50">
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="in_stock">In Stock</SelectItem>
                  <SelectItem value="low_stock">Low Stock</SelectItem>
                  <SelectItem value="out_of_stock">Out of Stock</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-auto">
          {isLoading ? (
            <div className="h-full flex items-center justify-center p-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : filteredInventory?.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-muted-foreground p-8">
              <Package className="w-12 h-12 opacity-20 mb-4" />
              <p className="font-medium text-lg">No inventory items found</p>
            </div>
          ) : (
            <Table>
              <TableHeader className="bg-muted/30 sticky top-0 z-10 backdrop-blur-sm">
                <TableRow>
                  <TableHead>Product Name</TableHead>
                  <TableHead>SKU / ID</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInventory?.map((item) => {
                  const isLowStock = item.stockQuantity <= LOW_STOCK_THRESHOLD;
                  return (
                    <TableRow 
                      key={item.id} 
                      className={`group hover:bg-muted/30 transition-colors ${isLowStock ? "bg-amber-50/30 dark:bg-amber-900/10" : ""}`}
                    >
                      <TableCell className="font-semibold">
                        <div className="flex items-center gap-2">
                          {item.productName}
                          {isLowStock && (
                            <AlertTriangle className="w-4 h-4 text-amber-500" />
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{item.skuOrId}</TableCell>
                      <TableCell>{item.category}</TableCell>
                      <TableCell>
                        <span className={isLowStock ? "text-amber-600 font-bold" : ""}>
                          {item.stockQuantity}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant="secondary"
                          className={
                            item.availabilityStatus === 'in_stock' 
                              ? "bg-emerald-500/10 text-emerald-600" 
                              : item.availabilityStatus === 'low_stock' || isLowStock
                              ? "bg-amber-500/10 text-amber-600"
                              : "bg-destructive/10 text-destructive"
                          }
                        >
                          {(isLowStock && item.availabilityStatus !== 'out_of_stock') ? "Low Stock (Alert)" : item.availabilityStatus.replace('_', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell>${item.price}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEdit(item)}>
                              <Pencil className="w-4 h-4 mr-2" /> Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="text-destructive"
                              onClick={() => handleDelete(item.id)}
                            >
                              <Trash2 className="w-4 h-4 mr-2" /> Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </div>
      </div>

      <InventoryDialog 
        open={dialogOpen} 
        onOpenChange={setDialogOpen} 
        itemToEdit={editingItem}
      />
    </div>
  );
}

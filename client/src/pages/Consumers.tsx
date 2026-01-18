import { useState } from "react";
import { useConsumers, useDeleteConsumer } from "@/hooks/use-consumers";
import { type InsertConsumer } from "@shared/schema";
import { ConsumerDialog } from "@/components/ConsumerDialog";
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
  Plus, 
  Search, 
  MoreHorizontal, 
  Pencil, 
  Trash2, 
  FileText,
  Loader2
} from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

export default function Consumers() {
  const [search, setSearch] = useState("");
  const { data: consumers, isLoading, error } = useConsumers(search);
  const deleteMutation = useDeleteConsumer();
  const { toast } = useToast();
  
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingConsumer, setEditingConsumer] = useState<(InsertConsumer & { id: number }) | undefined>(undefined);

  const handleEdit = (consumer: any) => {
    setEditingConsumer(consumer);
    setDialogOpen(true);
  };

  const handleAdd = () => {
    setEditingConsumer(undefined);
    setDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this consumer? This action cannot be undone.")) {
      await deleteMutation.mutateAsync(id);
    }
  };

  if (error) {
    return (
      <div className="p-8 text-center text-destructive">
        Error loading consumers: {error.message}
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto h-full flex flex-col">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">Consumers</h1>
          <p className="text-muted-foreground mt-1">Manage patient profiles and medical records.</p>
        </div>
        <Button onClick={handleAdd} className="shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all">
          <Plus className="w-4 h-4 mr-2" />
          Add Consumer
        </Button>
      </div>

      <div className="bg-card rounded-xl border border-border shadow-sm flex flex-col flex-1 overflow-hidden">
        <div className="p-4 border-b border-border flex gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Search by name or email..." 
              className="pl-9 bg-background/50 border-border/50 focus:bg-background transition-colors"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="flex-1 overflow-auto">
          {isLoading ? (
            <div className="h-full flex items-center justify-center text-muted-foreground">
              <Loader2 className="w-8 h-8 animate-spin mb-2" />
            </div>
          ) : consumers?.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-muted-foreground p-8">
              <div className="bg-muted p-4 rounded-full mb-4">
                <Users className="w-8 h-8 opacity-50" />
              </div>
              <p className="font-medium">No consumers found</p>
              <p className="text-sm mt-1">Try adjusting your search or add a new consumer.</p>
            </div>
          ) : (
            <Table>
              <TableHeader className="bg-muted/30 sticky top-0 z-10 backdrop-blur-sm">
                <TableRow>
                  <TableHead className="w-[250px]">Name</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date of Birth</TableHead>
                  <TableHead>Updated</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {consumers?.map((consumer) => (
                  <TableRow key={consumer.id} className="group hover:bg-muted/30 transition-colors">
                    <TableCell className="font-medium">
                      <div className="flex flex-col">
                        <span className="text-foreground font-semibold">
                          {consumer.firstName} {consumer.lastName}
                        </span>
                        <span className="text-xs text-muted-foreground">{consumer.address || "No address"}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col text-sm">
                        <span>{consumer.email}</span>
                        <span className="text-muted-foreground text-xs">{consumer.phoneNumber}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant="secondary" 
                        className={
                          consumer.status === 'active' 
                            ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200" 
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }
                      >
                        {consumer.status || "active"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {consumer.dateOfBirth ? format(new Date(consumer.dateOfBirth), 'MMM d, yyyy') : '-'}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {consumer.updatedAt ? format(new Date(consumer.updatedAt), 'MMM d, yyyy') : '-'}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => handleEdit(consumer)}>
                            <Pencil className="mr-2 h-4 w-4" /> Edit Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleEdit(consumer)}>
                            <FileText className="mr-2 h-4 w-4" /> View Medical History
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="text-destructive focus:text-destructive"
                            onClick={() => handleDelete(consumer.id)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" /> Delete Consumer
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </div>

      <ConsumerDialog 
        open={dialogOpen} 
        onOpenChange={setDialogOpen} 
        consumerToEdit={editingConsumer}
      />
    </div>
  );
}

function Users(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertConsumerSchema } from "@shared/schema";
import { type InsertConsumer } from "@shared/schema";
import { useCreateConsumer, useUpdateConsumer } from "@/hooks/use-consumers";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
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
import { Textarea } from "@/components/ui/textarea";
import { useEffect } from "react";

interface ConsumerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  consumerToEdit?: InsertConsumer & { id: number };
}

export function ConsumerDialog({ open, onOpenChange, consumerToEdit }: ConsumerDialogProps) {
  const createMutation = useCreateConsumer();
  const updateMutation = useUpdateConsumer();
  const isEditing = !!consumerToEdit;

  const form = useForm<InsertConsumer>({
    resolver: zodResolver(insertConsumerSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      address: "",
      dateOfBirth: undefined,
      medicalHistory: "",
      status: "active",
    },
  });

  // Reset form when dialog opens/closes or edit target changes
  useEffect(() => {
    if (open) {
      if (consumerToEdit) {
        form.reset({
          firstName: consumerToEdit.firstName,
          lastName: consumerToEdit.lastName,
          email: consumerToEdit.email,
          phoneNumber: consumerToEdit.phoneNumber || "",
          address: consumerToEdit.address || "",
          dateOfBirth: consumerToEdit.dateOfBirth,
          medicalHistory: consumerToEdit.medicalHistory || "",
          status: consumerToEdit.status || "active",
        });
      } else {
        form.reset({
          firstName: "",
          lastName: "",
          email: "",
          phoneNumber: "",
          address: "",
          dateOfBirth: undefined,
          medicalHistory: "",
          status: "active",
        });
      }
    }
  }, [open, consumerToEdit, form]);

  const onSubmit = async (data: InsertConsumer) => {
    try {
      if (isEditing && consumerToEdit) {
        await updateMutation.mutateAsync({ id: consumerToEdit.id, ...data });
      } else {
        await createMutation.mutateAsync(data);
      }
      onOpenChange(false);
    } catch (error) {
      // Error is handled by mutation hook
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Consumer" : "Add New Consumer"}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update the consumer's medical profile and contact information."
              : "Create a new consumer profile in the MediOps system."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pt-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Jane" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="jane@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input type="tel" placeholder="(555) 000-0000" {...field} value={field.value || ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="dateOfBirth"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date of Birth</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} value={field.value ? new Date(field.value).toISOString().split('T')[0] : ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Input placeholder="123 Main St, City, State" {...field} value={field.value || ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="medicalHistory"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Medical History & Notes</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Enter relevant medical history, allergies, or current prescriptions..." 
                      className="min-h-[100px]"
                      {...field} 
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-3 pt-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isPending} className="bg-primary hover:bg-primary/90">
                {isPending ? "Saving..." : isEditing ? "Update Consumer" : "Create Consumer"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

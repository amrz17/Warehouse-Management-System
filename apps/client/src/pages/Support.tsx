import DahsboardLayout from "@/layout/DashboardLayout";
import { DataTable } from "@/components/data-table";
import { columnsSupport } from "@/components/columns-support";
import { supportService } from "@/services/support";
import type { SupportTicket } from "@/services/support";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { SupportForm } from "@/components/support-form";
import { PlusCircle, Loader2 } from "lucide-react";
import { useState, useEffect, useCallback } from "react";

export default function Support() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const fetchTickets = useCallback(async () => {
    setIsLoading(true);
    setIsError(false);
    try {
      const data = await supportService.getTickets();
      setTickets(data);
    } catch (error) {
      console.error("Failed to fetch tickets:", error);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  return (
    <DahsboardLayout>
      <div className="flex flex-1 flex-col p-4 md:p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Support Tickets</h1>
            <p className="text-muted-foreground">
              Submit and manage your support requests.
            </p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                New Ticket
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Submit Support Ticket</DialogTitle>
              </DialogHeader>
              <SupportForm onSuccess={() => {
                setIsDialogOpen(false);
                fetchTickets();
              }} />
            </DialogContent>
          </Dialog>
        </div>

        <div className="bg-background rounded-lg border shadow-sm">
          {isLoading ? (
            <div className="flex h-64 items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : isError ? (
            <div className="flex h-64 items-center justify-center text-destructive">
              Failed to load support tickets. Please try again later.
            </div>
          ) : (
            <DataTable columns={columnsSupport(fetchTickets)} data={tickets} />
          )}
        </div>
      </div>
    </DahsboardLayout>
  );
}
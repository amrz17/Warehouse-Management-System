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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FAQSection } from "@/components/faq-section";
import { PlusCircle, Loader2, LifeBuoy, HelpCircle } from "lucide-react";
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
        <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0 mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Help & Support</h1>
            <p className="text-muted-foreground">
              Find answers to common questions or manage your support requests.
            </p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="shadow-sm">
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

        <Tabs defaultValue="tickets" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
            <TabsTrigger value="tickets" className="flex items-center gap-2">
              <LifeBuoy className="h-4 w-4" />
              My Tickets
            </TabsTrigger>
            <TabsTrigger value="faq" className="flex items-center gap-2">
              <HelpCircle className="h-4 w-4" />
              FAQ
            </TabsTrigger>
          </TabsList>

          <TabsContent value="tickets" className="space-y-4">
            <div className="bg-background rounded-xl border shadow-sm overflow-hidden">
              {isLoading ? (
                <div className="flex h-64 items-center justify-center">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : isError ? (
                <div className="flex h-64 items-center justify-center text-destructive p-4 text-center">
                  Failed to load support tickets. Please try again later.
                </div>
              ) : (
                <DataTable columns={columnsSupport(fetchTickets)} data={tickets} />
              )}
            </div>
          </TabsContent>

          <TabsContent value="faq">
            <div className="max-w-4xl mx-auto">
              <FAQSection />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DahsboardLayout>
  );
}

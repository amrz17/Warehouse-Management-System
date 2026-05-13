import { useState } from "react";
import { ChevronDown, HelpCircle, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

const faqs = [
  {
    question: "How do I track my inventory in real-time?",
    answer: "You can track your inventory in real-time by navigating to the Inventory page. The system automatically updates stock levels as inbound and outbound transactions are processed. You can also set up low-stock alerts in the Settings module.",
  },
  {
    question: "How do I create a new purchase order?",
    answer: "Go to the Purchase page and click on the 'New Order' button. Fill in the supplier details, item list, and expected delivery date. Once saved, you can track the status of the order until it is received at the warehouse.",
  },
  {
    question: "What is the difference between Inbound and Outbound?",
    answer: "Inbound refers to products coming into the warehouse (e.g., from suppliers or returns). Outbound refers to products leaving the warehouse (e.g., shipments to customers or transfers to other locations).",
  },
  {
    question: "How can I generate a monthly stock report?",
    answer: "Navigate to the Report page, select the 'Stock Level' report type, and choose the desired date range. You can export the report as a PDF or CSV file for further analysis.",
  },
  {
    question: "Can I manage different user permissions?",
    answer: "Yes, administrators can manage user roles and permissions in the Settings module under the 'Users' tab. You can assign roles such as Admin, Manager, or Staff, each with different levels of access.",
  },
  {
    question: "What should I do if I find a discrepancy in stock count?",
    answer: "If you notice a stock discrepancy, you should perform a manual audit and update the inventory records using the 'Adjust Stock' feature in the Inventory page. It is recommended to leave a comment explaining the reason for the adjustment.",
  },
];

export function FAQSection() {
  const [searchTerm, setSearchTerm] = useState("");
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const filteredFaqs = faqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search FAQs..."
          className="pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid gap-4">
        {filteredFaqs.length > 0 ? (
          filteredFaqs.map((faq, index) => (
            <div
              key={index}
              className={cn(
                "group rounded-xl border bg-card transition-all duration-200 hover:shadow-md",
                openIndex === index && "border-primary/50 ring-1 ring-primary/20"
              )}
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="flex w-full items-center justify-between p-4 text-left sm:p-5"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                    <HelpCircle className="h-4 w-4" />
                  </div>
                  <span className="font-semibold">{faq.question}</span>
                </div>
                <ChevronDown
                  className={cn(
                    "h-5 w-5 text-muted-foreground transition-transform duration-200",
                    openIndex === index && "rotate-180 text-primary"
                  )}
                />
              </button>
              <div
                className={cn(
                  "grid transition-all duration-200 ease-in-out",
                  openIndex === index
                    ? "grid-rows-[1fr] opacity-100"
                    : "grid-rows-[0fr] opacity-0"
                )}
              >
                <div className="overflow-hidden">
                  <div className="border-t p-4 pt-0 text-muted-foreground sm:p-5 sm:pt-0">
                    <p className="mt-4 leading-relaxed">{faq.answer}</p>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center animate-in fade-in zoom-in duration-300">
            <div className="rounded-2xl bg-muted p-4 shadow-inner">
              <HelpCircle className="h-8 w-8 text-muted-foreground/50" />
            </div>
            <h3 className="mt-6 text-xl font-bold tracking-tight">No matching FAQs found</h3>
            <p className="mt-2 text-muted-foreground max-w-[300px]">
              We couldn't find an answer for that. Try a different search or reach out to us.
            </p>
            <button 
              onClick={() => {
                // This could trigger the tab switch back to tickets or open the dialog
                const tabList = document.querySelector('[role="tablist"]');
                const ticketsTab = tabList?.querySelector('[value="tickets"]') as HTMLElement;
                ticketsTab?.click();
              }}
              className="mt-6 inline-flex h-10 items-center justify-center rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              Submit a Ticket
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

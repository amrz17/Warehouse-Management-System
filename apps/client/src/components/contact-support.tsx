import { Mail, Phone, Clock, MessageSquare, MapPin, Home } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const contactMethods = [
  {
    title: "Email Support",
    description: "We typically respond within 24 hours.",
    value: "lumbungdigital@solution.tech",
    icon: Mail,
    action: "Send Email",
    href: "mailto:lumbungdigital@solution.tech",
    color: "text-blue-500",
    bg: "bg-blue-500/10",
  },
  {
    title: "Phone Support",
    description: "Speak directly with our technical support team.",
    value: "+6285882013510",
    icon: Phone,
    action: "Call Now",
    href: "tel:+6285882013510",
    color: "text-green-500",
    bg: "bg-green-500/10",
  },
  {
    title: "Live Chat",
    description: "Instant assistance for urgent warehouse issues.",
    value: "Available now",
    icon: MessageSquare,
    action: "Start Chat",
    href: "#",
    color: "text-purple-500",
    bg: "bg-purple-500/10",
  },
  {
    title: "Office Address",
    description: "Our headquarters for physical correspondence.",
    value: "Karawang, Indonesia",
    icon: Home,
    action: "View Map",
    href: "https://maps.google.com",
    color: "text-orange-500",
    bg: "bg-orange-500/10",
  },
];

export function ContactSupport() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid gap-6 md:grid-cols-2">
        {contactMethods.map((method, index) => (
          <Card
            key={index}
            className="group transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
          >
            <CardHeader className="flex flex-row items-center gap-4 pb-2">
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-xl ${method.bg} ${method.color} transition-colors group-hover:bg-opacity-20`}
              >
                <method.icon className="h-6 w-6" />
              </div>

              <div className="space-y-1">
                <CardTitle className="text-xl">
                  {method.title}
                </CardTitle>

                <CardDescription>
                  {method.description}
                </CardDescription>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="text-lg font-semibold tracking-tight text-foreground/90">
                {method.value}
              </div>

              <Button
                variant="outline"
                className="w-full transition-all duration-300 group-hover:bg-primary group-hover:text-primary-foreground"
                asChild
              >
                <a
                  href={method.href}
                  target={method.href.startsWith("http") ? "_blank" : undefined}
                  rel="noopener noreferrer"
                >
                  {method.action}
                </a>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-dashed bg-muted/50">
        <CardContent className="flex flex-col items-center justify-between gap-6 p-6 md:flex-row">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-background shadow-sm">
              <Clock className="h-6 w-6 text-primary" />
            </div>

            <div>
              <h4 className="font-bold">
                Standard Support Hours
              </h4>

              <p className="text-sm text-muted-foreground">
                We are here to help during standard business hours.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-x-8 gap-y-2 text-sm md:grid-cols-2">
            <div className="flex justify-between gap-4">
              <span className="font-medium">
                Monday - Friday
              </span>

              <span className="text-right text-muted-foreground">
                9:00 AM - 5:00 PM WIB
              </span>
            </div>

            <div className="flex justify-between gap-4">
              <span className="font-medium">
                Saturday
              </span>

              <span className="text-right text-muted-foreground">
                10:00 AM - 2:00 PM EST
              </span>
            </div>

            <div className="flex justify-between gap-4">
              <span className="font-medium">
                Sunday
              </span>

              <span className="text-right text-muted-foreground">
                Closed
              </span>
            </div>

            <div className="flex justify-between gap-4">
              <span className="font-medium">
                Public Holidays
              </span>

              <span className="text-right text-muted-foreground">
                Emergency Only
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
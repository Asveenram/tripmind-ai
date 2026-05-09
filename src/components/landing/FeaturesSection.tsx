import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BrainCircuit, FileOutput, LayoutDashboard, MessageSquare } from "lucide-react";

const features = [
  {
    title: "Conversational AI Planner",
    description: "Chat naturally with our AI to build personalized itineraries based on budget, preferences, and travel style.",
    icon: MessageSquare,
  },
  {
    title: "Smart Itinerary Engine",
    description: "Generate day-by-day plans with curated hotels, attractions, and food recommendations in seconds.",
    icon: BrainCircuit,
  },
  {
    title: "Beautiful PDF Exports",
    description: "Export stunning, agency-branded PDF itineraries ready to be sent to your clients immediately.",
    icon: FileOutput,
  },
  {
    title: "Visual CRM Dashboard",
    description: "Track all inquiries in a modern Kanban pipeline. Move leads from 'New' to 'Booked' effortlessly.",
    icon: LayoutDashboard,
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="py-24 bg-slate-50 dark:bg-slate-900/50">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Everything you need to scale</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            TripMind AI combines powerful generative AI with a robust travel CRM to help you close more bookings faster.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, i) => (
            <Card key={i} className="border-none shadow-md hover:shadow-xl transition-all duration-300 bg-white dark:bg-slate-950">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 text-primary">
                  <feature.icon className="w-6 h-6" />
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

"use client";

import { useState, useRef, useEffect } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Send, Bot, User, Sparkles, MapPin, Calendar, Users, Wallet, Loader2, Download, Save, CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { exportItineraryToPDF } from "@/lib/exportPdf";
import { formatTime } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { toast, Toaster } from "sonner";

type Message = { role: "user" | "assistant"; content: string };

export default function PlannerPage() {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Hello! I'm your AI Travel Consultant. Where would you like to go on your next adventure?" }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [itinerary, setItinerary] = useState<any>(null);
  const [requirements, setRequirements] = useState<any>(null);
  
  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, itinerary]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = { role: "user" as const, content: input };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });
      
      const data = await res.json();
      const aiResponse = data.message.content;

      if (aiResponse.includes("READY_TO_GENERATE:")) {
        const jsonStr = aiResponse.split("READY_TO_GENERATE:")[1].trim();
        const reqs = JSON.parse(jsonStr);
        setRequirements(reqs);
        setMessages((prev) => [...prev, { role: "assistant", content: "Perfect! Give me a moment to craft your luxurious itinerary..." }]);
        setIsLoading(false);
        await generateItinerary(reqs);
      } else {
        setMessages((prev) => [...prev, { role: "assistant", content: aiResponse }]);
        setIsLoading(false);
      }
    } catch (error) {
      console.error(error);
      setMessages((prev) => [...prev, { role: "assistant", content: "Sorry, I ran into an issue. Please try again." }]);
      setIsLoading(false);
    }
  };

  const generateItinerary = async (reqs: any) => {
    setIsGenerating(true);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requirements: reqs }),
      });
      const data = await res.json();
      setItinerary(data.itinerary);
    } catch (error) {
      console.error(error);
      setMessages((prev) => [...prev, { role: "assistant", content: "Failed to generate itinerary. Please try again later." }]);
    }
    setIsGenerating(false);
  };

  const handleSaveLead = async () => {
    if (!itinerary || !requirements || isSaving || isSaved) return;
    
    console.log("Starting lead save process...");
    console.log("Current requirements:", requirements);
    console.log("Current itinerary:", itinerary);

    setIsSaving(true);
    try {
      const payload = {
        customerName: "Anonymous User",
        destination: requirements.destination,
        budget: requirements.budget,
        travelers: requirements.travelers,
        tripDays: requirements.days ? parseInt(requirements.days) : null,
        // STEP 3: Send preferences as-is, the API will now normalize it
        preferences: requirements.preferences,
        itinerary: itinerary,
        aiSummary: itinerary.summary,
      };

      console.log("Sending payload to /api/leads:", JSON.stringify(payload, null, 2));

      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      
      const data = await res.json();
      console.log("Response from /api/leads:", data);

      if (res.ok) {
        toast.success("Lead saved to CRM successfully!");
        setIsSaved(true);
        router.refresh(); 
      } else {
        console.error("Failed to save lead:", data.error || data.message);
        toast.error(`Failed to save lead: ${data.message || "Unknown error"}`);
      }
    } catch (error: any) {
      console.error("Network or parsing error during lead save:", error);
      toast.error("A network error occurred. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950">
      <Toaster position="top-center" richColors />
      <Navbar />
      <main className="flex-1 pt-24 pb-12 container max-w-4xl px-4 flex flex-col">
        {!itinerary ? (
          <div className="flex-1 flex flex-col bg-white dark:bg-slate-900 rounded-2xl shadow-xl border overflow-hidden">
            <div className="p-4 border-b bg-muted/30 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h2 className="font-semibold text-lg">AI Travel Assistant</h2>
                <p className="text-xs text-muted-foreground">Always active and ready to plan</p>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-6">
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div className={`flex gap-3 max-w-[80%] ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                    <div className={`w-8 h-8 shrink-0 rounded-full flex items-center justify-center ${msg.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                      {msg.role === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                    </div>
                    <div className={`p-4 rounded-2xl ${msg.role === "user" ? "bg-primary text-primary-foreground rounded-tr-sm" : "bg-muted rounded-tl-sm"}`}>
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
              {(isLoading || isGenerating) && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3 max-w-[80%]">
                  <div className="w-8 h-8 shrink-0 rounded-full bg-muted text-muted-foreground flex items-center justify-center">
                    <Bot className="h-4 w-4" />
                  </div>
                  <div className="p-4 rounded-2xl bg-muted rounded-tl-sm flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">{isGenerating ? "Crafting itinerary..." : "Thinking..."}</p>
                  </div>
                </motion.div>
              )}
              <div ref={endOfMessagesRef} />
            </div>

            <div className="p-4 bg-white dark:bg-slate-900 border-t">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
                className="flex gap-2"
              >
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type your response..."
                  className="flex-1 rounded-full h-12 px-6 bg-muted/50 border-transparent focus-visible:ring-primary/20"
                  disabled={isLoading || isGenerating}
                />
                <Button type="submit" disabled={!input.trim() || isLoading || isGenerating} className="rounded-full w-12 h-12 p-0 shrink-0 shadow-md">
                  <Send className="h-5 w-5" />
                </Button>
              </form>
            </div>
          </div>
        ) : (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-8">
            {/* Cinematic Hero Header */}
            <div className="relative w-full h-[40vh] min-h-[300px] max-h-[500px] rounded-3xl overflow-hidden mb-8 shadow-2xl">
              <div className="absolute inset-0 bg-black/20 z-10"></div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent z-10"></div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src={`https://image.pollinations.ai/prompt/cinematic%20luxury%20travel%20photography%20of%20${encodeURIComponent(itinerary.imageKeyword || itinerary.title)}?width=1600&height=900&nologo=true`}
                alt={itinerary.title}
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 z-20 text-white">
                <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4 drop-shadow-md leading-tight">{itinerary.title}</h1>
                <p className="text-base md:text-xl text-white/90 max-w-3xl drop-shadow-md leading-relaxed">{itinerary.summary}</p>
              </div>
            </div>

            {/* Actions Bar */}
            <div className="flex flex-col md:flex-row justify-end items-center gap-4 mb-10">
              <div className="flex gap-3 w-full md:w-auto">
                <Button variant="default" className="gap-2 w-full md:w-auto shadow-md" onClick={handleSaveLead} disabled={isSaving || isSaved}>
                  {isSaved ? <CheckCircle className="h-4 w-4 text-green-500" /> : <Save className="h-4 w-4" />} 
                  {isSaved ? "Saved" : isSaving ? "Saving..." : "Save Lead"}
                </Button>
                <Button variant="outline" className="gap-2 w-full md:w-auto shadow-sm bg-white dark:bg-slate-900" onClick={() => exportItineraryToPDF(itinerary, "Client")}>
                  <Download className="h-4 w-4" /> Export PDF
                </Button>
              </div>
            </div>

            {/* Premium Trip Summary */}
            {itinerary.tripSummary && (
              <div className="mb-14">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" /> Trip Overview
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  <Card className="bg-white dark:bg-slate-900 border-border/50 shadow-sm hover:shadow-md transition-all">
                    <CardContent className="p-5 flex flex-col items-center justify-center text-center h-full">
                      <Calendar className="h-6 w-6 text-primary mb-3 opacity-80" />
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Best Time</p>
                      <p className="font-medium text-sm leading-tight">{itinerary.tripSummary.bestTimeToVisit}</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-white dark:bg-slate-900 border-border/50 shadow-sm hover:shadow-md transition-all">
                    <CardContent className="p-5 flex flex-col items-center justify-center text-center h-full">
                      <Sparkles className="h-6 w-6 text-primary mb-3 opacity-80" />
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Weather</p>
                      <p className="font-medium text-sm leading-tight">{itinerary.tripSummary.expectedWeather}</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-white dark:bg-slate-900 border-border/50 shadow-sm hover:shadow-md transition-all">
                    <CardContent className="p-5 flex flex-col items-center justify-center text-center h-full">
                      <MapPin className="h-6 w-6 text-primary mb-3 opacity-80" />
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Style</p>
                      <p className="font-medium text-sm leading-tight">{itinerary.tripSummary.travelStyle}</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-white dark:bg-slate-900 border-border/50 shadow-sm hover:shadow-md transition-all">
                    <CardContent className="p-5 flex flex-col items-center justify-center text-center h-full">
                      <Wallet className="h-6 w-6 text-primary mb-3 opacity-80" />
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Budget</p>
                      <p className="font-medium text-sm leading-tight">{itinerary.tripSummary.budgetLevel}</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-white dark:bg-slate-900 border-border/50 shadow-sm hover:shadow-md transition-all">
                    <CardContent className="p-5 flex flex-col items-center justify-center text-center h-full">
                      <Users className="h-6 w-6 text-primary mb-3 opacity-80" />
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Group</p>
                      <p className="font-medium text-sm leading-tight">{itinerary.tripSummary.groupType}</p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            <div className="space-y-8 relative before:absolute before:inset-0 before:ml-4 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-px before:bg-gradient-to-b before:from-transparent before:via-border before:to-transparent">
              {itinerary.days.map((day: any, idx: number) => (
                <div key={idx} className="relative flex justify-between md:justify-normal md:odd:flex-row-reverse group">
                  {/* Timeline Node */}
                  <div className="flex items-center justify-center w-8 h-8 rounded-full border-[3px] border-background bg-primary text-primary-foreground text-xs font-bold shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm relative z-10 mt-6">
                    {day.day}
                  </div>
                  
                  {/* Card */}
                  <Card className="w-[calc(100%-3rem)] md:w-[calc(50%-2rem)] hover:shadow-md transition-all border-border/50 shadow-sm relative group-hover:border-primary/30 bg-card/50 backdrop-blur-sm">
                    <CardContent className="p-5 md:p-6">
                      <div className="flex items-center gap-3 mb-5">
                        <div className="h-2 w-2 rounded-full bg-primary/80"></div>
                        <h3 className="font-bold text-lg text-foreground">{day.theme}</h3>
                      </div>
                      <div className="space-y-5">
                        <div>
                          <h4 className="text-xs font-bold uppercase text-muted-foreground mb-3 tracking-wider flex items-center gap-2">
                            <Calendar className="w-3 h-3" /> Activities
                          </h4>
                          <ul className="space-y-3">
                            {day.activities?.map((act: any, i: number) => (
                              <li key={i} className="text-sm flex gap-3 leading-relaxed">
                                <span className="font-semibold min-w-[65px] text-primary/90 bg-primary/10 px-2 py-0.5 rounded text-center h-fit text-xs mt-0.5">{formatTime(act.time)}</span>
                                <span className="text-muted-foreground">{act.description}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        {day.food && day.food.length > 0 && (
                          <div className="pt-4 border-t border-border/40">
                            <h4 className="text-xs font-bold uppercase text-muted-foreground mb-3 tracking-wider flex items-center gap-2">
                              <MapPin className="w-3 h-3" /> Dining
                            </h4>
                            <ul className="space-y-2">
                              {day.food.map((f: any, i: number) => (
                                <li key={i} className="text-sm flex items-start gap-2">
                                  <span className="font-medium text-amber-600 dark:text-amber-500 min-w-[70px]">{f.meal}</span>
                                  <span className="text-muted-foreground">{f.place}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>

          </motion.div>
        )}
      </main>
    </div>
  );
}

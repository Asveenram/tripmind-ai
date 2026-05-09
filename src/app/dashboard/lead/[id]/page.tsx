import { Navbar } from "@/components/layout/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { MapPin, Calendar, Users, Wallet, ArrowLeft, Mail, Clock, Sparkles } from "lucide-react";
import Link from "next/link";
import { exportItineraryToPDF } from "@/lib/exportPdf";
import { formatTime } from "@/lib/utils";
import { LeadActions } from "@/components/dashboard/LeadActions";

export const revalidate = 0;

export default async function LeadDetailPage({ params }: { params: { id: string } }) {
  const { data: lead, error } = await supabase
    .from('travel_leads')
    .select('*')
    .eq('id', params.id)
    .single();

  if (error || !lead) {
    return (
      <div className="min-h-screen flex items-center justify-center flex-col gap-4">
        <h2>Lead not found</h2>
        <Link href="/dashboard"><Button variant="outline">Back to Dashboard</Button></Link>
      </div>
    );
  }

  const itinerary = lead.itinerary;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950">
      <Navbar />
      <main className="flex-1 pt-24 pb-12 container max-w-5xl px-4">
        <Link href="/dashboard" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary mb-6 transition-colors">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
        </Link>
        
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold tracking-tight">{lead.customer_name}</h1>
              <Badge>{lead.status}</Badge>
            </div>
            {lead.email && (
              <div className="flex items-center text-muted-foreground">
                <Mail className="h-4 w-4 mr-2" /> {lead.email}
              </div>
            )}
            <div className="flex items-center text-muted-foreground mt-1 text-sm">
              <Clock className="h-4 w-4 mr-2" /> Created on {new Date(lead.created_at).toLocaleDateString()}
            </div>
          </div>
          <LeadActions leadId={params.id} currentStatus={lead.status} leadData={lead} />
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Trip Requirements</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Destination</p>
                    <p className="font-medium">{lead.destination}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Wallet className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Budget</p>
                    <p className="font-medium">{lead.budget}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Users className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Travelers</p>
                    <p className="font-medium">{lead.travelers}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Duration</p>
                    <p className="font-medium">{lead.trip_days ? `${lead.trip_days} Days` : 'Flexible'}</p>
                  </div>
                </div>
                {lead.preferences && lead.preferences.length > 0 && (
                  <div className="pt-4 border-t">
                    <p className="text-sm font-medium text-muted-foreground mb-2">Preferences</p>
                    <div className="flex flex-wrap gap-2">
                      {lead.preferences.map((p: string, i: number) => (
                        <Badge key={i} variant="secondary">{p}</Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {lead.ai_summary && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">AI Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-relaxed text-muted-foreground">{lead.ai_summary}</p>
                </CardContent>
              </Card>
            )}
          </div>

          <div className="md:col-span-2">
            {itinerary ? (
              <div className="space-y-8">
                <div className="relative w-full h-[300px] md:h-[400px] rounded-2xl overflow-hidden shadow-2xl">
                  <img 
                    src={`https://image.pollinations.ai/prompt/cinematic%20luxury%20travel%20photography%20of%20${encodeURIComponent(itinerary.tripSummary?.imageKeyword || itinerary.title)}%20scenic%20landscape%20ultra%20high%20quality?width=1920&height=1080&nologo=true`}
                    alt={itinerary.title}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                  <div className="absolute bottom-0 left-0 p-6 md:p-10 w-full">
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-3 tracking-tight drop-shadow-lg">{itinerary.title}</h2>
                    <p className="text-base md:text-lg text-white/90 max-w-3xl leading-relaxed drop-shadow">{itinerary.summary}</p>
                  </div>
                </div>

                {itinerary.tripSummary && (
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                    <Card className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm border-border/50">
                      <CardContent className="p-4 flex flex-col items-center justify-center text-center h-full">
                        <Calendar className="w-5 h-5 text-primary mb-2 opacity-80" />
                        <span className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase mb-1">Best Time</span>
                        <span className="text-sm font-semibold">{itinerary.tripSummary.bestTime}</span>
                      </CardContent>
                    </Card>
                    <Card className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm border-border/50">
                      <CardContent className="p-4 flex flex-col items-center justify-center text-center h-full">
                        <Sparkles className="w-5 h-5 text-primary mb-2 opacity-80" />
                        <span className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase mb-1">Weather</span>
                        <span className="text-sm font-semibold">{itinerary.tripSummary.weather}</span>
                      </CardContent>
                    </Card>
                    <Card className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm border-border/50 col-span-2 md:col-span-1">
                      <CardContent className="p-4 flex flex-col items-center justify-center text-center h-full">
                        <MapPin className="w-5 h-5 text-primary mb-2 opacity-80" />
                        <span className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase mb-1">Style</span>
                        <span className="text-sm font-semibold">{itinerary.tripSummary.travelStyle}</span>
                      </CardContent>
                    </Card>
                    <Card className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm border-border/50">
                      <CardContent className="p-4 flex flex-col items-center justify-center text-center h-full">
                        <Wallet className="w-5 h-5 text-primary mb-2 opacity-80" />
                        <span className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase mb-1">Budget</span>
                        <span className="text-sm font-semibold">{itinerary.tripSummary.budget}</span>
                      </CardContent>
                    </Card>
                    <Card className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm border-border/50">
                      <CardContent className="p-4 flex flex-col items-center justify-center text-center h-full">
                        <Users className="w-5 h-5 text-primary mb-2 opacity-80" />
                        <span className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase mb-1">Group</span>
                        <span className="text-sm font-semibold">{itinerary.tripSummary.groupType}</span>
                      </CardContent>
                    </Card>
                  </div>
                )}
                
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2 border-b">
                  <CardTitle className="text-xl">Daily Itinerary</CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  
                  <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border before:to-transparent">
                    {itinerary.days?.map((day: any, idx: number) => (
                      <div key={idx} className="relative flex items-start gap-4">
                        <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-background bg-primary text-primary-foreground font-bold shrink-0 shadow-sm relative z-10 mt-0.5">
                          {day.day}
                        </div>
                        <div className="flex-1 pb-6">
                          <h4 className="font-bold text-lg mb-3 text-primary">{day.theme}</h4>
                          <div className="space-y-3 bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border">
                            {day.activities?.map((act: any, i: number) => (
                              <div key={i} className="text-sm flex gap-3">
                                <span className="font-medium min-w-16 text-slate-500">{formatTime(act.time)}</span>
                                <span>{act.description}</span>
                              </div>
                            ))}
                            {day.food && day.food.length > 0 && (
                              <div className="pt-3 mt-3 border-t border-border/50">
                                <p className="text-xs font-semibold uppercase text-muted-foreground mb-2">Dining</p>
                                {day.food.map((f: any, i: number) => (
                                  <div key={i} className="text-sm mb-1">
                                    <span className="font-medium text-amber-600 dark:text-amber-400">{f.meal}</span>: {f.place}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              </div>
            ) : (
              <Card className="h-full flex flex-col items-center justify-center p-12 text-center">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                  <MapPin className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-bold mb-2">No Itinerary Generated</h3>
                <p className="text-muted-foreground">This lead was added without a complete AI itinerary.</p>
                <Button className="mt-6" variant="outline">Generate Now</Button>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

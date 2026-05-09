"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Loader2, 
  ChevronDown, 
  CheckCircle,
  Settings2,
  Download
} from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { exportItineraryToPDF } from "@/lib/exportPdf";

const STATUS_OPTIONS = [
  "New Inquiry",
  "Contacted",
  "Planning",
  "Proposal Sent",
  "Booked",
  "Closed"
];

export function LeadActions({ leadId, currentStatus, leadData }: { leadId: string, currentStatus: string, leadData: any }) {
  const [status, setStatus] = useState(currentStatus);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const router = useRouter();

  const updateStatus = async (newStatus: string) => {
    if (newStatus === status) {
      setIsStatusOpen(false);
      return;
    }
    
    setIsUpdating(true);
    try {
      const res = await fetch(`/api/leads/${leadId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) throw new Error("Failed to update status");
      
      setStatus(newStatus);
      toast.success(`Status updated to ${newStatus}`, {
        icon: <CheckCircle className="h-4 w-4 text-green-500" />
      });
      setIsStatusOpen(false);
      router.refresh();
    } catch (error) {
      console.error("Status update error:", error);
      toast.error("Failed to update status");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="flex gap-3 relative">
      <Button 
        variant="outline" 
        className="gap-2 h-11 rounded-xl px-6 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all font-medium"
        onClick={() => exportItineraryToPDF(leadData.itinerary, leadData.customer_name)}
      >
        <Download className="h-4 w-4" /> Export PDF
      </Button>

      <div className="relative">
        <Button 
          variant="default" 
          className="gap-2 shadow-lg shadow-primary/20 min-w-[160px] h-11 rounded-xl font-semibold" 
          disabled={isUpdating}
          onClick={() => setIsStatusOpen(!isStatusOpen)}
        >
          {isUpdating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Settings2 className="h-4 w-4" />}
          {status}
          <ChevronDown className={`h-4 w-4 ml-1 transition-transform duration-200 ${isStatusOpen ? 'rotate-180' : ''}`} />
        </Button>

        <AnimatePresence>
          {isStatusOpen && (
            <>
              <div 
                className="fixed inset-0 z-40" 
                onClick={() => setIsStatusOpen(false)}
              />
              <motion.div 
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute right-0 mt-3 w-56 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl z-50 py-2 overflow-hidden backdrop-blur-xl"
              >
                <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800 mb-1">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Update Pipeline Status</p>
                </div>
                {STATUS_OPTIONS.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => updateStatus(opt)}
                    className={`w-full text-left px-4 py-2.5 text-sm hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center justify-between ${
                      status === opt ? "bg-primary/5 text-primary font-semibold" : "text-slate-600 dark:text-slate-400"
                    }`}
                  >
                    {opt}
                    {status === opt && <CheckCircle className="h-3.5 w-3.5" />}
                  </button>
                ))}
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

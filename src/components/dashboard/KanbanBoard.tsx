"use client";

import { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, DollarSign, MapPin, Users } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

const COLUMNS = [
  { id: "New Inquiry", title: "New Inquiry" },
  { id: "Contacted", title: "Contacted" },
  { id: "Planning", title: "Planning" },
  { id: "Proposal Sent", title: "Proposal Sent" },
  { id: "Booked", title: "Booked" },
  { id: "Closed", title: "Closed" },
];

export function KanbanBoard({ initialLeads }: { initialLeads: any[] }) {
  const [columns, setColumns] = useState<Record<string, any[]>>({});
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // Group leads by status
    const initialCols: Record<string, any[]> = {};
    COLUMNS.forEach(col => {
      initialCols[col.id] = initialLeads.filter(lead => lead.status === col.id);
    });
    setColumns(initialCols);
    setIsMounted(true);
  }, [initialLeads]);

  const onDragEnd = async (result: DropResult) => {
    const { source, destination, draggableId } = result;

    if (!destination) return;
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;

    const sourceCol = [...columns[source.droppableId]];
    const destCol = [...columns[destination.droppableId]];
    const [movedLead] = sourceCol.splice(source.index, 1);
    
    movedLead.status = destination.droppableId;
    destCol.splice(destination.index, 0, movedLead);

    setColumns(prev => ({
      ...prev,
      [source.droppableId]: sourceCol,
      [destination.droppableId]: destCol,
    }));

    // Update status in database
    try {
      const res = await fetch(`/api/leads/${draggableId}`, { 
        method: "PATCH", 
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: destination.droppableId }) 
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to update status");
      }

      toast.success(`Moved to ${destination.droppableId}`);
    } catch (error: any) {
      console.error("Failed to update status in database:", error);
      toast.error(`Failed to move lead: ${error.message}`);
      
      // Rollback UI on failure
      const revertedSourceCol = [...columns[destination.droppableId]];
      const revertedDestCol = [...columns[source.droppableId]];
      const [revertedLead] = revertedSourceCol.splice(destination.index, 1);
      
      revertedLead.status = source.droppableId;
      revertedDestCol.splice(source.index, 0, revertedLead);

      setColumns(prev => ({
        ...prev,
        [destination.droppableId]: revertedSourceCol,
        [source.droppableId]: revertedDestCol,
      }));
    }
  };

  if (!isMounted) return <div className="h-full flex items-center justify-center">Loading board...</div>;

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex gap-6 h-full overflow-x-auto pb-4">
        {COLUMNS.map(col => (
          <div key={col.id} className="w-80 shrink-0 flex flex-col bg-slate-100 dark:bg-slate-900/50 rounded-xl overflow-hidden">
            <div className="p-4 border-b bg-white/50 dark:bg-slate-900 flex justify-between items-center">
              <h3 className="font-semibold">{col.title}</h3>
              <Badge variant="secondary" className="rounded-full">{columns[col.id]?.length || 0}</Badge>
            </div>
            <Droppable droppableId={col.id}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="flex-1 p-4 overflow-y-auto space-y-4"
                >
                  {columns[col.id]?.map((lead, index) => (
                    <Draggable key={lead.id} draggableId={lead.id} index={index}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          style={{
                            ...provided.draggableProps.style,
                            transform: provided.draggableProps.style?.transform,
                          }}
                        >
                          <Link href={`/dashboard/lead/${lead.id}`}>
                            <Card className={`hover:shadow-md transition-shadow cursor-grab active:cursor-grabbing ${snapshot.isDragging ? 'shadow-lg ring-2 ring-primary/20' : ''}`}>
                              <CardContent className="p-4">
                                <h4 className="font-semibold text-base mb-1">{lead.customer_name}</h4>
                                <div className="text-xs text-muted-foreground flex items-center gap-1 mb-3">
                                  <MapPin className="w-3 h-3" /> {lead.destination}
                                </div>
                                <div className="flex justify-between items-center mt-2 pt-2 border-t text-xs text-muted-foreground">
                                  <div className="flex items-center gap-1">
                                    <DollarSign className="w-3 h-3" /> {lead.budget}
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Users className="w-3 h-3" /> {lead.travelers}
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          </Link>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        ))}
      </div>
    </DragDropContext>
  );
}

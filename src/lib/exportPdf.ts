import jsPDF from "jspdf";
import { formatTime } from "./utils";

export const exportItineraryToPDF = (itinerary: any, customerName: string = "Valued Client") => {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const marginX = 25;
  let yOffset = 0;

  // Colors
  const black = "#111111";
  const charcoal = "#444444";
  const gray = "#888888";
  const lightGray = "#E5E5E5";

  // Helper: Add Footer
  const addFooter = (pageNum: number) => {
    doc.setFontSize(8);
    doc.setTextColor(gray);
    doc.setFont("helvetica", "bold");
    doc.text("TRIPMIND AI  •  EXCLUSIVE ITINERARY", marginX, pageHeight - 15);
    doc.setFont("helvetica", "normal");
    doc.text(`PAGE ${pageNum}`, pageWidth - marginX, pageHeight - 15, { align: "right" });
    
    // Footer line
    doc.setDrawColor(lightGray);
    doc.setLineWidth(0.3);
    doc.line(marginX, pageHeight - 20, pageWidth - marginX, pageHeight - 20);
  };

  // --- COVER PAGE ---
  
  // Top Border
  doc.setFillColor(black);
  doc.rect(0, 0, pageWidth, 5, "F");

  yOffset = 60;
  
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(gray);
  doc.text("PREPARED EXCLUSIVELY FOR", marginX, yOffset);
  
  yOffset += 6;
  doc.setFontSize(14);
  doc.setTextColor(black);
  doc.text(customerName.toUpperCase(), marginX, yOffset);

  yOffset += 40;
  
  // Main Title
  doc.setFontSize(36);
  doc.setFont("helvetica", "bold");
  const splitTitle = doc.splitTextToSize(itinerary.title || "Custom Travel Plan", pageWidth - marginX * 2);
  doc.text(splitTitle, marginX, yOffset);
  yOffset += (splitTitle.length * 14) + 10;

  // Divider
  doc.setDrawColor(black);
  doc.setLineWidth(1);
  doc.line(marginX, yOffset, marginX + 40, yOffset);
  yOffset += 15;

  // Summary
  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(charcoal);
  const splitSummary = doc.splitTextToSize(itinerary.summary || "", pageWidth - marginX * 2);
  doc.text(splitSummary, marginX, yOffset);
  yOffset += (splitSummary.length * 6) + 30;

  // Trip Summary Meta Grid
  if (itinerary.tripSummary) {
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(black);
    doc.text("TRIP OVERVIEW", marginX, yOffset);
    yOffset += 8;

    doc.setFont("helvetica", "normal");
    doc.setTextColor(charcoal);
    doc.setFontSize(10);
    
    const ts = itinerary.tripSummary;
    doc.text(`Time: ${ts.bestTimeToVisit || 'N/A'}`, marginX, yOffset);
    doc.text(`Weather: ${ts.expectedWeather || 'N/A'}`, marginX + 60, yOffset);
    yOffset += 8;
    doc.text(`Style: ${ts.travelStyle || 'N/A'}`, marginX, yOffset);
    doc.text(`Budget: ${ts.budgetLevel || itinerary.estimatedCost || 'N/A'}`, marginX + 60, yOffset);
  }

  addFooter(1);

  // --- ITINERARY PAGES ---
  let currentPage = 2;
  doc.addPage();
  yOffset = 30;

  itinerary.days?.forEach((day: any) => {
    // Check page break
    if (yOffset > 240) {
      addFooter(currentPage);
      doc.addPage();
      currentPage++;
      yOffset = 30;
    }

    // Day Header
    doc.setDrawColor(lightGray);
    doc.setLineWidth(0.5);
    doc.line(marginX, yOffset, pageWidth - marginX, yOffset);
    yOffset += 12;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.setTextColor(black);
    doc.text(`DAY ${day.day}`, marginX, yOffset);
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(14);
    doc.setTextColor(charcoal);
    doc.text(`—  ${day.theme}`, marginX + 22, yOffset);
    
    yOffset += 15;

    // Activities
    if (day.activities && day.activities.length > 0) {
      doc.setFontSize(9);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(gray);
      doc.text("ACTIVITIES", marginX, yOffset);
      yOffset += 8;

      day.activities.forEach((act: any) => {
        if (yOffset > 260) {
          addFooter(currentPage);
          doc.addPage();
          currentPage++;
          yOffset = 30;
        }

        doc.setFont("helvetica", "bold");
        doc.setFontSize(10);
        doc.setTextColor(black);
        doc.text(formatTime(act.time), marginX, yOffset);
        
        doc.setFont("helvetica", "normal");
        doc.setTextColor(charcoal);
        const splitAct = doc.splitTextToSize(act.description, pageWidth - marginX - 25);
        doc.text(splitAct, marginX + 25, yOffset);
        
        yOffset += (splitAct.length * 5) + 4;
      });
    }

    // Food
    if (day.food && day.food.length > 0) {
      yOffset += 4;
      if (yOffset > 260) {
        addFooter(currentPage);
        doc.addPage();
        currentPage++;
        yOffset = 30;
      }

      doc.setFontSize(9);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(gray);
      doc.text("DINING", marginX, yOffset);
      yOffset += 8;

      day.food.forEach((f: any) => {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(10);
        doc.setTextColor(black);
        doc.text(f.meal.toUpperCase(), marginX, yOffset);
        
        doc.setFont("helvetica", "normal");
        doc.setTextColor(charcoal);
        const splitFood = doc.splitTextToSize(f.place, pageWidth - marginX - 25);
        doc.text(splitFood, marginX + 25, yOffset);
        
        yOffset += (splitFood.length * 5) + 2;
      });
    }

    yOffset += 15;
  });

  addFooter(currentPage);

  doc.save(`TripMind_Itinerary_${customerName.replace(/\s+/g, "_")}.pdf`);
};

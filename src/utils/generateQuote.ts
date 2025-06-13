import jsPDF from 'jspdf';
import { format } from 'date-fns';

interface QuoteData {
  companyInfo: {
    name: string;
    website: string;
    industry: string;
    size: string;
  };
  contacts: {
    primary: {
      name: string;
      role: string;
      email: string;
      phone: string;
    };
    technical: {
      name: string;
      role: string;
      email: string;
      phone: string;
    };
  };
  selectedServices: Array<{
    id: string;
    name: string;
    basePrice: number;
    customPrice: number;
    description: string;
    included: boolean;
  }>;
}

export function generateQuote(data: QuoteData): void {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  let yPos = 20;

  // Helper function to add text and update y position
  const addText = (text: string, fontSize = 12, isBold = false) => {
    doc.setFontSize(fontSize);
    doc.setFont('helvetica', isBold ? 'bold' : 'normal');
    doc.text(text, 20, yPos);
    yPos += fontSize / 2 + 4;
  };

  // Add header
  doc.setFillColor(66, 82, 110);
  doc.rect(0, 0, pageWidth, 40, 'F');
  doc.setTextColor(255, 255, 255);
  addText('GrayBay IT Services', 24, true);
  addText('Service Quote', 16);
  
  // Reset text color
  doc.setTextColor(0, 0, 0);
  yPos += 10;

  // Add quote details
  addText(`Date: ${format(new Date(), 'MMMM d, yyyy')}`, 10);
  addText(`Quote #: ${Math.floor(Math.random() * 10000)}`, 10);
  yPos += 10;

  // Client Information
  addText('Client Information', 14, true);
  addText(`Company: ${data.companyInfo.name}`, 12);
  addText(`Website: ${data.companyInfo.website}`, 12);
  addText(`Industry: ${data.companyInfo.industry}`, 12);
  addText(`Size: ${data.companyInfo.size}`, 12);
  yPos += 10;

  // Contact Information
  addText('Primary Contact', 14, true);
  addText(`Name: ${data.contacts.primary.name}`, 12);
  addText(`Role: ${data.contacts.primary.role}`, 12);
  addText(`Email: ${data.contacts.primary.email}`, 12);
  addText(`Phone: ${data.contacts.primary.phone}`, 12);
  yPos += 10;

  // Selected Services
  addText('Selected Services', 14, true);
  yPos += 5;

  // Table header
  const columns = ['Service', 'Description', 'Monthly Cost'];
  const columnWidths = [60, 80, 40];
  const startX = 20;
  let currentX = startX;

  doc.setFillColor(240, 240, 240);
  doc.rect(startX, yPos - 5, pageWidth - 40, 10, 'F');
  
  columns.forEach((column, i) => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.text(column, currentX, yPos);
    currentX += columnWidths[i];
  });
  yPos += 15;

  // Table content
  const selectedServices = data.selectedServices.filter(service => service.included);
  selectedServices.forEach((service) => {
    if (yPos > doc.internal.pageSize.getHeight() - 40) {
      doc.addPage();
      yPos = 20;
    }

    currentX = startX;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    
    // Service name
    doc.text(service.name, currentX, yPos);
    currentX += columnWidths[0];
    
    // Description (with word wrap)
    const descriptionLines = doc.splitTextToSize(service.description, columnWidths[1] - 5);
    doc.text(descriptionLines, currentX, yPos);
    currentX += columnWidths[1];
    
    // Price
    doc.text(`$${service.customPrice}/mo`, currentX, yPos);
    
    yPos += Math.max(descriptionLines.length * 12, 15);
  });

  yPos += 10;

  // Total
  const total = selectedServices.reduce((sum, service) => sum + service.customPrice, 0);
  doc.setDrawColor(200, 200, 200);
  doc.line(20, yPos, pageWidth - 20, yPos);
  yPos += 10;
  
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('Total Monthly Cost:', 20, yPos);
  doc.text(`$${total}/mo`, pageWidth - 60, yPos);
  
  yPos += 20;

  // Terms and conditions
  if (yPos > doc.internal.pageSize.getHeight() - 80) {
    doc.addPage();
    yPos = 20;
  }

  addText('Terms and Conditions', 14, true);
  const terms = [
    '1. All prices are in USD and billed monthly.',
    '2. Services can be cancelled with 30 days notice.',
    '3. Quote valid for 30 days from the date of issue.',
    '4. Prices include standard support during business hours.',
    '5. Additional customization may incur extra charges.',
  ];

  terms.forEach(term => {
    addText(term, 10);
  });

  // Save the PDF
  doc.save(`${data.companyInfo.name.replace(/\s+/g, '_')}_quote.pdf`);
} 
'use client';

import { jsPDF } from 'jspdf';
import { Invoice, InvoiceItem } from '@/stores/data.store';

export interface Quotation {
  id: string;
  quotationNumber: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerAddress: string;
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  total: number;
  validUntil: string;
  notes?: string;
  createdAt: string;
}

export interface Receipt {
  id: string;
  receiptNumber: string;
  customerName: string;
  customerEmail: string;
  amount: number;
  paymentMethod: string;
  paymentDate: string;
  reference: string;
  notes?: string;
}

export interface SalesReport {
  id: string;
  reportNumber: string;
  period: string;
  totalSales: number;
  totalRevenue: number;
  totalProfit: number;
  itemsSold: number;
  topProducts: { name: string; quantity: number; revenue: number }[];
  createdAt: string;
}

interface CompanyInfo {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  taxId?: string;
}

const defaultCompanyInfo: CompanyInfo = {
  name: 'LemurSystem',
  email: 'info@lemursystem.com',
  phone: '+1 (555) 123-4567',
  address: '123 Business Street',
  city: 'San Francisco, CA',
  country: 'United States',
};

export const pdfService = {
  generateInvoicePDF(invoice: Invoice, companyInfo: Partial<CompanyInfo> = {}): jsPDF {
    const company = { ...defaultCompanyInfo, ...companyInfo };
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    
    doc.setFillColor(11, 47, 64);
    doc.rect(0, 0, pageWidth, 45, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text('INVOICE', 20, 25);
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(company.name, 20, 33);
    doc.text(company.email, 20, 38);
    
    doc.setFontSize(12);
    doc.text('INVOICE DETAILS', pageWidth - 70, 20);
    doc.setFontSize(10);
    doc.text(`Invoice #: ${invoice.invoiceNumber}`, pageWidth - 70, 28);
    doc.text(`Issue Date: ${new Date(invoice.issueDate).toLocaleDateString()}`, pageWidth - 70, 34);
    doc.text(`Due Date: ${new Date(invoice.dueDate).toLocaleDateString()}`, pageWidth - 70, 40);
    
    doc.setTextColor(0, 0, 0);
    let yPos = 60;
    
    doc.setFillColor(126, 73, 222);
    doc.rect(20, yPos - 5, pageWidth - 40, 10, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('Bill To:', 22, yPos + 2);
    
    doc.setTextColor(0, 0, 0);
    yPos += 15;
    doc.setFont('helvetica', 'bold');
    doc.text(invoice.customerName, 20, yPos);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    yPos += 6;
    doc.text(invoice.customerEmail, 20, yPos);
    
    yPos += 15;
    doc.setFillColor(240, 240, 240);
    doc.rect(20, yPos - 5, pageWidth - 40, 8, 'F');
    doc.setTextColor(100, 100, 100);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    
    const tableStartX = 20;
    const colWidths = [70, 25, 35, 35];
    doc.text('Description', tableStartX + 2, yPos);
    doc.text('Qty', tableStartX + colWidths[0] + 2, yPos);
    doc.text('Unit Price', tableStartX + colWidths[0] + colWidths[1] + 2, yPos);
    doc.text('Total', tableStartX + colWidths[0] + colWidths[1] + colWidths[2] + 2, yPos);
    
    yPos += 10;
    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'normal');
    
    invoice.items.forEach((item) => {
      doc.text(item.description.substring(0, 40), tableStartX + 2, yPos);
      doc.text(item.quantity.toString(), tableStartX + colWidths[0] + 2, yPos);
      doc.text(`$${item.unitPrice.toFixed(2)}`, tableStartX + colWidths[0] + colWidths[1] + 2, yPos);
      doc.text(`$${item.total.toFixed(2)}`, tableStartX + colWidths[0] + colWidths[1] + colWidths[2] + 2, yPos);
      yPos += 8;
    });
    
    yPos += 10;
    doc.setDrawColor(200, 200, 200);
    doc.line(120, yPos - 5, pageWidth - 20, yPos - 5);
    
    doc.setFont('helvetica', 'normal');
    doc.text('Subtotal:', 140, yPos);
    doc.text(`$${invoice.subtotal.toFixed(2)}`, pageWidth - 50, yPos);
    yPos += 8;
    doc.text('Tax:', 140, yPos);
    doc.text(`$${invoice.tax.toFixed(2)}`, pageWidth - 50, yPos);
    yPos += 8;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text('Total:', 140, yPos);
    doc.setTextColor(126, 73, 222);
    doc.text(`$${invoice.total.toFixed(2)}`, pageWidth - 50, yPos);
    
    if (invoice.notes) {
      yPos += 20;
      doc.setTextColor(100, 100, 100);
      doc.setFontSize(9);
      doc.setFont('helvetica', 'italic');
      doc.text('Notes:', 20, yPos);
      doc.text(invoice.notes, 20, yPos + 6);
    }
    
    doc.setTextColor(100, 100, 100);
    doc.setFontSize(8);
    doc.text('Thank you for your business!', pageWidth / 2, 280, { align: 'center' });
    
    return doc;
  },

  generateQuotationPDF(quotation: Quotation, companyInfo: Partial<CompanyInfo> = {}): jsPDF {
    const company = { ...defaultCompanyInfo, ...companyInfo };
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    
    doc.setFillColor(11, 47, 64);
    doc.rect(0, 0, pageWidth, 45, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text('QUOTATION', 20, 25);
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(company.name, 20, 33);
    doc.text(company.email, 20, 38);
    
    doc.setFontSize(12);
    doc.text('QUOTATION DETAILS', pageWidth - 80, 20);
    doc.setFontSize(10);
    doc.text(`Quote #: ${quotation.quotationNumber}`, pageWidth - 80, 28);
    doc.text(`Date: ${new Date(quotation.createdAt).toLocaleDateString()}`, pageWidth - 80, 34);
    doc.text(`Valid Until: ${new Date(quotation.validUntil).toLocaleDateString()}`, pageWidth - 80, 40);
    
    doc.setTextColor(0, 0, 0);
    let yPos = 60;
    
    doc.setFillColor(126, 73, 222);
    doc.rect(20, yPos - 5, pageWidth - 40, 10, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('Quote To:', 22, yPos + 2);
    
    doc.setTextColor(0, 0, 0);
    yPos += 15;
    doc.setFont('helvetica', 'bold');
    doc.text(quotation.customerName, 20, yPos);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    yPos += 6;
    doc.text(quotation.customerEmail, 20, yPos);
    yPos += 5;
    doc.text(quotation.customerAddress, 20, yPos);
    
    yPos += 15;
    doc.setFillColor(240, 240, 240);
    doc.rect(20, yPos - 5, pageWidth - 40, 8, 'F');
    doc.setTextColor(100, 100, 100);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    
    const colWidths = [70, 25, 35, 35];
    doc.text('Description', 22, yPos);
    doc.text('Qty', 22 + colWidths[0], yPos);
    doc.text('Unit Price', 22 + colWidths[0] + colWidths[1], yPos);
    doc.text('Total', 22 + colWidths[0] + colWidths[1] + colWidths[2], yPos);
    
    yPos += 10;
    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'normal');
    
    quotation.items.forEach((item) => {
      doc.text(item.description.substring(0, 40), 22, yPos);
      doc.text(item.quantity.toString(), 22 + colWidths[0], yPos);
      doc.text(`$${item.unitPrice.toFixed(2)}`, 22 + colWidths[0] + colWidths[1], yPos);
      doc.text(`$${item.total.toFixed(2)}`, 22 + colWidths[0] + colWidths[1] + colWidths[2], yPos);
      yPos += 8;
    });
    
    yPos += 10;
    doc.setDrawColor(200, 200, 200);
    doc.line(120, yPos - 5, pageWidth - 20, yPos - 5);
    
    doc.setFont('helvetica', 'normal');
    doc.text('Subtotal:', 140, yPos);
    doc.text(`$${quotation.subtotal.toFixed(2)}`, pageWidth - 50, yPos);
    yPos += 8;
    doc.text('Tax:', 140, yPos);
    doc.text(`$${quotation.tax.toFixed(2)}`, pageWidth - 50, yPos);
    yPos += 8;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text('Total:', 140, yPos);
    doc.setTextColor(126, 73, 222);
    doc.text(`$${quotation.total.toFixed(2)}`, pageWidth - 50, yPos);
    
    if (quotation.notes) {
      yPos += 20;
      doc.setTextColor(100, 100, 100);
      doc.setFontSize(9);
      doc.setFont('helvetica', 'italic');
      doc.text('Notes:', 20, yPos);
      doc.text(quotation.notes, 20, yPos + 6);
    }
    
    doc.setTextColor(100, 100, 100);
    doc.setFontSize(8);
    doc.text('This quotation is valid for 30 days from the date of issue.', pageWidth / 2, 280, { align: 'center' });
    
    return doc;
  },

  generateReceiptPDF(receipt: Receipt, companyInfo: Partial<CompanyInfo> = {}): jsPDF {
    const company = { ...defaultCompanyInfo, ...companyInfo };
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    
    doc.setFillColor(11, 47, 64);
    doc.rect(0, 0, pageWidth, 45, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text('RECEIPT', 20, 25);
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(company.name, 20, 33);
    doc.text(company.email, 20, 38);
    
    doc.setFontSize(12);
    doc.text('RECEIPT DETAILS', pageWidth - 75, 20);
    doc.setFontSize(10);
    doc.text(`Receipt #: ${receipt.receiptNumber}`, pageWidth - 75, 28);
    doc.text(`Date: ${new Date(receipt.paymentDate).toLocaleDateString()}`, pageWidth - 75, 34);
    doc.text(`Reference: ${receipt.reference}`, pageWidth - 75, 40);
    
    doc.setTextColor(0, 0, 0);
    let yPos = 65;
    
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.5);
    doc.rect(20, yPos, pageWidth - 40, 60);
    
    yPos += 15;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('Received From:', 30, yPos);
    doc.setFont('helvetica', 'normal');
    doc.text(receipt.customerName, 80, yPos);
    
    yPos += 12;
    doc.setFont('helvetica', 'bold');
    doc.text('Email:', 30, yPos);
    doc.setFont('helvetica', 'normal');
    doc.text(receipt.customerEmail, 80, yPos);
    
    yPos += 12;
    doc.setFont('helvetica', 'bold');
    doc.text('Payment Method:', 30, yPos);
    doc.setFont('helvetica', 'normal');
    doc.text(receipt.paymentMethod, 80, yPos);
    
    yPos += 30;
    doc.setFillColor(126, 73, 222);
    doc.rect(20, yPos, pageWidth - 40, 30, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('AMOUNT RECEIVED', 30, yPos + 12);
    doc.setFontSize(20);
    doc.text(`$${receipt.amount.toFixed(2)}`, pageWidth - 40, yPos + 18, { align: 'right' });
    
    doc.setTextColor(0, 0, 0);
    yPos += 45;
    
    if (receipt.notes) {
      doc.setFontSize(9);
      doc.setFont('helvetica', 'italic');
      doc.text('Notes:', 20, yPos);
      doc.text(receipt.notes, 20, yPos + 6);
    }
    
    doc.setTextColor(100, 100, 100);
    doc.setFontSize(8);
    doc.text('Thank you for your payment!', pageWidth / 2, 280, { align: 'center' });
    
    return doc;
  },

  generateSalesReportPDF(report: SalesReport, companyInfo: Partial<CompanyInfo> = {}): jsPDF {
    const company = { ...defaultCompanyInfo, ...companyInfo };
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    
    doc.setFillColor(11, 47, 64);
    doc.rect(0, 0, pageWidth, 45, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text('SALES REPORT', 20, 25);
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(company.name, 20, 33);
    doc.text(company.email, 20, 38);
    
    doc.setFontSize(12);
    doc.text('REPORT DETAILS', pageWidth - 75, 20);
    doc.setFontSize(10);
    doc.text(`Report #: ${report.reportNumber}`, pageWidth - 75, 28);
    doc.text(`Period: ${report.period}`, pageWidth - 75, 34);
    doc.text(`Generated: ${new Date(report.createdAt).toLocaleDateString()}`, pageWidth - 75, 40);
    
    doc.setTextColor(0, 0, 0);
    let yPos = 60;
    
    doc.setFillColor(126, 73, 222);
    doc.rect(20, yPos, pageWidth - 40, 50, 'F');
    doc.setTextColor(255, 255, 255);
    
    doc.setFontSize(10);
    doc.text('Total Sales', 30, yPos + 12);
    doc.text(`$${report.totalSales.toLocaleString()}`, pageWidth - 30, yPos + 12, { align: 'right' });
    
    doc.text('Total Revenue', 30, yPos + 26);
    doc.text(`$${report.totalRevenue.toLocaleString()}`, pageWidth - 30, yPos + 26, { align: 'right' });
    
    doc.text('Total Profit', 30, yPos + 40);
    doc.text(`$${report.totalProfit.toLocaleString()}`, pageWidth - 30, yPos + 40, { align: 'right' });
    
    yPos += 65;
    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text('Summary', 20, yPos);
    
    yPos += 10;
    doc.setFillColor(240, 240, 240);
    doc.rect(20, yPos - 5, pageWidth - 40, 8, 'F');
    doc.setTextColor(100, 100, 100);
    doc.setFontSize(9);
    doc.text('Metric', 22, yPos);
    doc.text('Value', pageWidth - 22, yPos, { align: 'right' });
    
    yPos += 10;
    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'normal');
    doc.text('Items Sold', 22, yPos);
    doc.text(report.itemsSold.toString(), pageWidth - 22, yPos, { align: 'right' });
    
    yPos += 15;
    if (report.topProducts.length > 0) {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.text('Top Products', 20, yPos);
      
      yPos += 10;
      doc.setFillColor(240, 240, 240);
      doc.rect(20, yPos - 5, pageWidth - 40, 8, 'F');
      doc.setTextColor(100, 100, 100);
      doc.setFontSize(9);
      doc.text('Product', 22, yPos);
      doc.text('Qty', 100, yPos);
      doc.text('Revenue', pageWidth - 22, yPos, { align: 'right' });
      
      yPos += 10;
      doc.setTextColor(0, 0, 0);
      doc.setFont('helvetica', 'normal');
      
      report.topProducts.forEach((product) => {
        doc.text(product.name.substring(0, 40), 22, yPos);
        doc.text(product.quantity.toString(), 100, yPos);
        doc.text(`$${product.revenue.toLocaleString()}`, pageWidth - 22, yPos, { align: 'right' });
        yPos += 8;
      });
    }
    
    doc.setTextColor(100, 100, 100);
    doc.setFontSize(8);
    doc.text(`Report generated on ${new Date().toLocaleString()}`, pageWidth / 2, 280, { align: 'center' });
    
    return doc;
  },

  downloadPDF(doc: jsPDF, filename: string): void {
    doc.save(filename);
  },

  openPDFInNewTab(doc: jsPDF, filename: string): void {
    const blob = doc.output('blob');
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
  },

  printPDF(doc: jsPDF): void {
    const blob = doc.output('blob');
    const url = URL.createObjectURL(blob);
    const printWindow = window.open(url);
    if (printWindow) {
      printWindow.onload = () => {
        printWindow.print();
      };
    }
  },
};

import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/billing/stats - Get billing statistics
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const clientId = searchParams.get('clientId');

    const where: any = {};
    if (clientId) {
      where.clientId = parseInt(clientId);
    }

    // Get all invoices for calculations
    const invoices = await prisma.invoice.findMany({
      where,
      include: {
        client: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });

    // Get all quotes for calculations
    const quotes = await prisma.quote.findMany({
      where,
      include: {
        client: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });

    // Calculate statistics
    const totalRevenue = invoices
      .filter((inv: any) => inv.status === 'paid')
      .reduce((sum: number, inv: any) => sum + inv.amount, 0);

    const monthlyRecurring = invoices
      .filter((inv: any) => inv.type === 'monthly' && inv.status !== 'cancelled')
      .reduce((sum: number, inv: any) => sum + inv.amount, 0);

    const pendingInvoices = invoices
      .filter((inv: any) => inv.status === 'sent')
      .reduce((sum: number, inv: any) => sum + inv.amount, 0);

    const overdueInvoices = invoices
      .filter((inv: any) => {
        const now = new Date();
        return inv.status === 'sent' && inv.dueDate < now;
      })
      .reduce((sum: number, inv: any) => sum + inv.amount, 0);

    const activeQuotes = quotes.filter((quote: any) => 
      quote.status === 'sent' && quote.validUntil > new Date()
    ).length;

    const acceptedQuotes = quotes.filter((quote: any) => quote.status === 'accepted').length;
    const sentQuotes = quotes.filter((quote: any) => quote.status === 'sent').length;
    const conversionRate = sentQuotes > 0 ? (acceptedQuotes / sentQuotes) * 100 : 0;

    // Get unique client count
    const uniqueClients = clientId ? 1 : new Set([
      ...invoices.map((inv: any) => inv.clientId),
      ...quotes.map((quote: any) => quote.clientId)
    ]).size;

    // Client-specific stats if clientId is provided
    let clientStats = {};
    if (clientId) {
      const clientInvoices = invoices.filter((inv: any) => inv.clientId === parseInt(clientId));
      const clientQuotes = quotes.filter((quote: any) => quote.clientId === parseInt(clientId));

      clientStats = {
        totalPaid: clientInvoices
          .filter((inv: any) => inv.status === 'paid')
          .reduce((sum: number, inv: any) => sum + inv.amount, 0),
        monthlyRecurring: clientInvoices
          .filter((inv: any) => inv.type === 'monthly' && inv.status !== 'cancelled')
          .reduce((sum: number, inv: any) => sum + inv.amount, 0),
        pendingAmount: clientInvoices
          .filter((inv: any) => inv.status === 'sent')
          .reduce((sum: number, inv: any) => sum + inv.amount, 0),
        recentQuotes: clientQuotes
          .sort((a: any, b: any) => b.createdAt.getTime() - a.createdAt.getTime())
          .slice(0, 3)
          .map((quote: any) => ({
            id: quote.quoteNumber,
            amount: quote.total,
            status: quote.status,
            validUntil: quote.validUntil.toISOString().split('T')[0]
          })),
        recentInvoices: clientInvoices
          .sort((a: any, b: any) => b.createdAt.getTime() - a.createdAt.getTime())
          .slice(0, 3)
          .map((invoice: any) => ({
            id: invoice.invoiceNumber,
            invoiceNumber: invoice.invoiceNumber,
            amount: invoice.amount,
            status: invoice.status,
            type: invoice.type,
            dueDate: invoice.dueDate.toISOString().split('T')[0]
          }))
      };
    }

    const stats = {
      totalRevenue,
      monthlyRecurring,
      pendingInvoices,
      overdueInvoices,
      activeQuotes,
      conversionRate: Math.round(conversionRate * 10) / 10,
      totalClients: uniqueClients,
      ...clientStats
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error fetching billing stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch billing stats' },
      { status: 500 }
    );
  }
} 
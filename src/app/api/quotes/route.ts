import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { PRODUCT_CATALOG } from '@/lib/products';

const prisma = new PrismaClient();

type QuoteWithRelations = {
  id: number;
  quoteNumber: string;
  clientId: number;
  title: string;
  description: string | null;
  subtotal: number;
  tax: number;
  taxRate: number;
  total: number;
  status: string;
  validUntil: Date;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
  convertedToInvoiceId: number | null;
  client: {
    id: number;
    name: string;
  };
  items: {
    id: number;
    productId: string;
    description: string | null;
    quantity: number;
    unitPrice: number;
    customPrice: number | null;
    discount: number | null;
    total: number;
    createdAt: Date;
  }[];
};

// GET /api/quotes - Get all quotes with optional filtering
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const clientId = searchParams.get('clientId');
    const status = searchParams.get('status');

    const where: any = {};
    
    if (clientId) {
      where.clientId = parseInt(clientId);
    }
    
    if (status && status !== 'all') {
      where.status = status;
    }

    const quotes = await prisma.quote.findMany({
      where,
      include: {
        client: {
          select: {
            id: true,
            name: true
          }
        },
        items: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    }) as QuoteWithRelations[];

    // Transform the data to match the UI interface
    const transformedQuotes = quotes.map((quote: QuoteWithRelations) => ({
      id: quote.quoteNumber,
      clientId: quote.clientId,
      clientName: quote.client.name,
      amount: quote.total,
      monthlyAmount: quote.items
        .filter((item: any) => {
          const product = PRODUCT_CATALOG.find(p => p.id === item.productId);
          return product?.type === 'recurring';
        })
        .reduce((sum: number, item: any) => sum + item.total, 0),
      status: quote.status,
      validUntil: quote.validUntil.toISOString().split('T')[0],
      createdAt: quote.createdAt.toISOString().split('T')[0],
      title: quote.title,
      description: quote.description,
      subtotal: quote.subtotal,
      tax: quote.tax,
      taxRate: quote.taxRate,
      notes: quote.notes,
      items: quote.items.map((item: any) => ({
        productId: item.productId,
        description: item.description,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        customPrice: item.customPrice,
        discount: item.discount,
        total: item.total
      }))
    }));

    return NextResponse.json(transformedQuotes);
  } catch (error) {
    console.error('Error fetching quotes:', error);
    return NextResponse.json(
      { error: 'Failed to fetch quotes' },
      { status: 500 }
    );
  }
}

// POST /api/quotes - Create a new quote
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      clientId,
      title,
      description,
      items,
      validUntil,
      notes,
      taxRate = 0
    } = body;

    // Generate quote number
    const quoteNumber = `Q-${Date.now().toString().slice(-6)}`;

    // Calculate totals
    let subtotal = 0;
    const processedItems = items.map((item: any) => {
      const product = PRODUCT_CATALOG.find(p => p.id === item.productId);
      const unitPrice = item.customPrice || product?.price || 0;
      const discountAmount = item.discount ? (unitPrice * item.discount / 100) : 0;
      const total = (unitPrice - discountAmount) * item.quantity;
      subtotal += total;

      return {
        productId: item.productId,
        description: item.description || product?.name,
        quantity: item.quantity,
        unitPrice,
        customPrice: item.customPrice,
        discount: item.discount,
        total
      };
    });

    const tax = taxRate ? (subtotal * taxRate / 100) : 0;
    const total = subtotal + tax;

    const quote = await prisma.quote.create({
      data: {
        quoteNumber,
        clientId: parseInt(clientId),
        title,
        description,
        subtotal,
        tax,
        taxRate,
        total,
        status: 'draft',
        validUntil: new Date(validUntil),
        notes,
        items: {
          create: processedItems
        }
      },
      include: {
        client: {
          select: {
            id: true,
            name: true
          }
        },
        items: true
      }
    });

    return NextResponse.json({
      id: quote.quoteNumber,
      clientId: quote.clientId,
      clientName: quote.client.name,
      amount: quote.total,
      status: quote.status,
      validUntil: quote.validUntil.toISOString().split('T')[0],
      createdAt: quote.createdAt.toISOString().split('T')[0]
    });
  } catch (error) {
    console.error('Error creating quote:', error);
    return NextResponse.json(
      { error: 'Failed to create quote' },
      { status: 500 }
    );
  }
} 
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { PRODUCT_CATALOG } from '@/lib/products';

const prisma = new PrismaClient();

type InvoiceWithRelations = {
  id: number;
  invoiceNumber: string;
  clientId: number;
  title: string;
  description: string | null;
  amount: number;
  subtotal: number;
  tax: number;
  taxRate: number;
  status: string;
  type: string;
  issueDate: Date;
  dueDate: Date;
  paidDate: Date | null;
  paymentMethod: string | null;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
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

// GET /api/invoices - Get all invoices with optional filtering
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const clientId = searchParams.get('clientId');
    const status = searchParams.get('status');
    const type = searchParams.get('type');

    const where: any = {};
    
    if (clientId) {
      where.clientId = parseInt(clientId);
    }
    
    if (status && status !== 'all') {
      where.status = status;
    }

    if (type && type !== 'all') {
      where.type = type;
    }

    const invoices = await prisma.invoice.findMany({
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
    }) as InvoiceWithRelations[];

    // Transform the data to match the UI interface
    const transformedInvoices = invoices.map((invoice: InvoiceWithRelations) => ({
      id: invoice.invoiceNumber,
      invoiceNumber: invoice.invoiceNumber,
      clientId: invoice.clientId,
      clientName: invoice.client.name,
      amount: invoice.amount,
      status: invoice.status,
      type: invoice.type,
      dueDate: invoice.dueDate.toISOString().split('T')[0],
      issueDate: invoice.issueDate.toISOString().split('T')[0],
      paidDate: invoice.paidDate?.toISOString().split('T')[0],
      title: invoice.title,
      description: invoice.description,
      subtotal: invoice.subtotal,
      tax: invoice.tax,
      taxRate: invoice.taxRate,
      paymentMethod: invoice.paymentMethod,
      notes: invoice.notes,
      items: invoice.items.map((item: any) => ({
        productId: item.productId,
        description: item.description,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        customPrice: item.customPrice,
        discount: item.discount,
        total: item.total
      }))
    }));

    return NextResponse.json(transformedInvoices);
  } catch (error) {
    console.error('Error fetching invoices:', error);
    return NextResponse.json(
      { error: 'Failed to fetch invoices' },
      { status: 500 }
    );
  }
}

// POST /api/invoices - Create a new invoice
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      clientId,
      title,
      description,
      items,
      type = 'custom',
      dueDate,
      notes,
      taxRate = 0
    } = body;

    // Generate invoice number
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    const invoiceNumber = `INV-${year}${month}-${random}`;

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

    const invoice = await prisma.invoice.create({
      data: {
        invoiceNumber,
        clientId: parseInt(clientId),
        title,
        description,
        amount: total,
        subtotal,
        tax,
        taxRate,
        status: 'draft',
        type,
        issueDate: new Date(),
        dueDate: new Date(dueDate),
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
      id: invoice.invoiceNumber,
      invoiceNumber: invoice.invoiceNumber,
      clientId: invoice.clientId,
      clientName: invoice.client.name,
      amount: invoice.amount,
      status: invoice.status,
      type: invoice.type,
      dueDate: invoice.dueDate.toISOString().split('T')[0],
      issueDate: invoice.issueDate.toISOString().split('T')[0]
    });
  } catch (error) {
    console.error('Error creating invoice:', error);
    return NextResponse.json(
      { error: 'Failed to create invoice' },
      { status: 500 }
    );
  }
} 
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { PRODUCT_CATALOG } from '@/lib/products';

const prisma = new PrismaClient();

// GET /api/quotes/[id] - Get a specific quote
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    const quote = await prisma.quote.findUnique({
      where: { quoteNumber: id },
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

    if (!quote) {
      return NextResponse.json(
        { error: 'Quote not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      id: quote.quoteNumber,
      clientId: quote.clientId,
      clientName: quote.client.name,
      title: quote.title,
      description: quote.description,
      amount: quote.total,
      subtotal: quote.subtotal,
      tax: quote.tax,
      taxRate: quote.taxRate,
      status: quote.status,
      validUntil: quote.validUntil.toISOString().split('T')[0],
      notes: quote.notes,
      createdAt: quote.createdAt.toISOString(),
      items: quote.items.map((item: any) => ({
        productId: item.productId,
        description: item.description,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        customPrice: item.customPrice,
        discount: item.discount,
        total: item.total
      }))
    });
  } catch (error) {
    console.error('Error fetching quote:', error);
    return NextResponse.json(
      { error: 'Failed to fetch quote' },
      { status: 500 }
    );
  }
}

// PUT /api/quotes/[id] - Update a quote
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const {
      title,
      description,
      items,
      validUntil,
      notes,
      taxRate = 0,
      status
    } = body;

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

    // Delete existing items and create new ones
    await prisma.quoteItem.deleteMany({
      where: { quote: { quoteNumber: id } }
    });

    const quote = await prisma.quote.update({
      where: { quoteNumber: id },
      data: {
        title,
        description,
        subtotal,
        tax,
        taxRate,
        total,
        status: status || 'draft',
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
    console.error('Error updating quote:', error);
    return NextResponse.json(
      { error: 'Failed to update quote' },
      { status: 500 }
    );
  }
}

// DELETE /api/quotes/[id] - Delete a quote
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    await prisma.quote.delete({
      where: { quoteNumber: id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting quote:', error);
    return NextResponse.json(
      { error: 'Failed to delete quote' },
      { status: 500 }
    );
  }
} 
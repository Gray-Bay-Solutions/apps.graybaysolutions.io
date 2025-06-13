import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { PRODUCT_CATALOG } from '@/lib/products';

const prisma = new PrismaClient();

// GET /api/invoices/[id] - Get a specific invoice
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    const invoice = await prisma.invoice.findUnique({
      where: { invoiceNumber: id },
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

    if (!invoice) {
      return NextResponse.json(
        { error: 'Invoice not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      id: invoice.invoiceNumber,
      invoiceNumber: invoice.invoiceNumber,
      clientId: invoice.clientId,
      clientName: invoice.client.name,
      title: invoice.title,
      description: invoice.description,
      amount: invoice.amount,
      subtotal: invoice.subtotal,
      tax: invoice.tax,
      taxRate: invoice.taxRate,
      status: invoice.status,
      type: invoice.type,
      issueDate: invoice.issueDate.toISOString().split('T')[0],
      dueDate: invoice.dueDate.toISOString().split('T')[0],
      paidDate: invoice.paidDate?.toISOString().split('T')[0],
      paymentMethod: invoice.paymentMethod,
      notes: invoice.notes,
      createdAt: invoice.createdAt.toISOString(),
      items: invoice.items.map((item: any) => ({
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
    console.error('Error fetching invoice:', error);
    return NextResponse.json(
      { error: 'Failed to fetch invoice' },
      { status: 500 }
    );
  }
}

// PUT /api/invoices/[id] - Update an invoice
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
      dueDate,
      notes,
      taxRate = 0,
      status,
      paymentMethod,
      paidDate
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
    await prisma.invoiceItem.deleteMany({
      where: { invoice: { invoiceNumber: id } }
    });

    const updateData: any = {
      title,
      description,
      amount: total,
      subtotal,
      tax,
      taxRate,
      dueDate: new Date(dueDate),
      notes,
      items: {
        create: processedItems
      }
    };

    if (status) {
      updateData.status = status;
    }

    if (paymentMethod) {
      updateData.paymentMethod = paymentMethod;
    }

    if (paidDate) {
      updateData.paidDate = new Date(paidDate);
    }

    const invoice = await prisma.invoice.update({
      where: { invoiceNumber: id },
      data: updateData,
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
    console.error('Error updating invoice:', error);
    return NextResponse.json(
      { error: 'Failed to update invoice' },
      { status: 500 }
    );
  }
}

// DELETE /api/invoices/[id] - Delete an invoice
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    await prisma.invoice.delete({
      where: { invoiceNumber: id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting invoice:', error);
    return NextResponse.json(
      { error: 'Failed to delete invoice' },
      { status: 500 }
    );
  }
} 
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET /api/tickets
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const priority = searchParams.get('priority');
    const clientId = searchParams.get('clientId');

    const where: any = {};
    if (status) where.status = status;
    if (priority) where.priority = priority;
    if (clientId) where.clientId = parseInt(clientId);

    const tickets = await prisma.ticket.findMany({
      where,
      include: {
        client: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    return NextResponse.json(tickets);
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching tickets' }, { status: 500 });
  }
}

// POST /api/tickets
export async function POST(request: Request) {
  try {
    const json = await request.json();
    const ticket = await prisma.ticket.create({
      data: json,
      include: {
        client: true,
      },
    });

    // Log activity
    await prisma.activity.create({
      data: {
        type: 'ticket',
        description: `New ticket created: ${ticket.title}`,
        user: json.assignee || 'System',
        target: `Ticket #${ticket.id}`,
        status: 'success',
      },
    });

    return NextResponse.json(ticket, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Error creating ticket' }, { status: 500 });
  }
} 
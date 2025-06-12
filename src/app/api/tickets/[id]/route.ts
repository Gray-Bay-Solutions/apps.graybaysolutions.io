import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET /api/tickets/[id]
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const ticket = await prisma.ticket.findUnique({
      where: {
        id: parseInt(params.id),
      },
      include: {
        client: true,
      },
    });

    if (!ticket) {
      return NextResponse.json(
        { error: 'Ticket not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(ticket);
  } catch (error) {
    return NextResponse.json(
      { error: 'Error fetching ticket' },
      { status: 500 }
    );
  }
}

// PUT /api/tickets/[id]
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const json = await request.json();
    const ticket = await prisma.ticket.update({
      where: {
        id: parseInt(params.id),
      },
      data: json,
      include: {
        client: true,
      },
    });

    // Log activity
    await prisma.activity.create({
      data: {
        type: 'ticket',
        description: `Ticket #${ticket.id} updated`,
        user: json.assignee || 'System',
        target: `Ticket #${ticket.id}`,
        status: 'success',
      },
    });

    return NextResponse.json(ticket);
  } catch (error) {
    return NextResponse.json(
      { error: 'Error updating ticket' },
      { status: 500 }
    );
  }
}

// DELETE /api/tickets/[id]
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const ticket = await prisma.ticket.delete({
      where: {
        id: parseInt(params.id),
      },
    });

    // Log activity
    await prisma.activity.create({
      data: {
        type: 'ticket',
        description: `Ticket #${ticket.id} deleted`,
        user: 'System',
        target: `Ticket #${ticket.id}`,
        status: 'success',
      },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Error deleting ticket' },
      { status: 500 }
    );
  }
} 
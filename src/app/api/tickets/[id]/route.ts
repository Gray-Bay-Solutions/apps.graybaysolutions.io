import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/tickets/[id] - Get a specific ticket
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const ticketId = parseInt(id);

    const ticket = await prisma.ticket.findUnique({
      where: { id: ticketId },
      include: {
        client: {
          select: {
            id: true,
            name: true
          }
        },
        services: {
          include: {
            service: {
              select: {
                id: true,
                name: true,
                type: true
              }
            }
          }
        }
      }
    });

    if (!ticket) {
      return NextResponse.json(
        { error: 'Ticket not found' },
        { status: 404 }
      );
    }

    // Transform the data to match the frontend interface
    const transformedTicket = {
      id: ticket.id.toString(),
      title: ticket.title,
      description: ticket.description,
      status: ticket.status,
      priority: ticket.priority,
      type: ticket.type,
      clientId: ticket.clientId,
      clientName: ticket.client.name,
      assignee: ticket.assignee,
      createdAt: ticket.createdAt.toISOString(),
      updatedAt: ticket.updatedAt.toISOString(),
      scheduledFor: ticket.scheduledFor?.toISOString().split('T')[0],
      services: ticket.services.map((ts: any) => ts.service.name),
      impact: ticket.impact
    };

    return NextResponse.json(transformedTicket);
  } catch (error) {
    console.error('Error fetching ticket:', error);
    return NextResponse.json(
      { error: 'Failed to fetch ticket' },
      { status: 500 }
    );
  }
}

// PUT /api/tickets/[id] - Update a specific ticket
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const ticketId = parseInt(id);
    const body = await request.json();
    const {
      title,
      description,
      type,
      priority,
      status,
      services,
      scheduledFor,
      impact,
      assignee
    } = body;

    // Update the ticket
    const ticket = await prisma.ticket.update({
      where: { id: ticketId },
      data: {
        title,
        description,
        type,
        priority,
        status,
        assignee,
        impact,
        scheduledFor: scheduledFor ? new Date(scheduledFor) : null,
        updatedAt: new Date()
      },
      include: {
        client: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });

    // Update service relationships if provided
    if (services && services.length > 0) {
      // Remove existing relationships
      await prisma.ticketService.deleteMany({
        where: { ticketId: ticketId }
      });

      // Find the service IDs by name
      const serviceRecords = await prisma.service.findMany({
        where: {
          name: {
            in: services
          },
          clientId: ticket.clientId
        }
      });

      // Create new relationships
      await prisma.ticketService.createMany({
        data: serviceRecords.map((service: any) => ({
          ticketId: ticketId,
          serviceId: service.id
        }))
      });
    }

    // Transform the response
    const transformedTicket = {
      id: ticket.id.toString(),
      title: ticket.title,
      description: ticket.description,
      status: ticket.status,
      priority: ticket.priority,
      type: ticket.type,
      clientId: ticket.clientId,
      clientName: ticket.client.name,
      assignee: ticket.assignee,
      createdAt: ticket.createdAt.toISOString(),
      updatedAt: ticket.updatedAt.toISOString(),
      scheduledFor: ticket.scheduledFor?.toISOString().split('T')[0],
      services: services || [],
      impact: ticket.impact
    };

    return NextResponse.json(transformedTicket);
  } catch (error) {
    console.error('Error updating ticket:', error);
    return NextResponse.json(
      { error: 'Failed to update ticket' },
      { status: 500 }
    );
  }
}

// DELETE /api/tickets/[id] - Delete a specific ticket
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const ticketId = parseInt(id);

    // First, delete the ticket-service relationships
    await prisma.ticketService.deleteMany({
      where: { ticketId: ticketId }
    });

    // Then delete the ticket
    await prisma.ticket.delete({
      where: { id: ticketId }
    });

    return NextResponse.json(
      { message: 'Ticket deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting ticket:', error);
    return NextResponse.json(
      { error: 'Failed to delete ticket' },
      { status: 500 }
    );
  }
} 
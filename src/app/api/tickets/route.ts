import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/tickets - Get all tickets with optional filtering
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const clientId = searchParams.get('clientId');
    const status = searchParams.get('status');
    const priority = searchParams.get('priority');
    const type = searchParams.get('type');
    const assignee = searchParams.get('assignee');

    const where: any = {};
    
    if (clientId) {
      where.clientId = parseInt(clientId);
    }
    
    if (status && status !== 'all') {
      where.status = status;
    }
    
    if (priority && priority !== 'all') {
      where.priority = priority;
    }
    
    if (type && type !== 'all') {
      where.type = type;
    }
    
    if (assignee && assignee !== 'all') {
      where.assignee = assignee;
    }

    const tickets = await prisma.ticket.findMany({
      where,
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
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Transform the data to match the frontend interface
    const transformedTickets = tickets.map(ticket => ({
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
      services: ticket.services.map(ts => ts.service.name),
      impact: ticket.impact
    }));

    return NextResponse.json(transformedTickets);
  } catch (error) {
    console.error('Error fetching tickets:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tickets' },
      { status: 500 }
    );
  }
}

// POST /api/tickets - Create a new ticket
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      title,
      description,
      type,
      priority,
      clientId,
      services,
      scheduledFor,
      impact,
      assignee
    } = body;

    // Validate required fields
    if (!title || !description || !type || !priority || !clientId || !services?.length) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create the ticket
    const ticket = await prisma.ticket.create({
      data: {
        title,
        description,
        type,
        priority,
        clientId: parseInt(clientId),
        assignee,
        impact,
        scheduledFor: scheduledFor ? new Date(scheduledFor) : null,
        status: 'open'
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

    // Link services to the ticket
    if (services && services.length > 0) {
      // First, find the service IDs by name
      const serviceRecords = await prisma.service.findMany({
        where: {
          name: {
            in: services
          },
          clientId: parseInt(clientId)
        }
      });

      // Create the ticket-service relationships
      await prisma.ticketService.createMany({
        data: serviceRecords.map(service => ({
          ticketId: ticket.id,
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
      services: services,
      impact: ticket.impact
    };

    return NextResponse.json(transformedTicket, { status: 201 });
  } catch (error) {
    console.error('Error creating ticket:', error);
    return NextResponse.json(
      { error: 'Failed to create ticket' },
      { status: 500 }
    );
  }
} 
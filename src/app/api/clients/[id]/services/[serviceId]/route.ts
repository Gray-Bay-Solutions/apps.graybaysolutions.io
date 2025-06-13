import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET /api/clients/[id]/services/[serviceId]
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string; serviceId: string }> }
) {
  try {
    const { id, serviceId } = await params;
    const service = await prisma.service.findFirst({
      where: {
        id: parseInt(serviceId),
        clientId: parseInt(id),
      },
      include: {
        client: true,
        metrics: {
          orderBy: {
            timestamp: 'desc',
          },
        },
        resourceAllocations: {
          orderBy: {
            timestamp: 'desc',
          },
        },
        deployments: {
          orderBy: {
            date: 'desc',
          },
        },
      },
    });

    if (!service) {
      return NextResponse.json(
        { error: 'Service not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(service);
  } catch (error) {
    return NextResponse.json(
      { error: 'Error fetching service' },
      { status: 500 }
    );
  }
}

// PUT /api/clients/[id]/services/[serviceId]
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string; serviceId: string }> }
) {
  try {
    const { id, serviceId } = await params;
    const json = await request.json();
    
    const service = await prisma.service.updateMany({
      where: {
        id: parseInt(serviceId),
        clientId: parseInt(id),
      },
      data: json,
    });

    if (service.count === 0) {
      return NextResponse.json(
        { error: 'Service not found' },
        { status: 404 }
      );
    }

    // Fetch the updated service to return
    const updatedService = await prisma.service.findFirst({
      where: {
        id: parseInt(serviceId),
        clientId: parseInt(id),
      },
      include: {
        client: true,
        metrics: true,
      },
    });

    return NextResponse.json(updatedService);
  } catch (error) {
    console.error('Error updating service:', error);
    return NextResponse.json(
      { error: 'Error updating service' },
      { status: 500 }
    );
  }
}

// DELETE /api/clients/[id]/services/[serviceId]
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string; serviceId: string }> }
) {
  try {
    const { id, serviceId } = await params;
    
    const deletedService = await prisma.service.deleteMany({
      where: {
        id: parseInt(serviceId),
        clientId: parseInt(id),
      },
    });

    if (deletedService.count === 0) {
      return NextResponse.json(
        { error: 'Service not found' },
        { status: 404 }
      );
    }

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Error deleting service:', error);
    return NextResponse.json(
      { error: 'Error deleting service' },
      { status: 500 }
    );
  }
} 
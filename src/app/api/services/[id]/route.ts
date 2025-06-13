import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET /api/services/[id]
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const service = await prisma.service.findUnique({
      where: {
        id: parseInt(id),
      },
      include: {
        client: true,
        metrics: {
          orderBy: {
            timestamp: 'desc',
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

// PUT /api/services/[id]
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const json = await request.json();
    const service = await prisma.service.update({
      where: {
        id: parseInt(id),
      },
      data: json,
      include: {
        client: true,
      },
    });
    return NextResponse.json(service);
  } catch (error) {
    return NextResponse.json(
      { error: 'Error updating service' },
      { status: 500 }
    );
  }
}

// DELETE /api/services/[id]
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.service.delete({
      where: {
        id: parseInt(id),
      },
    });
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Error deleting service' },
      { status: 500 }
    );
  }
} 
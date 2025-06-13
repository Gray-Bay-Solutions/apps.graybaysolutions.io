import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET /api/clients/[id]/services
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const services = await prisma.service.findMany({
      where: {
        clientId: parseInt(id),
      },
      include: {
        metrics: {
          orderBy: {
            timestamp: 'desc',
          },
          take: 5,
        },
        resourceAllocations: {
          orderBy: {
            timestamp: 'desc',
          },
          take: 1,
        },
      },
    });

    return NextResponse.json(services);
  } catch (error) {
    return NextResponse.json(
      { error: 'Error fetching client services' },
      { status: 500 }
    );
  }
}

// POST /api/clients/[id]/services
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const json = await request.json();
    
    const service = await prisma.service.create({
      data: {
        ...json,
        clientId: parseInt(id),
      },
      include: {
        client: true,
        metrics: true,
      },
    });

    return NextResponse.json(service, { status: 201 });
  } catch (error) {
    console.error('Error creating service:', error);
    return NextResponse.json(
      { error: 'Error creating service' },
      { status: 500 }
    );
  }
} 
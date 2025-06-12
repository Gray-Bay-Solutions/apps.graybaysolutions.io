import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET /api/services
export async function GET() {
  try {
    const services = await prisma.service.findMany({
      include: {
        client: true,
        metrics: {
          orderBy: {
            timestamp: 'desc',
          },
          take: 5,
        },
      },
    });
    return NextResponse.json(services);
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching services' }, { status: 500 });
  }
}

// POST /api/services
export async function POST(request: Request) {
  try {
    const json = await request.json();
    const service = await prisma.service.create({
      data: json,
      include: {
        client: true,
      },
    });
    return NextResponse.json(service, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Error creating service' }, { status: 500 });
  }
} 
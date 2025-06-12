import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET /api/clients
export async function GET() {
  try {
    const clients = await prisma.client.findMany({
      include: {
        services: true,
        tickets: {
          where: {
            status: 'open',
          },
        },
      },
    });
    return NextResponse.json(clients);
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching clients' }, { status: 500 });
  }
}

// POST /api/clients
export async function POST(request: Request) {
  try {
    const json = await request.json();
    const client = await prisma.client.create({
      data: json,
    });
    return NextResponse.json(client, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Error creating client' }, { status: 500 });
  }
} 
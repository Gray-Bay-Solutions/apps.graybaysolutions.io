import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET /api/clients/[id]
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const client = await prisma.client.findUnique({
      where: {
        id: parseInt(id),
      },
      include: {
        services: true,
        contacts: true,
        tickets: true,
      },
    });

    if (!client) {
      return NextResponse.json(
        { error: 'Client not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(client);
  } catch (error) {
    return NextResponse.json(
      { error: 'Error fetching client' },
      { status: 500 }
    );
  }
}

// PUT /api/clients/[id]
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const json = await request.json();
    const client = await prisma.client.update({
      where: {
        id: parseInt(id),
      },
      data: json,
    });
    return NextResponse.json(client);
  } catch (error) {
    return NextResponse.json(
      { error: 'Error updating client' },
      { status: 500 }
    );
  }
}

// DELETE /api/clients/[id]
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.client.delete({
      where: {
        id: parseInt(id),
      },
    });
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Error deleting client' },
      { status: 500 }
    );
  }
} 
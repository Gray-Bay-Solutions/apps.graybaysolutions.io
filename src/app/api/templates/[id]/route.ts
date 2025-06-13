import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET /api/templates/[id]
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const template = await prisma.template.findUnique({
      where: {
        id: parseInt(id),
      },
    });

    if (!template) {
      return NextResponse.json(
        { error: 'Template not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(template);
  } catch (error) {
    return NextResponse.json(
      { error: 'Error fetching template' },
      { status: 500 }
    );
  }
}

// PUT /api/templates/[id]
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const json = await request.json();
    const template = await prisma.template.update({
      where: {
        id: parseInt(id),
      },
      data: json,
    });

    // Log activity
    await prisma.activity.create({
      data: {
        type: 'template',
        description: `Template "${template.name}" updated`,
        user: json.author,
        target: template.name,
        status: 'success',
      },
    });

    return NextResponse.json(template);
  } catch (error) {
    return NextResponse.json(
      { error: 'Error updating template' },
      { status: 500 }
    );
  }
}

// DELETE /api/templates/[id]
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const template = await prisma.template.delete({
      where: {
        id: parseInt(id),
      },
    });

    // Log activity
    await prisma.activity.create({
      data: {
        type: 'template',
        description: `Template "${template.name}" deleted`,
        user: 'System',
        target: template.name,
        status: 'success',
      },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Error deleting template' },
      { status: 500 }
    );
  }
} 
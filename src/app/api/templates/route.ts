import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET /api/templates
export async function GET() {
  try {
    const templates = await prisma.template.findMany({
      orderBy: {
        updatedAt: 'desc',
      },
    });
    return NextResponse.json(templates);
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching templates' }, { status: 500 });
  }
}

// POST /api/templates
export async function POST(request: Request) {
  try {
    const json = await request.json();
    const template = await prisma.template.create({
      data: json,
    });
    
    // Log activity
    await prisma.activity.create({
      data: {
        type: 'template',
        description: `Template "${template.name}" created`,
        user: json.author,
        target: template.name,
        status: 'success',
      },
    });
    
    return NextResponse.json(template, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Error creating template' }, { status: 500 });
  }
} 
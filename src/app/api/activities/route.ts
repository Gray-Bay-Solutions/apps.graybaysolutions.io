import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET /api/activities
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const status = searchParams.get('status');
    const user = searchParams.get('user');
    const limit = searchParams.get('limit');

    const where: any = {};
    if (type) where.type = type;
    if (status) where.status = status;
    if (user) where.user = user;

    const activities = await prisma.activity.findMany({
      where,
      take: limit ? parseInt(limit) : 50,
      orderBy: {
        createdAt: 'desc',
      },
    });
    return NextResponse.json(activities);
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching activities' }, { status: 500 });
  }
}

// POST /api/activities
export async function POST(request: Request) {
  try {
    const json = await request.json();
    const activity = await prisma.activity.create({
      data: json,
    });
    return NextResponse.json(activity, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Error creating activity log' }, { status: 500 });
  }
} 
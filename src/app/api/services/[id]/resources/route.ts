import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import type { ResourceAllocation } from '@prisma/client';

interface ResourceMetrics {
  totalCapacity: number;
  currentUsage: number;
  averageUsage: number;
  peakUsage: number;
  costPerUnit: number;
}

interface Recommendation {
  type: 'scaling' | 'optimization' | 'cost';
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  estimatedSavings?: number;
}

// GET /api/services/[id]/resources
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const serviceId = parseInt(id);

    // Get service with its resource allocations and metrics
    const service = await prisma.service.findUnique({
      where: { id: serviceId },
      include: {
        resourceAllocations: {
          include: {
            client: true,
          },
          orderBy: {
            timestamp: 'desc',
          },
          take: 10, // Get last 10 allocations
        },
        metrics: {
          orderBy: {
            timestamp: 'desc',
          },
          take: 5, // Get last 5 metrics
        },
      },
    });

    if (!service) {
      return NextResponse.json(
        { error: 'Service not found' },
        { status: 404 }
      );
    }

    // Get potential clients interested in this service type
    const potentialClients = await prisma.potentialClient.findMany({
      where: {
        interestedServices: {
          contains: service.type, // Search within JSON string
        },
      },
      orderBy: {
        probability: 'desc',
      },
    });

    // Calculate resource metrics
    const resourceMetrics: ResourceMetrics = {
      totalCapacity: service.capacityLimit || 0,
      currentUsage: service.currentUsage || 0,
      averageUsage: service.resourceAllocations.reduce((acc: number, curr: ResourceAllocation) => acc + curr.used, 0) / service.resourceAllocations.length,
      peakUsage: Math.max(...service.resourceAllocations.map((a: ResourceAllocation) => a.used)),
      costPerUnit: service.costPerUnit || 0,
    };

    // Generate recommendations based on usage patterns
    const recommendations: Recommendation[] = [];
    const usagePercentage = (resourceMetrics.currentUsage / resourceMetrics.totalCapacity) * 100;

    if (usagePercentage > 80) {
      recommendations.push({
        type: 'scaling',
        title: 'Consider scaling up capacity',
        description: `Current usage is at ${Math.round(usagePercentage)}% of capacity. Consider increasing capacity by 20%.`,
        impact: 'high',
      });
    }

    if (service.resourceAllocations.some((a: ResourceAllocation) => (a.used / a.allocated) < 0.6)) {
      recommendations.push({
        type: 'optimization',
        title: 'Optimize resource allocation',
        description: 'Some clients are significantly under-utilizing their allocated resources. Consider reallocation.',
        impact: 'medium',
        estimatedSavings: Math.round(
          service.resourceAllocations
            .filter((a: ResourceAllocation) => (a.used / a.allocated) < 0.6)
            .reduce((acc: number, curr: ResourceAllocation) => acc + ((curr.allocated - curr.used) * (service.costPerUnit || 0)), 0)
        ),
      });
    }

    return NextResponse.json({
      service,
      resourceMetrics,
      potentialClients,
      recommendations,
    });
  } catch (error) {
    console.error('Error fetching service resources:', error);
    return NextResponse.json(
      { error: 'Error fetching service resources' },
      { status: 500 }
    );
  }
}

// POST /api/services/[id]/resources
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const serviceId = parseInt(id);
    const json = await request.json();

    // Create new resource allocation
    const allocation = await prisma.resourceAllocation.create({
      data: {
        serviceId,
        clientId: json.clientId,
        allocated: json.allocated,
        used: json.used,
        cost: json.cost,
      },
      include: {
        client: true,
      },
    });

    // Update service current usage
    await prisma.service.update({
      where: { id: serviceId },
      data: {
        currentUsage: json.used,
      },
    });

    return NextResponse.json(allocation, { status: 201 });
  } catch (error) {
    console.error('Error creating resource allocation:', error);
    return NextResponse.json(
      { error: 'Error creating resource allocation' },
      { status: 500 }
    );
  }
} 
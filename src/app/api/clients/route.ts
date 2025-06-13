import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET /api/clients
export async function GET() {
  try {
    const clients = await prisma.client.findMany({
      include: {
        services: true,
        contacts: true,
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
    const { companyInfo, contacts, selectedServices } = json;

    // Create the client with nested contacts and services
    const client = await prisma.client.create({
      data: {
        name: companyInfo.name,
        website: companyInfo.website,
        industry: companyInfo.industry,
        size: companyInfo.size,
        contacts: {
          create: [
            {
              name: contacts.primary.name,
              role: contacts.primary.role,
              email: contacts.primary.email,
              phone: contacts.primary.phone,
              isPrimary: true,
              type: "primary",
            },
            {
              name: contacts.technical.name,
              role: contacts.technical.role,
              email: contacts.technical.email,
              phone: contacts.technical.phone,
              isPrimary: false,
              type: "technical",
            },
          ],
        },
        services: {
          create: selectedServices.filter((service: any) => service.included).map((service: any) => ({
            name: service.name,
            type: service.id,
            description: service.description,
            costPerUnit: service.basePrice,
            customPrice: service.customPrice,
            priceRangeMin: service.priceRange?.min,
            priceRangeMax: service.priceRange?.max,
            included: service.included,
          })),
        },
      },
      include: {
        contacts: true,
        services: true,
      },
    });

    return NextResponse.json(client, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error creating client' }, { status: 500 });
  }
} 
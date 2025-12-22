import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { OrderStatus } from '@prisma/client';

type Body = {
  payload: string; // "ORDER:<uuid>"
};

export async function POST(req: Request) {
  const { payload } = (await req.json()) as Body;

  if (!payload?.startsWith('ORDER:')) {
    return NextResponse.json(
      { error: 'Invalid QR code' },
      { status: 400 }
    );
  }

  const orderId = payload.replace('ORDER:', '');

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { tickets: true }
  });

  if (!order) {
    return NextResponse.json(
      { error: 'Order not found' },
      { status: 404 }
    );
  }

  if (order.status !== OrderStatus.PAID) {
    return NextResponse.json(
      { error: 'Payment not completed or refunded' },
      { status: 400 }
    );
  }

  if (order.used) {
    return NextResponse.json(
      { error: 'Ticket already used' },
      { status: 409 }
    );
  }

  return NextResponse.json({
    orderId: order.id,
    name: order.name,
    tickets: order.tickets
  });
}

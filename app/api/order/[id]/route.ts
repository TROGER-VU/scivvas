import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { OrderStatus } from '@prisma/client';

const EXPIRY_MS = 10 * 60 * 1000; // 10 minutes

export async function GET(
  _req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id: orderId } = await context.params; // ✅ THIS IS THE FIX

  if (!orderId) {
    return NextResponse.json(
      { error: 'Order ID missing' },
      { status: 400 }
    );
  }

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

  // ⏳ Soft guard — expire unpaid orders
  if (
    order.status === OrderStatus.PENDING &&
    Date.now() - order.createdAt.getTime() > EXPIRY_MS
  ) {
    return NextResponse.json(
      { error: 'Order expired' },
      { status: 410 }
    );
  }

  return NextResponse.json({
    id: order.id,
    name: order.name,
    amount: order.amount,
    status: order.status,
    tickets: order.tickets
  });
}

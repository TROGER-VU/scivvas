import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

type Body = {
  orderId: string;
};

export async function POST(req: Request) {
  const { orderId } = (await req.json()) as Body;

  const order = await prisma.order.findUnique({
    where: { id: orderId }
  });

  if (!order) {
    return NextResponse.json(
      { error: 'Order not found' },
      { status: 404 }
    );
  }

  if (order.used) {
    return NextResponse.json(
      { error: 'Already marked used' },
      { status: 409 }
    );
  }

  await prisma.order.update({
    where: { id: orderId },
    data: { used: true }
  });

  return NextResponse.json({ success: true });
}

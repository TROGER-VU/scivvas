import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import { prisma } from '@/lib/prisma';
import { EVENT_DATA } from '@/lib/event-data';

type CartItem = {
  tierId: string;
  qty: number;
};

type RequestBody = {
  customer: {
    name: string;
    email: string;
    phone: string;
  };
  cart: CartItem[];
};

const razorpay = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!
});

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as RequestBody;
    const { customer, cart } = body;

    /* ===================== BASIC VALIDATION ===================== */
    if (!cart || cart.length === 0) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
    }

    /* ===================== SERVER-SIDE PRICE CALC ===================== */
    let subtotal = 0;
    let totalQty = 0;

    type ValidatedItem = {
      tierId: string;
      qty: number;
      unitPrice: number;
      lineTotal: number;
    };

    const validatedItems: ValidatedItem[] = cart.map((item: CartItem) => {
      const tier = EVENT_DATA.tickets.find(t => t.id === item.tierId);

      if (!tier || item.qty < 1) {
        throw new Error('Invalid ticket selection');
      }

      const unitPrice = Number(tier.price.replace(/[^\d]/g, ''));
      const lineTotal = unitPrice * item.qty;

      subtotal += lineTotal;
      totalQty += item.qty;

      return {
        tierId: item.tierId,
        qty: item.qty,
        unitPrice,
        lineTotal
      };
    });


    /* ===================== DISCOUNT LOGIC ===================== */
    let discountPercent = 0;
    if (totalQty >= 10) discountPercent = 10;
    else if (totalQty >= 5) discountPercent = 5;

    const discountAmount = (subtotal * discountPercent) / 100;
    const discountedSubtotal = subtotal - discountAmount;
    const tax = discountedSubtotal * 0.18;
    const totalRupees = Number((discountedSubtotal + tax).toFixed(2));
    const totalPaise = Math.round(totalRupees * 100);


    /* ===================== CREATE RAZORPAY ORDER ===================== */
    const rpOrder = await razorpay.orders.create({
      amount: totalPaise, // paise
      currency: 'INR',
      receipt: `rcpt_${Date.now()}`
    });

    /* ===================== CREATE DB ORDER ===================== */
    const order = await prisma.order.create({
      data: {
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        amount: totalRupees,
        status: 'PENDING',
        razorpayOrderId: rpOrder.id
      }
    });

    /* ===================== CREATE TICKET PLACEHOLDER ===================== */
    await prisma.orderTicket.createMany({
      data: validatedItems.map(item => ({
        orderId: order.id,
        tierId: item.tierId,
        qty: item.qty
      }))
    });

    /* ===================== RESPONSE ===================== */
    return NextResponse.json({
      orderId: rpOrder.id,
      internalOrderId: order.id
    });

  } catch (err) {
    console.error('INITIATE ERROR:', err);
    return NextResponse.json(
      { error: 'Unable to initiate payment' },
      { status: 500 }
    );
  }
}

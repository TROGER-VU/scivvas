import { NextResponse } from 'next/server';
import crypto from 'crypto';

type VerifyBody = {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
};

export const runtime = 'nodejs';

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as VerifyBody;
    const {
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
    } = body;

    /* ===================== VERIFY SIGNATURE ===================== */
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      );
    }

    /**
     * DO NOT:
     * - update DB
     * - generate QR
     * - send email
     *
     * Webhook is the source of truth
     */

    return NextResponse.json({ success: true });

  } catch (err) {
    console.error('VERIFY ERROR:', err);
    return NextResponse.json(
      { error: 'Payment verification failed' },
      { status: 500 }
    );
  }
}

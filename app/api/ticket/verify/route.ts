import { NextResponse } from 'next/server';
import crypto from 'crypto';
import QRCode from 'qrcode';
import { prisma } from '@/lib/prisma';
import nodemailer from 'nodemailer';

type VerifyBody = {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
};
type OrderTicket = {
  tierId: string;
  qty: number;
};

/* ===================== MAILER ===================== */
const transporter = nodemailer.createTransport({
  host: 'smtpout.secureserver.net',
  port: 465,
  secure: true,
  auth: {
    user: process.env.MAIL_USER!,
    pass: process.env.MAIL_PASS!
  },
  tls: {
    rejectUnauthorized: false, // GoDaddy quirk
  },
});
await transporter.verify();
console.log('GoDaddy SMTP ready');


export async function POST(req: Request) {
  try {
    const body = (await req.json()) as VerifyBody;
    const {
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
    } = body;

    /* ===================== 1. VERIFY SIGNATURE ===================== */
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

    /* ===================== 2. FETCH ORDER ===================== */
    const order = await prisma.order.findUnique({
      where: { razorpayOrderId: razorpay_order_id },
      include: { tickets: true }
    });

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    /* ===================== 3. IDEMPOTENCY CHECK ===================== */
    if (order.status === 'PAID') {
      // Razorpay retry or page refresh
      return NextResponse.json({ success: true });
    }

    /* ===================== 4. GENERATE QR ===================== */
    const qrPayload = `ORDER:${order.id}`;
    const qrCode = await QRCode.toDataURL(qrPayload);
    const qrBuffer = await QRCode.toBuffer(qrPayload);

    /* ===================== 5. ATOMIC DB UPDATE ===================== */
    await prisma.$transaction([
      prisma.order.update({
        where: { id: order.id },
        data: {
          status: 'PAID',
          qrCode
        }
      })
    ]);


    /* ===================== 6. EMAIL TICKET ===================== */
    try {
      const ticketSummary = order.tickets
        .map((t: OrderTicket) => `<li>${t.qty} x ${t.tierId.toUpperCase()}</li>`)
        .join('');

      await transporter.sendMail({
        from: '"BAN KAFILA" <management@scivvas.com>',
        to: order.email,
        subject: '🎟️ Your Event Ticket',
        html: `
          <h2>Payment Successful</h2>
          <p>Hello ${order.name},</p>

          <p>Your booking is confirmed. Show the QR code below at the venue entrance.</p>

          <img src="cid:ticketqr" alt="QR Code" />

          <h3>Ticket Details</h3>
          <ul>${ticketSummary}</ul>

          <p><strong>Order ID:</strong> ${order.id}</p>
          <p><strong>Total Amount:</strong> ₹${order.amount}</p>

          <p>See you at the event!</p>
        `,
        attachments: [
          {
            filename: 'ticket-qr.png',
            content: qrBuffer,
            cid: 'ticketqr'
          }
        ]
      });
    } catch (emailError) {
      console.error('EMAIL FAILED:', emailError);
      // ❗ Do NOT throw — payment is already successful
    }

    /* ===================== 7. RESPONSE ===================== */
    return NextResponse.json({ success: true });

  } catch (err) {
    console.error('VERIFY ERROR:', err);
    return NextResponse.json(
      { error: 'Payment verification failed' },
      { status: 500 }
    );
  }
}

import { NextResponse } from 'next/server';
import crypto from 'crypto';
import QRCode from 'qrcode';
import { prisma } from '@/lib/prisma';
import nodemailer from 'nodemailer';

export const runtime = 'nodejs'; // REQUIRED for crypto

type OrderTicket = {
  tierId: string;
  qty: number;
};

/* ===================== MAILER (reusable) ===================== */
const transporter = nodemailer.createTransport({
  host: 'smtpout.secureserver.net',
  port: 465,
  secure: true,
  auth: {
    user: process.env.MAIL_USER!,
    pass: process.env.MAIL_PASS!
  },
  tls: {
    rejectUnauthorized: false // GoDaddy quirk
  }
});

/* ===================== WEBHOOK ===================== */
export async function POST(req: Request) {
  const rawBody = await req.text();
  const signature = req.headers.get('x-razorpay-signature');

  if (!signature) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
  }

  /* ===================== VERIFY SIGNATURE ===================== */
  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET!)
    .update(rawBody)
    .digest('hex');

  if (expectedSignature !== signature) {
    return NextResponse.json(
      { error: 'Invalid webhook signature' },
      { status: 400 }
    );
  }

  const event = JSON.parse(rawBody);

  /* ============================================================
     PAYMENT CAPTURED
     ============================================================ */
  if (event.event === 'payment.captured') {
    const razorpayOrderId: string | undefined =
      event?.payload?.payment?.entity?.order_id;

    if (!razorpayOrderId) {
      return NextResponse.json({ received: true });
    }

    const order = await prisma.order.findUnique({
      where: { razorpayOrderId },
      include: { tickets: true }
    });

    // Idempotency guard
    if (!order || order.status === 'PAID') {
      return NextResponse.json({ received: true });
    }

    /* ===== Generate QR ===== */
    const qrPayload = `ORDER:${order.id}`;
    const qrCode = await QRCode.toDataURL(qrPayload);
    const qrBuffer = await QRCode.toBuffer(qrPayload);

    /* ===== Update DB ===== */
    await prisma.order.update({
      where: { id: order.id },
      data: {
        status: 'PAID',
        qrCode
      }
    });

    /* ===== Email Ticket ===== */
    try {
      const ticketSummary = order.tickets
        .map(
          (t: OrderTicket) =>
            `<li>${t.qty} x ${t.tierId.toUpperCase()}</li>`
        )
        .join('');

      await transporter.sendMail({
        from: '"Gulabi & Gabru Night" <management@scivvas.com>',
        to: order.email,
        subject: '🎟️ Your Event Ticket',
        html: `
          <h2>Payment Successful</h2>
          <p>Hello ${order.name},</p>
          <p>Your booking is confirmed. Show the QR code below at the venue entrance.</p>

          <img src="cid:qr" alt="QR Code" />

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
            cid: 'qr'
          }
        ]
      });
    } catch (err) {
      console.error('Ticket email failed:', err);
      // ❗ Do NOT throw — payment already succeeded
    }
  }

  /* ============================================================
     REFUND PROCESSED
     ============================================================ */
  if (event.event === 'refund.processed') {
    const razorpayOrderId =
      event.payload.refund.entity.order_id;

    const order = await prisma.order.findFirst({
      where: { razorpayOrderId }
    });

    if (!order || order.status === 'REFUNDED') {
      return NextResponse.json({ received: true });
    }

    await prisma.order.update({
      where: { id: order.id },
      data: {
        status: 'REFUNDED',
        qrCode: null
      }
    });

    /* ===== Refund Email ===== */
    try {
      await transporter.sendMail({
        from: '"Gulabi & Gabru Night" <management@scivvas.com>',
        to: order.email,
        subject: '💸 Refund Processed',
        html: `
          <h2>Refund Successful</h2>
          <p>Hello ${order.name},</p>
          <p>Your refund for Order <b>${order.id}</b> has been processed.</p>
          <p>The ticket QR code is now invalid.</p>
          <p>If you have questions, reply to this email.</p>
        `
      });
    } catch (err) {
      console.error('Refund email failed:', err);
    }
  }

  return NextResponse.json({ received: true });
}

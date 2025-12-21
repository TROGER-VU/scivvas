import { NextResponse } from 'next/server';
import crypto from 'crypto';
import QRCode from 'qrcode';
import { prisma } from '@/lib/prisma';
import nodemailer from 'nodemailer';

export const runtime = 'nodejs'; // IMPORTANT for crypto

type OrderTicket = {
  tierId: string;
  qty: number;
};

/* ===================== RAW BODY ===================== */
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
    return NextResponse.json({ error: 'Invalid webhook signature' }, { status: 400 });
  }

  const event = JSON.parse(rawBody);

  /* ===================== HANDLE EVENT ===================== */
  if (event.event === 'payment.captured') {
    const razorpayOrderId = event.payload.payment.entity.order_id;

    const order = await prisma.order.findUnique({
      where: { razorpayOrderId },
      include: { tickets: true }
    });

    if (!order || order.status === 'PAID') {
      return NextResponse.json({ success: true });
    }

    /* ===================== GENERATE QR ===================== */
    const qrPayload = `ORDER:${order.id}`;
    const qrCode = await QRCode.toDataURL(qrPayload);
    const qrBuffer = await QRCode.toBuffer(qrPayload);

    /* ===================== UPDATE DB ===================== */
    await prisma.order.update({
      where: { id: order.id },
      data: {
        status: 'PAID',
        qrCode
      }
    });

    /* ===================== EMAIL ===================== */
    try {
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
          <img src="cid:qr" />
          <h3>Ticket Details </h3>
          <ul>${ticketSummary}</ul>
          <p><strong>Order ID:</strong> ${order.id}</p>
          <p><strong>Total Amount:</strong> ₹${order.amount}</p>
          <p>See you at the event!</p>
        `,
        attachments: [{
          filename: 'ticket.png',
          content: qrBuffer,
          cid: 'qr'
        }]
      });
    } catch (e) {
      console.error('Email failed', e);
    }
  }

  return NextResponse.json({ received: true });
}

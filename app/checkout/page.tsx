'use client';

import { Suspense, useMemo, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Script from 'next/script';
import {
  Loader2,
  ArrowLeft,
  ShieldCheck,
  Calendar,
  MapPin,
  BadgePercent
} from 'lucide-react';
import { EVENT_DATA } from '@/app/events/kafila/page';

/* ===================== Razorpay Types ===================== */

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => { open: () => void };
  }
}

interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

interface RazorpayOptions {
  key: string;
  amount: number; // paise
  currency: 'INR';
  name: string;
  description?: string;
  order_id: string;
  handler: (response: RazorpayResponse) => void;
  prefill: {
    name: string;
    email: string;
    contact: string;
  };
  theme?: { color: string };
  modal?: { ondismiss: () => void };
}

/* ===================== Utils ===================== */

const formatINR = (amount: number): string =>
  `₹${amount.toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}`;

const toPaise = (amount: number): number =>
  Math.round(Number(amount.toFixed(2)) * 100);

/* ===================== Types ===================== */

type CartParam = {
  tierId: string;
  qty: number;
};

type CartItem = {
  id: string;
  name: string;
  qty: number;
  unitPrice: number;
  lineTotal: number;
};

type Summary = {
  subtotal: number;
  discountPercent: number;
  discountAmount: number;
  tax: number;
  total: number;
  totalQty: number;
};

type CheckoutForm = {
  name: string;
  email: string;
  phone: string;
};

/* ===================== Page ===================== */

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div />}>
      <CheckoutContent />
    </Suspense>
  );
}

function CheckoutContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [form, setForm] = useState<CheckoutForm>({
    name: '',
    email: '',
    phone: ''
  });
  const [processing, setProcessing] = useState(false);

  /* ===================== DERIVED CHECKOUT DATA ===================== */
  const checkoutData = useMemo<{
    cart: CartItem[];
    summary: Summary;
  } | null>(() => {
    const rawCart = searchParams.get('cart');
    if (!rawCart) return null;

    let parsed: CartParam[];
    try {
      parsed = JSON.parse(decodeURIComponent(rawCart)) as CartParam[];
    } catch {
      return null;
    }

    const cart: CartItem[] = [];
    let subtotal = 0;
    let totalQty = 0;

    for (const item of parsed) {
      const tier = EVENT_DATA.tickets.find(t => t.id === item.tierId);
      if (!tier || item.qty < 1) continue;

      const unitPrice = Number(tier.price.replace(/[^\d]/g, ''));
      const lineTotal = unitPrice * item.qty;

      subtotal += lineTotal;
      totalQty += item.qty;

      cart.push({
        id: tier.id,
        name: tier.name,
        qty: item.qty,
        unitPrice,
        lineTotal
      });
    }

    if (!cart.length) return null;

    let discountPercent = 0;
    if (totalQty >= 10) discountPercent = 10;
    else if (totalQty >= 5) discountPercent = 5;

    const discountAmount = (subtotal * discountPercent) / 100;
    const discountedSubtotal = subtotal - discountAmount;
    const tax = discountedSubtotal * 0.18;
    const total = discountedSubtotal + tax;

    return {
      cart,
      summary: {
        subtotal,
        discountPercent,
        discountAmount,
        tax,
        total,
        totalQty
      }
    };
  }, [searchParams]);

  if (!checkoutData) {
    router.replace('/events/kafila');
    return null;
  }

  const { cart, summary } = checkoutData;

  /* ===================== PAYMENT ===================== */
  const handlePayment = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setProcessing(true);

    try {
      const res = await fetch('/api/ticket/initiate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer: form,
          cart: cart.map(i => ({ tierId: i.id, qty: i.qty }))
        })
      });

      const {
        orderId,
        internalOrderId
      }: { orderId: string; internalOrderId: string } = await res.json();


      const options: RazorpayOptions = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
        amount: toPaise(summary.total),
        currency: 'INR',
        name: EVENT_DATA.title,
        description: 'Event Ticket Booking',
        order_id: orderId,
        handler: async (response) => {
          await fetch('/api/ticket/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(response)
          });

          router.push(`/success?orderId=${internalOrderId}`);
        },

        prefill: {
          name: form.name,
          email: form.email,
          contact: form.phone
        },
        theme: { color: '#FF9FFC' },
        modal: { ondismiss: () => setProcessing(false) }
      };

      new window.Razorpay(options).open();
    } catch {
      alert('Payment initiation failed');
      setProcessing(false);
    }
  };

  /* ===================== UI ===================== */
  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-12">
      <button
        onClick={() => router.back()}
        className="mb-10 flex items-center gap-2 text-gray-400 hover:text-white"
      >
        <ArrowLeft size={20} /> Back to Event
      </button>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-14">
        {/* LEFT */}
        <div>
          <h2 className="text-4xl font-black mb-6">
            SECURE <span className="text-[#FF9FFC]">CHECKOUT</span>
          </h2>

          <div className="mb-8 p-5 rounded-2xl bg-white/5 border border-white/10">
            <h3 className="text-xl font-bold">{EVENT_DATA.title}</h3>
            <div className="flex gap-4 text-sm text-gray-400 mt-1">
              <span className="flex items-center gap-1">
                <Calendar size={14} />
                {new Date(EVENT_DATA.date).toDateString()}
              </span>
              <span className="flex items-center gap-1">
                <MapPin size={14} />
                {EVENT_DATA.location}
              </span>
            </div>
          </div>

          <form onSubmit={handlePayment} className="space-y-6">
            {(Object.keys(form) as (keyof CheckoutForm)[]).map(field => (
              <div key={field}>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                  {field}
                </label>
                <input
                  required
                  type={field === 'email' ? 'email' : 'text'}
                  className="w-full bg-[#111] border border-white/10 p-4 rounded-xl"
                  value={form[field]}
                  onChange={e =>
                    setForm({ ...form, [field]: e.target.value })
                  }
                />
              </div>
            ))}

            <button
              disabled={processing}
              className={`w-full py-5 rounded-2xl font-black text-xl
                ${
                  processing
                    ? 'bg-gray-500 cursor-not-allowed'
                    : 'bg-white text-black hover:bg-[#FF9FFC]'
                }`}
            >
              {processing ? <Loader2 className="animate-spin" /> : 'CONFIRM & PAY'}
            </button>
          </form>
        </div>

        {/* RIGHT */}
        <div className="bg-[#0c0c0c] border border-white/10 p-8 rounded-3xl h-fit sticky top-24">
          <h3 className="text-xl font-bold mb-6">ORDER SUMMARY</h3>

          <div className="space-y-4">
            {cart.map(item => (
              <div key={item.id} className="flex justify-between">
                <div>
                  <p className="font-semibold">{item.name}</p>
                  <p className="text-xs text-gray-500">Qty × {item.qty}</p>
                </div>
                <span className="font-mono">
                  {formatINR(item.lineTotal)}
                </span>
              </div>
            ))}

            <div className="flex justify-between text-sm text-gray-500">
              <span>Subtotal</span>
              <span>{formatINR(summary.subtotal)}</span>
            </div>

            {summary.discountPercent > 0 && (
              <div className="flex justify-between text-sm text-green-400">
                <span className="flex items-center gap-1">
                  <BadgePercent size={14} />
                  Bulk Discount ({summary.discountPercent}%)
                </span>
                <span>-{formatINR(summary.discountAmount)}</span>
              </div>
            )}

            <div className="flex justify-between text-sm text-gray-500">
              <span>Tax (18%)</span>
              <span>{formatINR(summary.tax)}</span>
            </div>

            <div className="h-px bg-white/10 my-4" />

            <div className="flex justify-between text-2xl font-black">
              <span>Total</span>
              <span className="text-[#FF9FFC] font-mono">
                {formatINR(summary.total)}
              </span>
            </div>
          </div>

          <div className="mt-8 flex items-center gap-3 p-4 bg-white/5 rounded-xl opacity-70">
            <ShieldCheck className="text-green-500" />
            <p className="text-[10px] uppercase tracking-wider">
              Secured via Razorpay Encryption
            </p>
          </div>
        </div>
      </div>

      <Script src="https://checkout.razorpay.com/v1/checkout.js" />
    </div>
  );
}

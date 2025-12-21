'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { CheckCircle, Loader2, XCircle } from 'lucide-react';

type OrderTicket = {
  tierId: string;
  qty: number;
};

type OrderResponse = {
  id: string;
  name: string;
  amount: number;
  status: 'PENDING' | 'PAID';
  tickets: OrderTicket[];
};

export default function SuccessPage() {
  const params = useSearchParams();
  const router = useRouter();
  const orderId = params.get('orderId');

  const [order, setOrder] = useState<OrderResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!orderId) return;

    const fetchOrder = async () => {
      try {
        const res = await fetch(`/api/order/${orderId}`);

        if (res.status === 410) {
          setError('Payment session expired. If money was deducted, contact support.');
          return;
        }

        if (!res.ok) return;

        const data: OrderResponse = await res.json();
        setOrder(data);

        if (data.status === 'PAID') {
          clearInterval(intervalId);
        }
      } catch {
        setError('Unable to verify payment');
        clearInterval(intervalId);
      }
    };

    // initial fetch
    fetchOrder();

    // poll every 1.5s
    const intervalId = setInterval(fetchOrder, 1500);

    return () => clearInterval(intervalId);
  }, [orderId]);

  /* ===================== INVALID URL ===================== */
  if (!orderId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        Invalid order
      </div>
    );
  }

  /* ===================== ERROR / EXPIRED ===================== */
  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white px-6">
        <XCircle size={64} className="text-red-500 mb-4" />
        <p className="text-center text-red-400 mb-6">{error}</p>
        <button
          onClick={() => router.push('/')}
          className="px-6 py-3 rounded-xl bg-[#FF9FFC] text-black font-bold"
        >
          Go Home
        </button>
      </div>
    );
  }

  /* ===================== WAITING FOR PAYMENT ===================== */
  if (!order || order.status === 'PENDING') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white">
        <Loader2 className="animate-spin mb-4" size={40} />
        <p className="text-gray-400">Verifying your payment…</p>
        <p className="text-xs text-gray-600 mt-2">
          Please do not refresh or close this page
        </p>
      </div>
    );
  }

  /* ===================== PAYMENT SUCCESS ===================== */
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white px-6">
      <CheckCircle size={72} className="text-green-500 mb-6" />

      <h1 className="text-4xl font-black mb-4">
        PAYMENT <span className="text-[#FF9FFC]">SUCCESSFUL</span>
      </h1>

      <p className="text-gray-400 mb-6 text-center">
        Thank you <b>{order.name}</b>!
        <br />
        Your group entry is confirmed.
      </p>

      {/* Ticket Summary */}
      <div className="bg-white/5 border border-white/10 rounded-xl px-6 py-4 mb-6 w-full max-w-sm">
        <h3 className="font-bold mb-3 text-center">Ticket Summary</h3>
        <ul className="space-y-2">
          {order.tickets.map((t, i) => (
            <li key={i} className="flex justify-between font-mono">
              <span>{t.tierId.toUpperCase()}</span>
              <span>× {t.qty}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="text-sm font-mono text-gray-400 mb-2">
        Order ID
      </div>
      <div className="font-mono text-[#FF9FFC] break-all mb-8">
        {order.id}
      </div>

      <button
        onClick={() => router.push('/')}
        className="px-8 py-3 rounded-xl bg-[#FF9FFC] text-black font-black uppercase tracking-wide"
      >
        Go Home
      </button>
    </div>
  );
}

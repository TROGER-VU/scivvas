'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { CheckCircle, Loader2 } from 'lucide-react';

type OrderTicket = {
  tierId: string;
  qty: number;
};

type OrderResponse = {
  id: string;
  name: string;
  amount: number;
  tickets: OrderTicket[];
};

export default function SuccessClient() {
  const params = useSearchParams();
  const router = useRouter();
  const orderId = params.get('orderId');

  const [order, setOrder] = useState<OrderResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [attempts, setAttempts] = useState(0);

  useEffect(() => {
    if (!orderId) return;

    const MAX_ATTEMPTS = 10;

    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/order/${orderId}`);
        if (res.ok) {
          const data = await res.json();
          setOrder(data);
          setLoading(false);
          clearInterval(interval);
        } else {
          setAttempts(prev => prev + 1);
        }
      } catch {
        setAttempts(prev => prev + 1);
      }

      if (attempts >= MAX_ATTEMPTS) {
        clearInterval(interval);
        setLoading(false);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [orderId, attempts]);

  if (!orderId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        Invalid order
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        Payment verification pending. Please check your email.
      </div>
    );
  }

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

      <div className="font-mono text-[#FF9FFC] break-all mb-8">
        Order ID: {order.id}
      </div>

      <button
        onClick={() => router.push('/')}
        className="px-8 py-3 rounded-xl bg-[#FF9FFC] text-black font-black uppercase"
      >
        Go Home
      </button>
    </div>
  );
}

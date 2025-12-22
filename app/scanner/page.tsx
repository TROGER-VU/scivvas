'use client';

import { useEffect, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';

type Ticket = {
  tierId: string;
  qty: number;
};

type ScanResult = {
  orderId: string;
  name: string;
  tickets: Ticket[];
};

export default function ScannerPage() {
  const [result, setResult] = useState<ScanResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const scanner = new Html5QrcodeScanner(
      'qr-reader',
      { fps: 10, qrbox: 250 },
      false
    );

    scanner.render(
      async (decodedText) => {
        scanner.clear();
        setLoading(true);

        try {
          const res = await fetch('/api/scanner/validate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ payload: decodedText })
          });

          const data = await res.json();

          if (!res.ok) {
            setError(data.error);
            setLoading(false);
            return;
          }

          setResult(data);
          setLoading(false);
        } catch {
          setError('Scan failed');
          setLoading(false);
        }
      },
      () => {}
    );

    return () => {
      scanner.clear().catch(() => {});
    };
  }, []);

  const confirmEntry = async () => {
    if (!result) return;

    await fetch('/api/scanner/mark-used', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderId: result.orderId })
    });

    alert('Entry confirmed');
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <h1 className="text-3xl font-black mb-6 text-center">
        ENTRY SCANNER
      </h1>

      {!result && !error && (
        <div id="qr-reader" className="max-w-sm mx-auto" />
      )}

      {loading && <p className="text-center">Validating...</p>}

      {error && (
        <p className="text-red-500 text-center mt-6">{error}</p>
      )}

      {result && (
        <div className="mt-6 max-w-sm mx-auto bg-white/5 p-6 rounded-xl">
          <h2 className="font-bold mb-2">{result.name}</h2>

          <ul className="mb-4">
            {result.tickets.map((t, i) => (
              <li key={i}>
                {t.qty} x {t.tierId.toUpperCase()}
              </li>
            ))}
          </ul>

          <button
            onClick={confirmEntry}
            className="w-full py-3 bg-green-500 text-black font-bold rounded-xl"
          >
            ALLOW ENTRY
          </button>
        </div>
      )}
    </div>
  );
}

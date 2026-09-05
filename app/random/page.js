'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function RandomPage() {
  const [err, setErr] = useState('');
  useEffect(() => {
    const base =
      process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1';
    fetch(`${base}/anime/random`)
      .then((r) => {
        if (!r.ok) throw new Error(`API ${r.status}`);
        return r.json();
      })
      .then((j) => {
        if (j?.data?.id) window.location.assign(`/anime/${j.data.id}`);
        else setErr('Got an empty response from the API.');
      })
      .catch((e) => setErr(String(e?.message || e)));
  }, []);

  return (
    <div className="mx-auto max-w-7xl px-4 pt-20 text-center">
      <p className="text-4xl">🎲</p>
      <h1 className="mt-4 text-2xl font-bold text-white">Rolling the dice…</h1>
      {err ? (
        <>
          <p className="mt-2 text-sm text-gray-400">{err}</p>
          <p className="mt-4 text-sm">
            <Link href="/" className="rounded-full bg-accent px-6 py-2 font-bold text-black">
              Back home
            </Link>
          </p>
        </>
      ) : (
        <div className="mx-auto mt-6 h-2 w-48 overflow-hidden rounded-full bg-surface">
          <div className="h-full w-1/2 animate-pulse rounded-full bg-accent" />
        </div>
      )}
    </div>
  );
}

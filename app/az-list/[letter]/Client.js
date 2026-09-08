'use client';

import Link from 'next/link';
import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Grid, Pagination } from '../../../components/ui';
import { useRouteId } from '../../../components/client';
import { api } from '../../../lib/api';

const LETTERS = ['all', '0-9', ...'abcdefghijklmnopqrstuvwxyz'.split('')];

function AzListInner({ initialLetter }) {
  const searchParams = useSearchParams();
  const letter = useRouteId(initialLetter);
  const page = Number(searchParams.get('page')) || 1;
  const [data, setData] = useState(null);
  const [err, setErr] = useState('');

  useEffect(() => {
    if (!letter) return;
    setData(null);
    setErr('');
    api.azList(letter, page).then(setData).catch((e) => setErr(String(e?.message || e)));
  }, [letter, page]);

  return (
    <div className="mx-auto max-w-7xl px-4 pt-6">
      <h1 className="mb-4 flex items-center gap-2 text-2xl font-bold text-white">
        <span className="h-6 w-1 rounded bg-accent" /> A–Z List
      </h1>
      <div className="mb-6 flex flex-wrap gap-1.5">
        {LETTERS.map((l) => (
          <Link
            key={l}
            href={`/az-list/${l}`}
            className={`rounded-lg px-3 py-1.5 text-xs font-bold uppercase transition ${
              letter === l ? 'bg-accent text-black' : 'bg-surface/70 text-gray-300 hover:bg-white/10 hover:text-white'
            }`}
          >
            {l}
          </Link>
        ))}
      </div>
      {err ? <p className="text-sm text-gray-400">Failed to load: {err}</p> : null}
      {!data && !err ? (
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="h-52 animate-pulse rounded-xl bg-white/5" />
          ))}
        </div>
      ) : null}
      {data ? (
        <>
          <Grid items={data.response} />
          <Pagination
            page={data.pageInfo.currentPage}
            totalPages={data.pageInfo.totalPages}
            makeHref={(p) => `/az-list/${letter}?page=${p}`}
          />
        </>
      ) : null}
    </div>
  );
}

export default function AzListClient({ initialLetter }) {
  return (
    <Suspense>
      <AzListInner initialLetter={initialLetter} />
    </Suspense>
  );
}

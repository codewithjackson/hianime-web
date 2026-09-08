'use client';

import Link from 'next/link';
import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Grid, Pagination } from '../../components/ui';
import { FilterForm } from '../../components/client';
import { api } from '../../lib/api';

const KNOWN = [
  'keyword', 'type', 'status', 'rated', 'score', 'season', 'language',
  'sort', 'genres', 'sy', 'sm', 'sd', 'ey', 'em', 'ed',
];

function qsFromParams(sp, page) {
  const p = new URLSearchParams();
  for (const k of KNOWN) {
    const v = sp.get(k);
    if (v) p.set(k, v);
  }
  p.set('page', String(page));
  return p.toString();
}

function FilterInner() {
  const sp = useSearchParams();
  const page = Number(sp.get('page')) || 1;
  const filterKey = sp.toString();
  const initial = {};
  for (const k of [...KNOWN, 'page']) {
    const v = sp.get(k);
    if (v) initial[k] = v;
  }
  const [meta, setMeta] = useState({ genres: [] });
  const [data, setData] = useState(null);
  const [err, setErr] = useState('');

  useEffect(() => {
    api.meta().then(setMeta).catch(() => setMeta({ genres: [] }));
  }, []);

  useEffect(() => {
    const hasFilter = KNOWN.some((k) => sp.get(k));
    if (!hasFilter) {
      setData(null);
      return;
    }
    setData(null);
    setErr('');
    api.filter(qsFromParams(sp, 1).replace(/&page=\d+$/, ''), page)
      .then(setData)
      .catch((e) => setErr(String(e?.message || e)));
  }, [filterKey, page]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="mx-auto max-w-7xl px-4 pt-6">
      <nav className="mb-4 text-xs text-gray-500">
        <Link href="/" className="hover:text-gray-300">Home</Link>
        {' • '}
        <span className="text-gray-300">Filter</span>
      </nav>
      <FilterForm
        key={filterKey}
        genres={meta.genres || []}
        initial={initial}
      />
      {err ? <p className="mt-6 text-sm text-gray-400">Failed to load: {err}</p> : null}
      {data ? (
        <div className="mt-6">
          <p className="mb-3 text-xs text-gray-500">
            {data.pageInfo.totalPages > 1
              ? `Page ${data.pageInfo.currentPage} of ${data.pageInfo.totalPages}`
              : `${data.response.length} titles`}
          </p>
          <Grid items={data.response} />
          <Pagination
            page={data.pageInfo.currentPage}
            totalPages={data.pageInfo.totalPages}
            makeHref={(p) => `/filter?${qsFromParams(sp, p)}`}
          />
        </div>
      ) : !err && KNOWN.some((k) => sp.get(k)) ? (
        <div className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="h-52 animate-pulse rounded-xl bg-white/5" />
          ))}
        </div>
      ) : !err ? (
        <p className="mt-6 text-center text-sm text-gray-500">
          Pick filters above and hit <strong className="text-gray-300">Filter</strong> to browse.
        </p>
      ) : null}
    </div>
  );
}

export default function FilterPage() {
  return (
    <Suspense>
      <FilterInner />
    </Suspense>
  );
}

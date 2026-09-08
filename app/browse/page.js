'use client';

import Link from 'next/link';
import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Grid, Pagination } from '../../components/ui';
import { api } from '../../lib/api';

const FILTERS = {
  type: ['all', 'tv', 'movie', 'ova', 'ona', 'special', 'music'],
  status: ['all', 'completed', 'airing', 'not_yet_aired'],
  rated: ['all', 'g', 'pg', 'pg_13', 'r_17', 'r_plus', 'rx'],
  season: ['all', 'spring', 'summer', 'fall', 'winter'],
  language: ['all', 'sub', 'dub'],
  sort: ['default', 'updated_date', 'added_date', 'release_date', 'trending', 'title_az', 'avg_score', 'mal_score'],
};

function qsFromParams(sp, page) {
  const p = new URLSearchParams();
  const keyword = sp.get('keyword');
  if (keyword) p.set('keyword', keyword);
  for (const k of Object.keys(FILTERS)) {
    const v = sp.get(k);
    if (v) p.set(k, v);
  }
  p.set('page', String(page));
  return p.toString();
}

function BrowseInner() {
  const sp = useSearchParams();
  const keyword = sp.get('keyword') || '';
  const page = Number(sp.get('page')) || 1;
  const filterKey = sp.toString();
  const [data, setData] = useState(null);
  const [err, setErr] = useState('');

  useEffect(() => {
    setData(null);
    setErr('');
    const hasFilter = keyword || Object.keys(FILTERS).some((k) => sp.get(k));
    const p = hasFilter
      ? api.filter(qsFromParams(sp, 1).replace(/&page=\d+$/, ''), page)
      : api.explore('top-airing', page);
    p.then(setData).catch((e) => setErr(String(e?.message || e)));
  }, [filterKey, page]); // eslint-disable-line react-hooks/exhaustive-deps

  const current = {};
  for (const k of Object.keys(FILTERS)) current[k] = sp.get(k) || 'all';

  return (
    <div className="mx-auto max-w-7xl px-4 pt-6">
      <h1 className="mb-4 flex items-center gap-2 text-2xl font-bold text-white">
        <span className="h-6 w-1 rounded bg-accent" />
        {keyword ? (
          <>Results for &ldquo;{keyword}&rdquo;</>
        ) : (
          'Browse Anime'
        )}
      </h1>
      <form
        method="get"
        action="/browse"
        className="mb-6 rounded-2xl bg-surface/50 p-4 ring-1 ring-white/5"
      >
        <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
          <input
            name="keyword"
            key={`kw-${keyword}`}
            defaultValue={keyword}
            placeholder="Keyword..."
            className="col-span-2 rounded-xl bg-base px-3 py-2 text-sm outline-none ring-1 ring-white/10 placeholder:text-gray-500 focus:ring-2 focus:ring-accent md:col-span-1"
          />
          {Object.entries(FILTERS).map(([name, opts]) => (
            <label key={name} className="block">
              <span className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-gray-500">
                {name}
              </span>
            <select
              name={name}
              key={`${name}-${current[name]}`}
              defaultValue={current[name]}
                className="w-full rounded-xl bg-base px-3 py-2 text-sm capitalize outline-none ring-1 ring-white/10 focus:ring-2 focus:ring-accent"
              >
                {opts.map((o) => (
                  <option key={o} value={o}>
                    {o.replaceAll('_', ' ')}
                  </option>
                ))}
              </select>
            </label>
          ))}
        </div>
        <div className="mt-3 flex gap-2">
          <button className="rounded-full bg-accent px-6 py-1.5 text-sm font-bold text-black transition hover:brightness-110">
            Apply filters
          </button>
          <Link
            href="/browse"
            className="rounded-full bg-white/10 px-6 py-1.5 text-sm text-gray-200 hover:bg-white/20"
          >
            Reset
          </Link>
        </div>
      </form>
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
          <p className="mb-3 text-xs text-gray-500">
            {data.pageInfo.totalPages > 1
              ? `Page ${data.pageInfo.currentPage} of ${data.pageInfo.totalPages}`
              : `${data.response.length} titles`}
          </p>
          <Grid items={data.response} />
          <Pagination
            page={data.pageInfo.currentPage}
            totalPages={data.pageInfo.totalPages}
            makeHref={(p) => `/browse?${qsFromParams(sp, p)}`}
          />
        </>
      ) : null}
    </div>
  );
}

export default function BrowsePage() {
  return (
    <Suspense>
      <BrowseInner />
    </Suspense>
  );
}

'use client';

import Link from 'next/link';
import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Grid, Pagination } from '../../../components/ui';
import { useRouteId } from '../../../components/client';
import { api } from '../../../lib/api';

const TITLES = {
  'top-airing': 'Top Airing',
  'most-popular': 'Most Popular',
  'most-favorite': 'Most Favorite',
  completed: 'Completed',
  'recently-added': 'Recently Added',
  'recently-updated': 'Recently Updated',
  'top-upcoming': 'Top Upcoming',
  'subbed-anime': 'Subbed Anime',
  'dubbed-anime': 'Dubbed Anime',
  movie: 'Movies',
  tv: 'TV Series',
  ova: 'OVAs',
  ona: 'ONAs',
  special: 'Specials',
};

function ExploreInner({ initialQuery }) {
  const searchParams = useSearchParams();
  const query = useRouteId(initialQuery);
  const page = Number(searchParams.get('page')) || 1;
  const [data, setData] = useState(null);
  const [err, setErr] = useState('');

  useEffect(() => {
    if (!query) return;
    setData(null);
    setErr('');
    api.explore(query, page).then(setData).catch((e) => setErr(String(e?.message || e)));
  }, [query, page]);

  if (err) return <div className="mx-auto max-w-7xl px-4 pt-20 text-center text-sm text-gray-400">Failed to load: {err}</div>;
  if (!data) {
    return (
      <div className="mx-auto max-w-7xl px-4 pt-6">
        <h1 className="mb-4 text-2xl font-bold text-accent">{TITLES[query] || query}</h1>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="h-52 animate-pulse rounded-xl bg-white/5" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 pt-6">
      <h1 className="mb-4 text-2xl font-bold text-accent">
        {TITLES[query] || query}
      </h1>
      <Grid items={data.response} />
      <Pagination
        page={data.pageInfo.currentPage}
        totalPages={data.pageInfo.totalPages}
        makeHref={(p) => `/explore/${query}?page=${p}`}
      />
      <div className="mt-6 flex flex-wrap gap-2 text-xs">
        {Object.keys(TITLES).map((q) => (
          <Link
            key={q}
            href={`/explore/${q}`}
            className="rounded-full bg-surface px-3 py-1 hover:bg-accent hover:text-black"
          >
            {TITLES[q]}
          </Link>
        ))}
      </div>
    </div>
  );
}

export default function ExploreClient({ initialQuery }) {
  return (
    <Suspense>
      <ExploreInner initialQuery={initialQuery} />
    </Suspense>
  );
}

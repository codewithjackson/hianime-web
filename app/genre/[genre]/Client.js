'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Grid, Pagination } from '../../../components/ui';
import { useRouteId } from '../../../components/client';
import { api } from '../../../lib/api';

function GenreInner({ initialGenre }) {
  const searchParams = useSearchParams();
  const genre = useRouteId(initialGenre);
  const page = Number(searchParams.get('page')) || 1;
  const [data, setData] = useState(null);
  const [err, setErr] = useState('');

  useEffect(() => {
    if (!genre) return;
    setData(null);
    setErr('');
    api.genre(genre, page).then(setData).catch((e) => setErr(String(e?.message || e)));
  }, [genre, page]);

  if (err) return <div className="mx-auto max-w-7xl px-4 pt-20 text-center text-sm text-gray-400">Failed to load: {err}</div>;
  if (!data) {
    return (
      <div className="mx-auto max-w-7xl px-4 pt-6">
        <h1 className="mb-4 text-2xl font-bold capitalize text-accent">{String(genre).replaceAll('-', ' ')} Anime</h1>
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
      <h1 className="mb-4 text-2xl font-bold capitalize text-accent">
        {genre.replaceAll('-', ' ')} Anime
      </h1>
      <Grid items={data.response} />
      <Pagination
        page={data.pageInfo.currentPage}
        totalPages={data.pageInfo.totalPages}
        makeHref={(p) => `/genre/${genre}?page=${p}`}
      />
    </div>
  );
}

export default function GenreClient({ initialGenre }) {
  return (
    <Suspense>
      <GenreInner initialGenre={initialGenre} />
    </Suspense>
  );
}

'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Grid, Pagination } from '../../../components/ui';
import { useRouteId } from '../../../components/client';
import { api } from '../../../lib/api';

function StudiosInner({ initialId }) {
  const searchParams = useSearchParams();
  const id = useRouteId(initialId);
  const page = Number(searchParams.get('page')) || 1;
  const [data, setData] = useState(null);
  const [err, setErr] = useState('');

  useEffect(() => {
    if (!id) return;
    setData(null);
    setErr('');
    api.producer(id, page).then(setData).catch((e) => setErr(String(e?.message || e)));
  }, [id, page]);

  return (
    <div className="mx-auto max-w-7xl px-4 pt-6">
      <h1 className="mb-1 flex items-center gap-2 text-2xl font-bold text-white">
        <span className="h-6 w-1 rounded bg-accent" /> Studio
      </h1>
      <p className="mb-4 text-sm capitalize text-gray-400">{String(id || '').replaceAll('-', ' ')}</p>
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
            makeHref={(p) => `/studios/${id}?page=${p}`}
          />
        </>
      ) : null}
    </div>
  );
}

export default function StudiosClient({ initialId }) {
  return (
    <Suspense>
      <StudiosInner initialId={initialId} />
    </Suspense>
  );
}

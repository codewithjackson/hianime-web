'use client';

import { useEffect, useState } from 'react';
import { api } from '../../lib/api';

export default function GenresPage() {
  const [genres, setGenres] = useState(null);

  useEffect(() => {
    api.meta().then((m) => setGenres(m.genres || [])).catch(() => setGenres([]));
  }, []);

  return (
    <div className="mx-auto max-w-7xl px-4 pt-6">
      <h1 className="mb-1 flex items-center gap-2 text-2xl font-bold text-white">
        <span className="h-6 w-1 rounded bg-accent" /> Genres
      </h1>
      <p className="mb-4 text-sm text-gray-400">{(genres || []).length} genres to explore</p>
      {!genres ? (
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="h-16 animate-pulse rounded-2xl bg-white/5" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {genres.map((g) => (
            <a
              key={g}
              href={`/genre/${g}`}
              className="group rounded-2xl bg-surface/70 p-4 capitalize ring-1 ring-white/5 transition hover:bg-surface hover:ring-accent/60"
            >
              <p className="font-bold text-white group-hover:text-accent">
                {g.replaceAll('-', ' ')}
              </p>
              <p className="mt-1 text-[11px] text-gray-500">Browse titles →</p>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

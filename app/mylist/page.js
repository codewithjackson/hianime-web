'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { AnimeCard } from '../../components/ui';
import { getWatchlist, removeFromWatchlist, clearWatchlist } from '../../components/client';

export default function MyListPage() {
  const [list, setList] = useState(null);

  useEffect(() => {
    document.title = 'My List | Animaze';
    function sync() {
      try {
        setList(getWatchlist());
      } catch {
        setList([]);
      }
    }
    sync();
    window.addEventListener('animaze-watchlist', sync);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener('animaze-watchlist', sync);
      window.removeEventListener('storage', sync);
    };
  }, []);

  if (!list) {
    return (
      <div className="mx-auto max-w-7xl space-y-4 px-4 pt-6">
        <div className="h-40 animate-pulse rounded-2xl bg-white/5" />
        <div className="h-40 animate-pulse rounded-2xl bg-white/5" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 pt-6">
      <div className="mb-4 flex items-center gap-3">
        <h1 className="flex items-center gap-2 text-xl font-bold text-white">
          <span className="h-5 w-1 rounded bg-accent" /> My List
        </h1>
        {list.length ? (
          <span className="rounded-full bg-white/10 px-2 py-0.5 text-xs font-medium text-gray-300">
            {list.length}
          </span>
        ) : null}
        {list.length ? (
          <button
            type="button"
            onClick={() => {
              if (window.confirm('Remove everything from My List?')) clearWatchlist();
            }}
            className="ml-auto rounded-full bg-white/10 px-4 py-1.5 text-xs text-gray-300 transition hover:bg-white/20 hover:text-white"
          >
            Clear all
          </button>
        ) : null}
      </div>

      {list.length ? (
        <div className="grid grid-cols-2 gap-2 min-[420px]:grid-cols-3 sm:grid-cols-4 sm:gap-3 md:grid-cols-5 lg:grid-cols-6 2xl:grid-cols-8">
          {list.map((x) => (
            <div key={x.animeId} className="relative">
              <AnimeCard
                anime={{ id: x.animeId, title: x.title, poster: x.poster }}
                fluid
                qtip={false}
              />
              <button
                type="button"
                onClick={() => removeFromWatchlist(x.animeId)}
                title={`Remove ${x.title || x.animeId} from My List`}
                aria-label={`Remove ${x.title || x.animeId} from My List`}
                className="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-black/75 text-xs text-gray-300 transition hover:bg-red-500 hover:text-white"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl bg-surface/50 p-10 text-center ring-1 ring-white/5">
          <p className="text-lg font-bold text-white">Your list is empty</p>
          <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-gray-400">
            Tap <span className="font-bold text-gray-200">+ Add to List</span> on any anime
            and it will wait for you here — saved privately in your browser, no account needed.
          </p>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
            <Link
              href="/home"
              className="rounded-full bg-accent px-6 py-2 text-sm font-bold text-black transition hover:brightness-110"
            >
              Browse anime →
            </Link>
            <Link
              href="/random"
              className="rounded-full bg-white/10 px-6 py-2 text-sm text-gray-200 transition hover:bg-white/20"
            >
              🎲 Surprise me
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

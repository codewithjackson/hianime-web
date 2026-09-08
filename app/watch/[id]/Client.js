'use client';

import Link from 'next/link';
import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { EpisodeList, RememberProgress, DownloadBox, AutoNext, TheaterToggle, useRouteId } from '../../../components/client';
import { api } from '../../../lib/api';

function WatchInner({ initialId }) {
  const searchParams = useSearchParams();
  const id = useRouteId(initialId);
  const epParam = searchParams.get('ep');
  const type = searchParams.get('type') === 'dub' ? 'dub' : 'sub';
  const serverParam = searchParams.get('server');

  const [info, setInfo] = useState(null);
  const [episodes, setEpisodes] = useState(null);
  const [schedule, setSchedule] = useState(null);
  const [servers, setServers] = useState({ sub: [], dub: [] });
  const [stream, setStream] = useState(null);
  const [streamLoading, setStreamLoading] = useState(true);
  const [seasons, setSeasons] = useState(null);
  const [err, setErr] = useState('');

  useEffect(() => {
    if (!id) return;
    setErr('');
    setEpisodes(null);
    api.anime(id).then(setInfo).catch(() => setInfo(null));
    api.schedule(id).then(setSchedule).catch(() => setSchedule(null));
    api.seasons(id).then(setSeasons).catch(() => setSeasons([]));
    api.episodes(id).then(setEpisodes).catch((e) => setErr(String(e?.message || e)));
  }, [id]);

  const currentEp = epParam || episodes?.[0]?.id;

  useEffect(() => {
    if (!currentEp) return;
    let cancelled = false;
    setStream(null);
    setServers({ sub: [], dub: [] });
    setStreamLoading(true);
    api.servers(currentEp)
      .then(async (s) => {
        if (cancelled) return;
        setServers(s);
        const list = s[type].length ? s[type] : s.sub.length ? s.sub : s.dub;
        const picked = list.find((x) => x.name === serverParam) || list[0];
        if (picked) {
          try {
            const st = await api.stream(currentEp, picked.name, picked.type || type);
            if (!cancelled) setStream(st);
          } catch {
            if (!cancelled) setStream(null);
          }
        }
        if (!cancelled) setStreamLoading(false);
      })
      .catch(() => {
        if (cancelled) return;
        setStream(null);
        setStreamLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [currentEp, type, serverParam]);

  useEffect(() => {
    const title = info?.title || id;
    if (title) document.title = `Watch ${title} | Animaze`;
  }, [info, id]);

  if (err) return <div className="mx-auto max-w-7xl px-4 pt-20 text-center text-sm text-gray-400">Failed to load episodes: {err}</div>;
  if (!episodes) {
    return (
      <div className="mx-auto max-w-7xl space-y-4 px-4 pt-6">
        <div className="aspect-video animate-pulse rounded-2xl bg-white/5" />
        <div className="h-32 animate-pulse rounded-2xl bg-white/5" />
      </div>
    );
  }

  const epNum = episodes.find((e) => String(e.id) === String(currentEp))?.episodeNumber;
  const epIndex = episodes.findIndex((e) => String(e.id) === String(currentEp));
  const prevEp = epIndex > 0 ? episodes[epIndex - 1] : null;
  const nextEp = epIndex >= 0 && epIndex < episodes.length - 1 ? episodes[epIndex + 1] : null;

  return (
    <div className="mx-auto max-w-7xl px-4 pt-6">
      <RememberProgress
        animeId={id}
        title={info?.title}
        poster={info?.poster}
        ep={currentEp}
        epNum={epNum}
        type={type}
      />
      <nav className="mb-3 truncate text-xs text-gray-500">
        <Link href="/" className="hover:text-gray-300">Home</Link>
        {' › '}
        <Link href={`/anime/${id}`} className="hover:text-gray-300">
          {info?.title || id}
        </Link>
        {' › '}
        <span className="text-gray-300">Episode {epNum ?? ''}</span>
      </nav>

      <p className="mb-3 text-center text-sm text-gray-300">
        You are watching <strong className="text-accent">Episode {epNum ?? ''}</strong>
      </p>

      <div id="watch-grid" className="flex min-w-0 flex-col gap-4 lg:grid lg:grid-cols-[260px_minmax(0,1fr)_280px]">
        <aside className="order-2 min-w-0 lg:order-none lg:col-start-1">
          <EpisodeList
            animeId={id}
            episodes={episodes}
            currentEp={currentEp}
            type={type}
          />
        </aside>

        <div className="order-1 min-w-0 lg:order-none lg:col-start-2">
          {schedule?.airDate ? (
            <div className="mb-3 flex items-center gap-2 rounded-2xl bg-accent/10 px-4 py-2.5 text-xs text-gray-200 ring-1 ring-accent/30">
              <span>🚀</span>
              <span>
                Next episode estimated{' '}
                <strong className="text-white">
                  {new Date(schedule.airDate).toLocaleString('en-US', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric',
                    hour: 'numeric',
                    minute: '2-digit',
                  })}
                </strong>
                {typeof schedule.secondsUntil === 'number' && schedule.secondsUntil > 0 ? (
                  <span className="text-accent">
                    {' '}
                    (in {Math.floor(schedule.secondsUntil / 86400)}d{' '}
                    {Math.floor((schedule.secondsUntil % 86400) / 3600)}h)
                  </span>
                ) : null}
              </span>
            </div>
          ) : null}
          <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-black ring-1 ring-white/10">
            {streamLoading ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-sm text-gray-400">
                <span className="h-8 w-8 animate-spin rounded-full border-2 border-white/15 border-t-accent" />
                Loading stream…
              </div>
            ) : stream?.url ? (
              <iframe
                key={stream.url}
                src={stream.url}
                title={`${info?.title || 'Anime'} episode ${epNum ?? ''}`}
                allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
                sandbox="allow-scripts allow-same-origin allow-forms allow-presentation allow-orientation-lock"
                allowFullScreen
                className="absolute inset-0 h-full w-full"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center px-4 text-center text-sm text-gray-400">
                Stream unavailable for this episode — try another server below.
              </div>
            )}
          </div>

          <div className="mt-3 rounded-2xl bg-surface/50 p-4">
            <div className="flex flex-wrap items-center gap-2">
              <TheaterToggle />
              <AutoNext
                nextUrl={
                  nextEp ? `/watch/${id}?ep=${nextEp.id}&type=${type}` : null
                }
                nextLabel={nextEp ? `Episode ${nextEp.episodeNumber}` : ''}
              />
            </div>
          </div>

          <div className="mt-3 rounded-2xl bg-surface/50 p-4">
            <div className="space-y-2.5">
              {[
                ['sub', 'SUB', 'bg-green-500/20 text-green-300'],
                ['dub', 'DUB', 'bg-sky-500/20 text-sky-300'],
              ].map(([t, label, badge]) =>
                servers[t]?.length ? (
                  <div key={t} className="flex flex-wrap items-center gap-2">
                    <span
                      className={`w-16 shrink-0 rounded px-1.5 py-1 text-center text-[11px] font-bold ${badge}`}
                    >
                      {label}
                    </span>
                    {servers[t].map((s) => {
                      const active =
                        type === t &&
                        (serverParam === s.name || (!serverParam && stream?.server === s.name));
                      return (
                        <a
                          key={s.name}
                          href={`/watch/${id}?ep=${currentEp}&type=${t}&server=${s.name}`}
                          className={`rounded-full px-4 py-1.5 text-xs font-medium transition ${
                            active
                              ? 'bg-accent font-bold text-black'
                              : 'bg-white/10 text-gray-200 hover:bg-white/20'
                          }`}
                        >
                          {s.name}
                        </a>
                      );
                    })}
                  </div>
                ) : null
              )}
            </div>
            <p className="mt-2 text-[11px] text-gray-500">
              If the current server doesn&apos;t work, try another one.
            </p>
            <div className="mt-3 flex gap-2">
              {prevEp ? (
                <a
                  href={`/watch/${id}?ep=${prevEp.id}&type=${type}`}
                  className="rounded-full bg-white/10 px-5 py-1.5 text-xs font-bold text-gray-200 transition hover:bg-white/20"
                >
                  ← Ep {prevEp.episodeNumber}
                </a>
              ) : null}
              {nextEp ? (
                <a
                  href={`/watch/${id}?ep=${nextEp.id}&type=${type}`}
                  className="rounded-full bg-white/10 px-5 py-1.5 text-xs font-bold text-gray-200 transition hover:bg-white/20"
                >
                  Ep {nextEp.episodeNumber} →
                </a>
              ) : null}
            </div>
          </div>

          <DownloadBox episodeId={currentEp} type={type} />

          {(!!seasons?.length || !!info?.related?.length) && (
            <section className="mt-6">
              <h2 className="mb-3 text-lg font-bold text-white">
                Watch more seasons of this anime
              </h2>
              {seasons?.length ? (
                <div className="no-scrollbar flex snap-x snap-proximity gap-3 overflow-x-auto pb-2">
                  {seasons
                    .filter((s) => s.id && s.id !== id)
                    .map((s) => (
                      <a
                        key={s.id}
                        href={`/watch/${s.id}`}
                        title={s.title || s.label}
                        className="group w-44 shrink-0 snap-start overflow-hidden rounded-xl bg-surface/70 ring-1 ring-white/5 transition hover:ring-accent/60"
                      >
                        <div className="relative h-24 w-full overflow-hidden bg-black/40">
                          {s.poster ? (
                            <img
                              src={s.poster}
                              alt={s.title || s.label}
                              loading="lazy"
                              className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                            />
                          ) : null}
                          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 to-transparent px-2 pb-1.5 pt-5">
                            <p className="truncate text-xs font-bold text-white">
                              {s.label || s.title}
                            </p>
                          </div>
                        </div>
                        <p className="line-clamp-2 min-h-[2rem] p-2 text-[11px] leading-snug text-gray-300 group-hover:text-accent">
                          {s.title}
                        </p>
                      </a>
                    ))}
                </div>
              ) : (
                <div className="no-scrollbar flex snap-x snap-proximity gap-2 overflow-x-auto pb-2">
                  {info.related
                    .filter((r) => r.id && r.id !== id)
                    .slice(0, 18)
                    .map((r) => (
                      <a
                        key={r.id}
                        href={`/anime/${r.id}`}
                        className="group w-40 shrink-0 snap-start overflow-hidden rounded-xl bg-surface/70 ring-1 ring-white/5 transition hover:ring-accent/60"
                      >
                        <div className="flex h-20 items-center justify-center bg-gradient-to-br from-accent/30 via-surface to-base text-2xl transition group-hover:from-accent/50">
                          🎬
                        </div>
                        <div className="p-2">
                          <p className="line-clamp-2 min-h-[2rem] text-xs font-medium text-gray-100 group-hover:text-accent">
                            {r.title}
                          </p>
                          <p className="mt-1 text-[11px] font-bold text-gray-500 group-hover:text-accent">
                            Watch now →
                          </p>
                        </div>
                      </a>
                    ))}
                </div>
              )}
            </section>
          )}
        </div>

        <aside className="order-3 min-w-0 lg:order-none lg:col-start-3">
          <div className="rounded-2xl bg-surface/50 p-4 ring-1 ring-white/5">
            {info?.poster ? (
              <a href={`/anime/${id}`} className="block">
                <img
                  src={info.poster}
                  alt={info.title}
                  className="hidden w-full rounded-xl object-cover ring-1 ring-white/10 lg:block"
                />
              </a>
            ) : null}
            <a href={`/anime/${id}`} className="hover:text-accent">
              <h1 className="mt-1 text-lg font-bold text-white lg:mt-3">{info?.title || 'Episodes'}</h1>
            </a>
            <div className="mt-2 flex flex-wrap items-center gap-1.5 text-[11px]">
              {info?.rating ? (
                <span className="rounded bg-white px-1 font-bold text-black">{info.rating}</span>
              ) : null}
              <span className="rounded bg-accent px-1.5 font-bold text-black">HD</span>
              {typeof info?.episodes?.sub === 'number' ? (
                <span className="rounded bg-green-500/20 px-1 font-bold text-green-300">
                  CC {info.episodes.sub}
                </span>
              ) : null}
              {typeof info?.episodes?.dub === 'number' ? (
                <span className="rounded bg-sky-500/20 px-1 font-bold text-sky-300">
                  🎙 {info.episodes.dub}
                </span>
              ) : null}
              {info?.type ? <span className="text-gray-400">• {info.type}</span> : null}
            </div>
            {info?.synopsis ? (
              <p className="mt-2 line-clamp-4 text-xs leading-relaxed text-gray-400">
                {info.synopsis}
              </p>
            ) : null}
            <a
              href={`/anime/${id}`}
              className="mt-3 inline-block rounded-full bg-white/10 px-5 py-1.5 text-xs font-bold text-gray-200 transition hover:bg-white/20"
            >
              View detail →
            </a>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default function WatchClient({ initialId }) {
  return (
    <Suspense>
      <WatchInner initialId={initialId} />
    </Suspense>
  );
}

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
  const [err, setErr] = useState('');

  useEffect(() => {
    if (!id) return;
    setErr('');
    setEpisodes(null);
    api.anime(id).then(setInfo).catch(() => setInfo(null));
    api.schedule(id).then(setSchedule).catch(() => setSchedule(null));
    api.episodes(id).then(setEpisodes).catch((e) => setErr(String(e?.message || e)));
  }, [id]);

  const currentEp = epParam || episodes?.[0]?.id;

  useEffect(() => {
    if (!currentEp) return;
    setStream(null);
    setServers({ sub: [], dub: [] });
    api.servers(currentEp)
      .then(async (s) => {
        setServers(s);
        const list = s[type].length ? s[type] : s.sub.length ? s.sub : s.dub;
        const picked = list.find((x) => x.name === serverParam) || list[0];
        if (picked) {
          try {
            const st = await api.stream(currentEp, picked.name, picked.type || type);
            setStream(st);
          } catch {
            setStream(null);
          }
        }
      })
      .catch(() => setStream(null));
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
  const track = servers[type].length ? servers[type] : [];

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

      <div id="watch-grid" className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
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
          <div className="overflow-hidden rounded-2xl bg-black ring-1 ring-white/10">
            {stream?.url ? (
              <iframe
                key={stream.url}
                src={stream.url}
                title={`${info?.title || 'Anime'} episode ${epNum ?? ''}`}
                allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
                sandbox="allow-scripts allow-same-origin allow-forms allow-presentation allow-orientation-lock"
                allowFullScreen
                className="aspect-video w-full"
              />
            ) : (
              <div className="flex aspect-video items-center justify-center text-sm text-gray-400">
                Stream unavailable for this episode.
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
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wide text-gray-400">
                {type} servers:
              </span>
              {['sub', 'dub'].map((t) => (
                <a
                  key={t}
                  href={`/watch/${id}?ep=${currentEp}&type=${t}`}
                  className={`rounded-full px-4 py-1.5 text-xs font-bold uppercase transition ${
                    type === t ? 'bg-accent text-black' : 'bg-white/10 text-gray-200 hover:bg-white/20'
                  }`}
                >
                  {t}
                </a>
              ))}
              <span className="mx-1 h-4 w-px bg-white/10" />
              {track.map((s) => {
                const active =
                  serverParam === s.name || (!serverParam && stream?.server === s.name);
                return (
                  <a
                    key={s.name}
                    href={`/watch/${id}?ep=${currentEp}&type=${type}&server=${s.name}`}
                    className={`rounded-full px-4 py-1.5 text-xs font-medium transition ${
                      active ? 'bg-accent font-bold text-black' : 'bg-white/10 text-gray-200 hover:bg-white/20'
                    }`}
                  >
                    {s.name}
                  </a>
                );
              })}
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
        </div>

        <div className="flex gap-4 lg:col-span-1 lg:flex-col">
          {info?.poster ? (
            <a href={`/anime/${id}`} className="hidden shrink-0 lg:block">
              <img
                src={info.poster}
                alt={info.title}
                className="w-32 rounded-xl object-cover ring-1 ring-white/10"
              />
            </a>
          ) : null}
          <div className="min-w-0 flex-1">
            <a href={`/anime/${id}`} className="hover:text-accent">
              <h1 className="truncate text-lg font-bold text-white">{info?.title || 'Episodes'}</h1>
            </a>
            <div className="mt-2">
              <EpisodeList
                animeId={id}
                episodes={episodes}
                currentEp={currentEp}
                type={type}
              />
            </div>
          </div>
        </div>
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

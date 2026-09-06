import Link from 'next/link';
import { EpisodeList, RememberProgress, DownloadBox, AutoNext, TheaterToggle } from '../../../components/client';
import { api } from '../../../lib/api';

export async function generateMetadata({ params, searchParams }) {
  try {
    const [info, episodes] = await Promise.all([
      api.anime(params.id).catch(() => null),
      api.episodes(params.id).catch(() => []),
    ]);
    const ep = episodes.find((e) => String(e.id) === String(searchParams.ep));
    const epLabel = ep ? ` Episode ${ep.episodeNumber}` : '';
    const title = info?.title || params.id;
    return {
      title: `Watch ${title}${epLabel} | Animaze`,
      description: (info?.synopsis || `Watch ${title}${epLabel} online free in HD.`).slice(0, 160),
      openGraph: {
        title: `${title}${epLabel}`,
        images: info?.poster ? [info.poster] : [],
      },
    };
  } catch {
    return { title: 'Watch Anime | Animaze' };
  }
}

export default async function WatchPage({ params, searchParams }) {
  const [info, episodes, schedule] = await Promise.all([
    api.anime(params.id).catch(() => null),
    api.episodes(params.id),
    api.schedule(params.id).catch(() => null),
  ]);
  const currentEp = searchParams.ep || episodes[0]?.id;
  const type = searchParams.type === 'dub' ? 'dub' : 'sub';

  let servers = { sub: [], dub: [] };
  let stream = null;
  try {
    servers = await api.servers(currentEp);
    const list = servers[type].length
      ? servers[type]
      : servers.sub.length
        ? servers.sub
        : servers.dub;
    const picked = list.find((s) => s.name === searchParams.server) || list[0];
    if (picked) stream = await api.stream(currentEp, picked.name, picked.type || type);
  } catch {
    stream = null;
  }

  const epNum = episodes.find((e) => String(e.id) === String(currentEp))?.episodeNumber;
  const epIndex = episodes.findIndex((e) => String(e.id) === String(currentEp));
  const prevEp = epIndex > 0 ? episodes[epIndex - 1] : null;
  const nextEp = epIndex >= 0 && epIndex < episodes.length - 1 ? episodes[epIndex + 1] : null;
  const track = servers[type].length ? servers[type] : [];

  return (
    <div className="mx-auto max-w-7xl px-4 pt-6">
      <RememberProgress
        animeId={params.id}
        title={info?.title}
        poster={info?.poster}
        ep={currentEp}
        epNum={epNum}
        type={type}
      />
      <nav className="mb-3 truncate text-xs text-gray-500">
        <Link href="/" className="hover:text-gray-300">Home</Link>
        {' › '}
        <Link href={`/anime/${params.id}`} className="hover:text-gray-300">
          {info?.title || params.id}
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
                sandbox="allow-scripts allow-same-origin allow-forms allow-presentation"
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
                  nextEp ? `/watch/${params.id}?ep=${nextEp.id}&type=${type}` : null
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
                <Link
                  key={t}
                  href={`/watch/${params.id}?ep=${currentEp}&type=${t}`}
                  className={`rounded-full px-4 py-1.5 text-xs font-bold uppercase transition ${
                    type === t ? 'bg-accent text-black' : 'bg-white/10 text-gray-200 hover:bg-white/20'
                  }`}
                >
                  {t}
                </Link>
              ))}
              <span className="mx-1 h-4 w-px bg-white/10" />
              {track.map((s) => {
                const active =
                  searchParams.server === s.name || (!searchParams.server && stream?.server === s.name);
                return (
                  <Link
                    key={s.name}
                    href={`/watch/${params.id}?ep=${currentEp}&type=${type}&server=${s.name}`}
                    className={`rounded-full px-4 py-1.5 text-xs font-medium transition ${
                      active ? 'bg-accent font-bold text-black' : 'bg-white/10 text-gray-200 hover:bg-white/20'
                    }`}
                  >
                    {s.name}
                  </Link>
                );
              })}
            </div>
            <p className="mt-2 text-[11px] text-gray-500">
              If the current server doesn&apos;t work, try another one.
            </p>
            <div className="mt-3 flex gap-2">
              {prevEp ? (
                <Link
                  href={`/watch/${params.id}?ep=${prevEp.id}&type=${type}`}
                  className="rounded-full bg-white/10 px-5 py-1.5 text-xs font-bold text-gray-200 transition hover:bg-white/20"
                >
                  ← Ep {prevEp.episodeNumber}
                </Link>
              ) : null}
              {nextEp ? (
                <Link
                  href={`/watch/${params.id}?ep=${nextEp.id}&type=${type}`}
                  className="rounded-full bg-white/10 px-5 py-1.5 text-xs font-bold text-gray-200 transition hover:bg-white/20"
                >
                  Ep {nextEp.episodeNumber} →
                </Link>
              ) : null}
            </div>
          </div>

          <DownloadBox episodeId={currentEp} type={type} />
        </div>

        <div className="flex gap-4 lg:col-span-1 lg:flex-col">
          {info?.poster ? (
            <Link href={`/anime/${params.id}`} className="hidden shrink-0 lg:block">
              <img
                src={info.poster}
                alt={info.title}
                className="w-32 rounded-xl object-cover ring-1 ring-white/10"
              />
            </Link>
          ) : null}
          <div className="min-w-0 flex-1">
            <Link href={`/anime/${params.id}`} className="hover:text-accent">
              <h1 className="truncate text-lg font-bold text-white">{info?.title || 'Episodes'}</h1>
            </Link>
            <div className="mt-2">
              <EpisodeList
                animeId={params.id}
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

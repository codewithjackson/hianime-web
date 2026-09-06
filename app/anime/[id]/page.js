import Link from 'next/link';
import { AnimeCard } from '../../../components/ui';
import { Synopsis, CastSection } from '../../../components/client';
import { api } from '../../../lib/api';

export async function generateMetadata({ params }) {
  try {
    const a = await api.anime(params.id);
    const desc = (a.synopsis || `Watch ${a.title} online free in HD.`).slice(0, 160);
    return {
      title: `${a.title} — Watch Online | Animaze`,
      description: desc,
      openGraph: {
        title: a.title,
        description: desc,
        images: a.poster ? [a.poster] : [],
      },
    };
  } catch {
    return { title: 'Anime Details | Animaze' };
  }
}

function Badge({ children, className }) {
  return (
    <span className={`rounded px-1.5 py-0.5 text-[11px] font-bold ${className}`}>
      {children}
    </span>
  );
}

export default async function AnimePage({ params }) {
  const a = await api.anime(params.id);
  return (
    <>
      <div className="relative overflow-hidden">
        {a.poster ? (
          <img
            src={a.poster}
            alt=""
            className="absolute inset-0 h-full w-full scale-110 object-cover opacity-40 blur-2xl"
          />
        ) : null}
        <div className="absolute inset-0 bg-gradient-to-r from-base/80 via-base/40 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-base to-transparent" />
        <div className="relative mx-auto max-w-7xl px-4 pb-10 pt-8">
          <nav className="mb-5 truncate text-xs text-gray-400">
            <Link href="/" className="hover:text-gray-200">Home</Link>
            {' • '}
            <Link href="/explore/tv" className="hover:text-gray-200">
              {a.type || 'TV'}
            </Link>
            {' • '}
            <span className="text-gray-300">{a.title}</span>
          </nav>
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="flex flex-col gap-5 sm:flex-row lg:col-span-2">
              {a.poster ? (
                <img
                  src={a.poster}
                  alt={a.title}
                  className="w-40 shrink-0 self-start rounded-lg object-cover shadow-2xl shadow-black/60 ring-1 ring-white/10 sm:w-48"
                />
              ) : null}
              <div className="min-w-0">
                <h1 className="text-3xl font-black text-white sm:text-4xl">{a.title}</h1>
                {a.alternativeTitle && a.alternativeTitle !== a.title ? (
                  <p className="mt-1 text-sm text-gray-300">{a.alternativeTitle}</p>
                ) : null}
                <div className="mt-3 flex flex-wrap items-center gap-1.5 text-xs text-gray-200">
                  {a.rating ? <Badge className="bg-white text-black">{a.rating}</Badge> : null}
                  <Badge className="bg-accent text-black">HD</Badge>
                  {typeof a.episodes?.sub === 'number' ? (
                    <Badge className="bg-green-500/25 text-green-300">CC {a.episodes.sub}</Badge>
                  ) : null}
                  {typeof a.episodes?.dub === 'number' ? (
                    <Badge className="bg-sky-500/25 text-sky-300">🎙 {a.episodes.dub}</Badge>
                  ) : null}
                  {typeof a.episodes?.eps === 'number' ? (
                    <Badge className="bg-white/15 text-gray-200">{a.episodes.eps}</Badge>
                  ) : null}
                  {a.type ? <span>• {a.type}</span> : null}
                  {a.duration ? <span>• {a.duration}</span> : null}
                </div>
                <div className="mt-4">
                  <Link
                    href={`/watch/${a.id}`}
                    className="rounded-full bg-accent px-7 py-2.5 text-sm font-bold text-black transition hover:brightness-110"
                  >
                    ▶ Watch now
                  </Link>
                </div>
                <div className="mt-4">
                  <Synopsis text={a.synopsis} />
                </div>
                <p className="mt-3 max-w-3xl text-xs leading-relaxed text-gray-400">
                  Watch <strong className="text-gray-200">{a.title}</strong> SUB and DUB
                  online free in HD on Animaze.
                  {a.studios?.length ? (
                    <> Find more <strong className="text-gray-200">{a.studios[0]}</strong> anime here.</>
                  ) : null}
                </p>
              </div>
            </div>
            <aside className="h-fit rounded-2xl bg-white/10 p-5 text-sm backdrop-blur-md ring-1 ring-white/10">
              <dl className="space-y-2.5">
                {a.alternativeTitle && a.alternativeTitle !== a.title ? (
                  <div className="flex gap-2">
                    <dt className="w-20 shrink-0 font-bold text-white">Japanese:</dt>
                    <dd className="text-gray-200">{a.alternativeTitle}</dd>
                  </div>
                ) : null}
                {a.synonyms ? (
                  <div className="flex gap-2">
                    <dt className="w-20 shrink-0 font-bold text-white">Synonyms:</dt>
                    <dd className="text-gray-200">{a.synonyms}</dd>
                  </div>
                ) : null}
                {(a.aired?.from || a.aired?.to) ? (
                  <div className="flex gap-2">
                    <dt className="w-20 shrink-0 font-bold text-white">Aired:</dt>
                    <dd className="text-gray-200">
                      {[a.aired.from, a.aired.to].filter(Boolean).join(' to ')}
                    </dd>
                  </div>
                ) : null}
                {a.duration ? (
                  <div className="flex gap-2">
                    <dt className="w-20 shrink-0 font-bold text-white">Duration:</dt>
                    <dd className="text-gray-200">{a.duration}</dd>
                  </div>
                ) : null}
                {a.status ? (
                  <div className="flex gap-2">
                    <dt className="w-20 shrink-0 font-bold text-white">Status:</dt>
                    <dd className="text-gray-200">{a.status}</dd>
                  </div>
                ) : null}
                {a.MAL_score ? (
                  <div className="flex gap-2">
                    <dt className="w-20 shrink-0 font-bold text-white">MAL Score:</dt>
                    <dd className="text-gray-200">{a.MAL_score}</dd>
                  </div>
                ) : null}
              </dl>
              {!!a.genres?.length && (
                <div className="mt-4 border-t border-white/10 pt-3">
                  <p className="mb-2 font-bold text-white">Genres:</p>
                  <div className="flex flex-wrap gap-1.5">
                    {a.genres.map((g) => (
                      <Link
                        key={g}
                        href={`/genre/${String(g).toLowerCase().replaceAll(' ', '-')}`}
                        className="rounded-full border border-white/25 px-2.5 py-0.5 text-[11px] text-gray-200 transition hover:border-accent hover:text-accent"
                      >
                        {g}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
              {!!a.studios?.length && (
                <div className="mt-3">
                  <span className="font-bold text-white">Studios: </span>
                  {a.studios.map((s, i) => (
                    <span key={s}>
                      <Link
                        href={`/studios/${String(s).toLowerCase().replaceAll(' ', '-')}`}
                        className="text-gray-200 hover:text-accent"
                      >
                        {s}
                      </Link>
                      {i < a.studios.length - 1 ? ', ' : ''}
                    </span>
                  ))}
                </div>
              )}
            </aside>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4">
        <CastSection items={a.characters} />
        <div className="mt-10 grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            {!!a.recommended?.length && (
              <section>
                <h2 className="mb-4 text-xl font-bold text-accent">Recommended For You</h2>
                <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 xl:grid-cols-5">
                  {a.recommended.slice(0, 10).map((r) => (
                    <AnimeCard key={r.id} anime={r} fluid />
                  ))}
                </div>
              </section>
            )}
          </div>
          <aside>
            {!!a.mostPopular?.length && (
              <section>
                <h2 className="mb-4 text-xl font-bold text-accent">Most Popular</h2>
                <ol className="space-y-1">
                  {a.mostPopular.slice(0, 7).map((p, n) => (
                    <li key={p.id}>
                      <Link
                        href={`/anime/${p.id}`}
                        className="group flex items-center gap-3 rounded-xl p-2 transition hover:bg-surface"
                      >
                        {p.poster ? (
                          <img src={p.poster} alt="" loading="lazy" className="h-16 w-12 shrink-0 rounded-md object-cover" />
                        ) : null}
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium text-white group-hover:text-accent">
                            {p.title}
                          </p>
                          <p className="mt-1 flex items-center gap-1.5 text-[11px] text-gray-400">
                            {typeof p.episodes?.sub === 'number' ? (
                              <span className="rounded bg-green-500/20 px-1 font-bold text-green-300">
                                CC {p.episodes.sub}
                              </span>
                            ) : null}
                            {typeof p.episodes?.dub === 'number' ? (
                              <span className="rounded bg-sky-500/20 px-1 font-bold text-sky-300">
                                🎙 {p.episodes.dub}
                              </span>
                            ) : null}
                            {p.type ? <span>• {p.type}</span> : null}
                          </p>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ol>
              </section>
            )}
          </aside>
        </div>
      </div>
    </>
  );
}

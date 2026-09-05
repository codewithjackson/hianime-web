import Link from 'next/link';
import { api } from '../../../lib/api';

export async function generateMetadata({ params }) {
  try {
    const a = await api.anime(params.id);
    const desc = (a.synopsis || `Watch ${a.title} online free in HD.`).slice(0, 160);
    return {
      title: `${a.title} — Watch Online | HiAnime`,
      description: desc,
      openGraph: {
        title: a.title,
        description: desc,
        images: a.poster ? [a.poster] : [],
      },
    };
  } catch {
    return { title: 'Anime Details | HiAnime' };
  }
}

function InfoRow({ label, children }) {
  if (!children) return null;
  return (
    <div className="flex gap-2 text-sm">
      <span className="w-24 shrink-0 text-gray-500">{label}</span>
      <span className="text-gray-200">{children}</span>
    </div>
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
            className="absolute inset-0 h-full w-full scale-110 object-cover opacity-25 blur-md"
          />
        ) : null}
        <div className="absolute inset-0 bg-gradient-to-t from-base via-base/70 to-base/30" />
        <div className="relative mx-auto flex max-w-7xl flex-col gap-6 px-4 pb-8 pt-10 md:flex-row">
          {a.poster ? (
            <img
              src={a.poster}
              alt={a.title}
              className="w-36 shrink-0 rounded-xl object-cover shadow-2xl shadow-black/60 ring-1 ring-white/10 sm:w-44 md:w-56"
            />
          ) : null}
          <div className="min-w-0">
            <h1 className="text-2xl font-black text-white sm:text-3xl md:text-5xl">{a.title}</h1>
            {a.alternativeTitle && a.alternativeTitle !== a.title ? (
              <p className="mt-1 text-sm text-gray-400">{a.alternativeTitle}</p>
            ) : null}
            <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
              {a.rating ? (
                <span className="rounded border border-white/40 px-1.5 py-0.5 font-bold text-gray-200">
                  {a.rating}
                </span>
              ) : null}
              <span className="rounded bg-white px-1.5 py-0.5 font-bold text-black">HD</span>
              {a.type ? <span className="text-gray-200">● {a.type}</span> : null}
              {a.duration ? <span className="text-gray-200">● {a.duration}</span> : null}
              {a.status ? <span className="text-gray-200">● {a.status}</span> : null}
              {typeof a.episodes?.sub === 'number' ? (
                <span className="rounded bg-green-500/20 px-1.5 py-0.5 font-bold text-green-300">
                  SUB {a.episodes.sub}
                </span>
              ) : null}
              {typeof a.episodes?.dub === 'number' ? (
                <span className="rounded bg-sky-500/20 px-1.5 py-0.5 font-bold text-sky-300">
                  DUB {a.episodes.dub}
                </span>
              ) : null}
              {a.MAL_score ? (
                <span className="text-amber-300">★ MAL {a.MAL_score}</span>
              ) : null}
            </div>
            <p className="mt-4 max-w-3xl text-sm leading-relaxed text-gray-300">{a.synopsis}</p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link
                href={`/watch/${a.id}`}
                className="rounded-full bg-accent px-7 py-2.5 text-sm font-bold text-black transition hover:brightness-110"
              >
                ▶ Watch Now
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4">
        <div className="mt-6 grid gap-6 rounded-2xl bg-surface/50 p-5 md:grid-cols-2">
          <div className="space-y-2">
            <InfoRow label="Aired">
              {[a.aired?.from, a.aired?.to].filter(Boolean).join(' to ') || null}
            </InfoRow>
            <InfoRow label="Premiered">{a.premiered}</InfoRow>
            <InfoRow label="Duration">{a.duration}</InfoRow>
            <InfoRow label="Status">{a.status}</InfoRow>
            <InfoRow label="Synonyms">{a.synonyms}</InfoRow>
          </div>
          <div className="space-y-2">
            <InfoRow label="Genres">
              <span className="flex flex-wrap gap-1">
                {(a.genres || []).map((g) => (
                  <Link
                    key={g}
                    href={`/genre/${String(g).toLowerCase().replaceAll(' ', '-')}`}
                    className="rounded-full bg-white/10 px-2.5 py-0.5 text-xs hover:bg-accent hover:text-black"
                  >
                    {g}
                  </Link>
                ))}
              </span>
            </InfoRow>
            <InfoRow label="Studios">
              <span className="flex flex-wrap gap-1">
                {(a.studios || []).map((s) => (
                  <Link
                    key={s}
                    href={`/studios/${String(s).toLowerCase().replaceAll(' ', '-')}`}
                    className="rounded-full bg-white/10 px-2.5 py-0.5 text-xs hover:bg-accent hover:text-black"
                  >
                    {s}
                  </Link>
                ))}
              </span>
            </InfoRow>
            <InfoRow label="Producers">{(a.producers || []).join(', ') || null}</InfoRow>
          </div>
        </div>

        {a.related?.length ? (
          <section className="mt-8">
            <h2 className="mb-3 flex items-center gap-2 text-xl font-bold text-white">
              <span className="h-5 w-1 rounded bg-accent" /> Related Anime
            </h2>
            <div className="flex flex-wrap gap-2">
              {a.related.slice(0, 18).map((r) => (
                <Link
                  key={r.id}
                  href={`/anime/${r.id}`}
                  className="rounded-full bg-surface/70 px-4 py-1.5 text-xs text-gray-200 ring-1 ring-white/5 transition hover:bg-accent hover:text-black"
                >
                  {r.title}
                </Link>
              ))}
            </div>
          </section>
        ) : null}
        {a.recommended?.length ? (
          <section className="mt-8">
            <h2 className="mb-3 flex items-center gap-2 text-xl font-bold text-white">
              <span className="h-5 w-1 rounded bg-accent" /> Recommended
            </h2>
            <div className="flex flex-wrap gap-2">
              {a.recommended.slice(0, 18).map((r) => (
                <Link
                  key={r.id}
                  href={`/anime/${r.id}`}
                  className="rounded-full bg-surface/70 px-4 py-1.5 text-xs text-gray-200 ring-1 ring-white/5 transition hover:bg-accent hover:text-black"
                >
                  {r.title}
                </Link>
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </>
  );
}

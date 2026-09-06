import Link from 'next/link';
import { api } from '../lib/api';

export const metadata = {
  title: 'Animaze — Watch Anime Online Free in HD',
  description:
    'Watch subbed and dubbed anime online free in HD. No account needed — search thousands of titles and start watching.',
};

export default async function LandingPage() {
  const home = await api.home().catch(() => null);
  const top = (home?.topTen?.today || []).slice(0, 10);
  const posters = (home?.trending || []).slice(0, 5);

  return (
    <>
      <div className="mx-auto max-w-7xl px-4 pt-6 md:pt-10">
        <div className="relative overflow-hidden rounded-[2rem] bg-surface/60 ring-1 ring-white/5">
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-accent/10 via-transparent to-transparent" />
          <div className="relative grid gap-6 p-6 sm:p-10 md:grid-cols-2 md:p-14">
            <div>
              <p className="text-4xl font-black tracking-tight text-white sm:text-5xl">
                Ani<span className="text-accent">maze</span>
              </p>
              <form action="/browse" method="get" className="mt-6 flex gap-2">
                <input
                  name="keyword"
                  required
                  placeholder="Search anime..."
                  className="w-full rounded-2xl bg-white px-5 py-3 text-sm text-black outline-none placeholder:text-gray-500 focus:ring-2 focus:ring-accent"
                />
                <button
                  type="submit"
                  aria-label="Search"
                  className="shrink-0 rounded-2xl bg-accent px-5 text-lg font-bold text-black transition hover:brightness-110"
                >
                  ⌕
                </button>
              </form>
              {top.length ? (
                <p className="mt-4 text-xs leading-relaxed text-gray-300">
                  <span className="font-bold text-white">Top search:</span>{' '}
                  {top.map((a, i) => (
                    <span key={a.id}>
                      <Link href={`/anime/${a.id}`} className="hover:text-accent">
                        {a.title}
                      </Link>
                      {i < top.length - 1 ? ', ' : ''}
                    </span>
                  ))}
                </p>
              ) : null}
              <Link
                href="/home"
                className="mt-6 inline-block rounded-2xl bg-accent px-8 py-3 text-sm font-bold text-black transition hover:brightness-110"
              >
                Watch anime →
              </Link>
            </div>
            {posters.length ? (
              <div className="relative hidden min-h-[280px] items-center justify-center md:flex">
                {posters.map((a, i) => (
                  <Link
                    key={a.id}
                    href={`/anime/${a.id}`}
                    className="absolute w-36 overflow-hidden rounded-xl shadow-2xl shadow-black/60 ring-1 ring-white/10 transition hover:z-10 hover:scale-105 xl:w-44"
                    style={{
                      transform: `rotate(${(i - 2) * 9}deg) translateX(${(i - 2) * 90}px)`,
                      zIndex: i,
                    }}
                  >
                    {a.poster ? (
                      <img src={a.poster} alt={a.title} className="h-56 w-full object-cover xl:h-64" />
                    ) : null}
                  </Link>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-4xl space-y-8 px-4 py-12 text-sm leading-relaxed text-gray-300">
        <section>
          <h1 className="text-xl font-bold text-white">
            Animaze — the best site to watch anime online for free
          </h1>
          <p className="mt-3">
            Looking for one place to watch everything from timeless classics to
            this season&apos;s simulcasts? Animaze brings thousands of subbed and
            dubbed anime series and movies together in a fast, clean interface —
            no account, no fees, just press play.
          </p>
        </section>
        <section>
          <h2 className="text-lg font-bold text-white">1/ What is Animaze?</h2>
          <p className="mt-2">
            Animaze is a free anime discovery and streaming front-end. Search any
            title, browse by genre or studio, keep a continue-watching list in
            your browser, and stream episodes in HD with subtitles or dubs where
            available.
          </p>
        </section>
        <section>
          <h2 className="text-lg font-bold text-white">2/ Do I need an account?</h2>
          <p className="mt-2">
            No. Everything works without signing up — your continue-watching
            list lives privately in your own browser, so there is nothing to
            register and nothing stored about you on our servers.
          </p>
        </section>
        <section>
          <h2 className="text-lg font-bold text-white">3/ Why watch here?</h2>
          <ul className="mt-2 list-disc space-y-2 pl-5">
            <li>
              <strong className="text-white">Huge library:</strong> popular hits,
              hidden gems and ongoing series across every genre — action, drama,
              romance, fantasy, horror, sports and more.
            </li>
            <li>
              <strong className="text-white">HD quality:</strong> crisp streams
              with sub and dub tracks plus subtitle options on supported titles.
            </li>
            <li>
              <strong className="text-white">Fast &amp; simple:</strong> search
              with live suggestions, A–Z browsing, studio pages and filters that
              get you watching in seconds.
            </li>
            <li>
              <strong className="text-white">Any device:</strong> a responsive
              layout that works on phones, tablets and big desktop monitors.
            </li>
          </ul>
          <p className="mt-3">
            If you enjoy it, bookmark the site and spread the word. Thank you!
          </p>
          <Link
            href="/home"
            className="mt-4 inline-block rounded-full bg-accent px-6 py-2 text-sm font-bold text-black transition hover:brightness-110"
          >
            Start watching →
          </Link>
        </section>
      </div>
    </>
  );
}

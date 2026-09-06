'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

export function Header() {
  const router = useRouter();
  const [q, setQ] = useState('');
  const [suggest, setSuggest] = useState([]);
  const [genres, setGenres] = useState([]);
  const [showGenres, setShowGenres] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const timer = useRef(null);
  const boxRef = useRef(null);
  // Same-origin proxy keeps the API key server-side.
  const base = '/api/proxy';

  function clearSearch() {
    setQ('');
    setSuggest([]);
  }

  useEffect(() => {
    function onDown(e) {
      if (boxRef.current && !boxRef.current.contains(e.target)) setSuggest([]);
    }
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, []);

  useEffect(() => {
    fetch(`${base}/meta`)
      .then((r) => r.json())
      .then((j) => setGenres(j.data?.genres || []))
      .catch(() => setGenres([]));
  }, [base]);

  useEffect(() => {
    if (!q.trim()) {
      setSuggest([]);
      return;
    }
    clearTimeout(timer.current);
    timer.current = setTimeout(async () => {
      try {
        const res = await fetch(`${base}/suggestion?keyword=${encodeURIComponent(q)}`);
        const json = await res.json();
        setSuggest((json.data || []).slice(0, 6));
      } catch {
        setSuggest([]);
      }
    }, 350);
    return () => clearTimeout(timer.current);
  }, [q, base]);

  const MENU_LINKS = [
    ['Home', '/home'],
    ['Subbed Anime', '/explore/subbed-anime'],
    ['Dubbed Anime', '/explore/dubbed-anime'],
    ['Most Popular', '/explore/most-popular'],
    ['Movies', '/explore/movie'],
    ['TV Series', '/explore/tv'],
    ['OVAs', '/explore/ova'],
    ['ONAs', '/explore/ona'],
    ['Specials', '/explore/special'],
  ];

  return (
    <>
    <header className="sticky top-0 z-50 border-b border-white/5 bg-base/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3 sm:gap-4">
        <button
          onClick={() => setMenuOpen(true)}
          aria-label="Open menu"
          className="flex h-9 w-9 shrink-0 flex-col items-center justify-center gap-1 rounded-lg transition hover:bg-white/10"
        >
          <span className="h-0.5 w-5 rounded bg-gray-200" />
          <span className="h-0.5 w-5 rounded bg-gray-200" />
          <span className="h-0.5 w-5 rounded bg-gray-200" />
        </button>
        <Link href="/" className="shrink-0 text-xl font-black tracking-tight text-accent sm:text-2xl">
          HiAnime
        </Link>
        <nav className="hidden items-center gap-5 text-sm font-medium text-gray-300 lg:flex">
          <Link href="/home" className="hover:text-white">Home</Link>
          <Link href="/explore/movie" className="hover:text-white">Movies</Link>
          <Link href="/explore/tv" className="hover:text-white">TV Series</Link>
          <div
            className="relative"
            onMouseEnter={() => setShowGenres(true)}
            onMouseLeave={() => setShowGenres(false)}
          >
            <Link href="/browse" className="hover:text-white">
              Genres ▾
            </Link>
            {showGenres && genres.length ? (
              <div className="absolute left-0 top-full z-50 w-[calc(100vw-2rem)] max-w-[480px] rounded-xl bg-surface p-3 shadow-2xl ring-1 ring-white/10">
                <div className="mb-2 flex items-center justify-between px-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500">
                    Top genres
                  </span>
                  <Link href="/genres" className="text-[11px] font-bold text-accent hover:underline">
                    View all →
                  </Link>
                </div>
                <div className="grid max-h-96 grid-cols-4 gap-1 overflow-y-auto">
                  {genres.map((g) => (
                    <Link
                      key={g}
                      href={`/genre/${g}`}
                      className="rounded px-2 py-1 text-xs capitalize text-gray-300 hover:bg-accent hover:text-black"
                    >
                      {g.replaceAll('-', ' ')}
                    </Link>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
          <Link href="/az-list/all" className="hover:text-white">A–Z</Link>
          <Link
            href="/random"
            title="Random anime"
            className="flex h-8 w-8 items-center justify-center rounded-full bg-surface text-sm transition hover:bg-accent hover:text-black"
          >
            🎲
          </Link>
          <Link href="/explore/most-popular" className="hover:text-white">Most Popular</Link>
          <Link href="/explore/top-upcoming" className="hover:text-white">Top Upcoming</Link>
        </nav>
        <div ref={boxRef} className="relative ml-auto w-full max-w-[9rem] sm:max-w-xs">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (q.trim()) {
                router.push(`/browse?keyword=${encodeURIComponent(q)}`);
                clearSearch();
              }
            }}
          >
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Escape') {
                  clearSearch();
                  e.target.blur();
                }
              }}
              placeholder="Search anime..."
              className="w-full rounded-full bg-surface px-4 py-1.5 text-sm outline-none placeholder:text-gray-500 focus:ring-2 focus:ring-accent"
            />
          </form>
          {suggest.length > 0 ? (
            <div className="absolute z-50 mt-1 w-full overflow-hidden rounded-lg bg-surface shadow-2xl ring-1 ring-white/10">
              {suggest.map((s) => (
                <Link
                  key={s.id}
                  href={`/anime/${s.id}`}
                  onClick={clearSearch}
                  className="flex items-center gap-2 px-2 py-1.5 hover:bg-white/10"
                >
                  {s.poster ? (
                    <img src={s.poster} alt="" className="h-10 w-8 rounded object-cover" />
                  ) : null}
                  <span className="text-xs">{s.title}</span>
                </Link>
              ))}
            </div>
          ) : null}
        </div>
      </div>
      <div className="border-t border-white/5 lg:hidden">
        <nav className="no-scrollbar mx-auto flex max-w-7xl items-center gap-4 overflow-x-auto px-4 py-2 text-xs text-gray-300">
          <Link href="/explore/subbed-anime" className="shrink-0">Subbed</Link>
          <Link href="/explore/dubbed-anime" className="shrink-0">Dubbed</Link>
          <Link href="/explore/most-popular" className="shrink-0">Most Popular</Link>
          <Link href="/explore/movie" className="shrink-0">Movies</Link>
          <Link href="/explore/tv" className="shrink-0">TV Series</Link>
        </nav>
      </div>
      </header>
      {menuOpen ? (
        <div
          className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm"
          onClick={() => setMenuOpen(false)}
        />
      ) : null}
      <aside
        className={`fixed inset-y-0 left-0 z-[61] flex w-72 max-w-[85vw] flex-col bg-[#2b2a3f] shadow-2xl transition-transform duration-300 ${
          menuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <button
          onClick={() => setMenuOpen(false)}
          className="flex items-center gap-1 px-5 py-4 text-sm font-bold text-gray-200 hover:text-white"
        >
          ‹ Close menu
        </button>
        <nav className="flex-1 overflow-y-auto pb-6">
          {MENU_LINKS.map(([label, href]) => (
            <Link
              key={href}
              href={href}
              onClick={() => setMenuOpen(false)}
              className="block border-b border-white/5 px-5 py-2.5 text-sm font-bold text-gray-100 transition hover:bg-white/5 hover:text-accent"
            >
              {label}
            </Link>
          ))}
          <p className="px-5 pb-1 pt-4 text-sm font-bold text-gray-100">Genre</p>
          <div className="grid grid-cols-2 gap-x-2 px-5">
            {(genres.length ? genres.slice(0, 15) : []).map((g) => (
              <Link
                key={g}
                href={`/genre/${g}`}
                onClick={() => setMenuOpen(false)}
                className="py-1 text-xs capitalize text-gray-300 hover:text-accent"
              >
                {g.replaceAll('-', ' ')}
              </Link>
            ))}
          </div>
          <Link
            href="/genres"
            onClick={() => setMenuOpen(false)}
            className="block px-5 py-2 text-xs font-bold text-gray-200 hover:text-accent"
          >
            + More
          </Link>
        </nav>
      </aside>
    </>
  );
}

function MetaPills({ item }) {
  return (
    <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
      {item.quality ? (
        <span className="rounded bg-white px-1.5 py-0.5 font-bold text-black">{item.quality}</span>
      ) : null}
      {item.rating ? (
        <span className="rounded border border-white/40 px-1.5 py-0.5 text-gray-200">{item.rating}</span>
      ) : null}
      {item.type ? <span className="text-gray-200">● {item.type}</span> : null}
      {item.duration ? <span className="text-gray-200">● {item.duration}</span> : null}
      {item.aired ? <span className="text-gray-200">● {item.aired}</span> : null}
      {item.episodes?.sub ? (
        <span className="rounded bg-green-500/20 px-1.5 py-0.5 font-bold text-green-300">
          SUB {item.episodes.sub}
        </span>
      ) : null}
      {item.episodes?.dub ? (
        <span className="rounded bg-sky-500/20 px-1.5 py-0.5 font-bold text-sky-300">
          DUB {item.episodes.dub}
        </span>
      ) : null}
    </div>
  );
}

export function Spotlight({ items }) {
  const [i, setI] = useState(0);
  useEffect(() => {
    if (!items?.length) return;
    const t = setInterval(() => setI((v) => (v + 1) % items.length), 8000);
    return () => clearInterval(t);
  }, [items?.length]);
  if (!items?.length) return null;
  const cur = items[i % items.length];
  const art = cur.banner || cur.poster;
  return (
    <div className="relative overflow-hidden bg-black">
      {art ? (
        <img
          key={art}
          src={art}
          alt=""
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
      ) : null}
      <div className="absolute inset-0 bg-gradient-to-r from-base via-base/80 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-base to-transparent" />
      <div className="relative mx-auto max-w-7xl px-4 py-12 sm:py-16 md:py-24">
        <p className="text-sm font-bold tracking-wide text-accent">#{cur.rank} Spotlight</p>
        <h1 className="mt-2 max-w-2xl text-3xl font-black leading-tight text-white sm:text-4xl md:text-6xl">
          {cur.title}
        </h1>
        {cur.alternativeTitle && cur.alternativeTitle !== cur.title ? (
          <p className="mt-1 text-sm text-gray-400">{cur.alternativeTitle}</p>
        ) : null}
        <MetaPills item={cur} />
        <p className="line-clamp-2 mt-4 max-w-xl text-sm leading-relaxed text-gray-300">
          {cur.synopsis}
        </p>
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <Link
            href={`/watch/${cur.id}`}
            className="rounded-full bg-accent px-7 py-2.5 text-sm font-bold text-black transition hover:brightness-110"
          >
            ▶ Watch Now
          </Link>
          <Link
            href={`/anime/${cur.id}`}
            className="rounded-full bg-white/10 px-7 py-2.5 text-sm font-medium text-white ring-1 ring-white/20 transition hover:bg-white/20"
          >
            Detail
          </Link>
          <div className="ml-2 flex items-center gap-2">
            <button
              onClick={() => setI((i - 1 + items.length) % items.length)}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
              aria-label="previous"
            >
              ‹
            </button>
            <button
              onClick={() => setI((i + 1) % items.length)}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
              aria-label="next"
            >
              ›
            </button>
          </div>
        </div>
        <div className="mt-6 flex gap-1.5">
          {items.slice(0, 10).map((_, n) => (
            <button
              key={n}
              onClick={() => setI(n)}
              className={`h-1 rounded-full transition-all ${n === i % items.length ? 'w-8 bg-accent' : 'w-4 bg-white/25 hover:bg-white/50'}`}
              aria-label={`slide ${n + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export function Trending({ items }) {
  const rowRef = useRef(null);
  if (!items?.length) return null;
  function scroll(dir) {
    const el = rowRef.current;
    if (el) el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: 'smooth' });
  }
  return (
    <section className="mx-auto mt-8 max-w-7xl px-4">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-xl font-bold text-white">
          <span className="h-5 w-1 rounded bg-accent" /> Trending
        </h2>
        <div className="hidden gap-2 sm:flex">
          <button
            onClick={() => scroll(-1)}
            aria-label="scroll left"
            className="flex h-9 w-9 items-center justify-center rounded-lg bg-surface text-lg text-gray-300 transition hover:bg-accent hover:text-black"
          >
            ‹
          </button>
          <button
            onClick={() => scroll(1)}
            aria-label="scroll right"
            className="flex h-9 w-9 items-center justify-center rounded-lg bg-surface text-lg text-gray-300 transition hover:bg-accent hover:text-black"
          >
            ›
          </button>
        </div>
      </div>
      <div ref={rowRef} className="no-scrollbar flex gap-3 overflow-x-auto pb-2 sm:gap-4">
        {items.map((a, n) => (
          <Link key={a.id} href={`/anime/${a.id}`} className="group flex shrink-0 items-end gap-1.5">
            <span className="text-4xl font-black leading-none text-white/15 transition group-hover:text-accent/60 sm:text-5xl">
              {String(n + 1).padStart(2, '0')}
            </span>
            <div className="w-[132px] overflow-hidden rounded-lg bg-surface sm:w-[168px] lg:w-[188px]">
              <div className="h-[198px] w-full overflow-hidden bg-black/30 sm:h-[252px] lg:h-[282px]">
                {a.poster ? (
                  <img
                    src={a.poster}
                    alt={a.title}
                    loading="lazy"
                    className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                  />
                ) : null}
              </div>
              <p className="line-clamp-2 min-h-[2rem] p-1.5 text-[11px] font-medium text-gray-200 sm:text-xs">
                {a.title}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

export function EpisodeList({ animeId, episodes, currentEp, type }) {
  const [q, setQ] = useState('');
  const filtered = q.trim()
    ? episodes.filter((e) => String(e.episodeNumber) === q.trim())
    : episodes;
  return (
    <div>
      <div className="mb-2 flex items-center gap-2">
        <h2 className="flex items-center gap-2 text-lg font-bold text-white">
          <span className="h-5 w-1 rounded bg-accent" /> Episodes
          <span className="rounded-full bg-white/10 px-2 py-0.5 text-xs font-medium text-gray-300">
            {episodes.length}
          </span>
        </h2>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value.replace(/\D/g, ''))}
          placeholder="Find number..."
          inputMode="numeric"
          className="ml-auto w-32 rounded-lg bg-white/10 px-3 py-1.5 text-xs outline-none placeholder:text-gray-500 focus:ring-2 focus:ring-accent"
        />
      </div>
      <div className="grid max-h-[420px] grid-cols-4 gap-2 overflow-y-auto rounded-2xl bg-surface/50 p-3 sm:grid-cols-6 md:grid-cols-8">
        {filtered.map((e) => {
          const active = String(e.id) === String(currentEp);
          return (
            <Link
              key={e.id}
              href={`/watch/${animeId}?ep=${e.id}&type=${type}`}
              title={e.title}
              className={`rounded-lg px-2 py-2 text-center text-xs font-medium transition ${
                active
                  ? 'bg-accent font-bold text-black shadow-lg shadow-accent/30'
                  : 'bg-white/5 text-gray-200 hover:bg-accent/80 hover:text-black'
              }`}
            >
              {e.episodeNumber}
            </Link>
          );
        })}
        {q.trim() && !filtered.length ? (
          <p className="col-span-full py-6 text-center text-sm text-gray-500">
            No episode {q.trim()} here.
          </p>
        ) : null}
      </div>
    </div>
  );
}
export function TopTen({ data }) {
  const [tab, setTab] = useState('today');
  const list = data?.[tab] || [];
  const labels = { today: 'Day', week: 'Week', month: 'Month' };
  return (
    <section className="mx-auto mt-10 max-w-7xl px-4">
      <div className="mb-4 flex items-center gap-3">
        <h2 className="flex items-center gap-2 text-xl font-bold text-white">
          <span className="h-5 w-1 rounded bg-accent" /> Top 10
        </h2>
        {Object.keys(labels).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`rounded-full px-4 py-1 text-xs font-bold ${tab === t ? 'bg-accent text-black' : 'bg-surface text-gray-300 hover:text-white'}`}
          >
            {labels[t]}
          </button>
        ))}
      </div>
      <ol className="grid gap-2 md:grid-cols-2">
        {list.slice(0, 10).map((a, n) => (
          <li key={a.id} className="min-w-0">
            <Link
              href={`/anime/${a.id}`}
              className="group flex items-center gap-3 rounded-xl bg-surface/70 p-2.5 transition hover:bg-surface hover:ring-1 hover:ring-accent/60"
            >
              <span
                className={`w-10 shrink-0 text-3xl font-black ${n < 3 ? 'text-accent' : 'text-white/25'}`}
              >
                {n + 1}
              </span>
              {a.poster ? (
                <img src={a.poster} alt="" className="h-16 w-12 rounded-md object-cover" />
              ) : null}
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-white group-hover:text-accent">
                  {a.title}
                </p>
                <p className="mt-0.5 text-[11px] text-gray-400">
                  {[a.type, a.episodes?.sub ? `SUB ${a.episodes.sub}` : null]
                    .filter(Boolean)
                    .join(' • ')}
                </p>
              </div>
            </Link>
          </li>
        ))}
      </ol>
    </section>
  );
}

const CW_KEY = 'hianime-continue-watching';
const PLAYER_ORIGINS = ['https://zokoanime.video', 'https://megaplay.buzz'];

export function AutoNext({ nextUrl, nextLabel }) {
  const [count, setCount] = useState(null);
  const [enabled, setEnabled] = useState(true);
  const enabledRef = useRef(true);

  useEffect(() => {
    try {
      const v = localStorage.getItem('hianime-autoplay') !== '0';
      setEnabled(v);
      enabledRef.current = v;
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    function onMsg(e) {
      if (PLAYER_ORIGINS.indexOf(e.origin) === -1) return;
      let d = e.data;
      if (typeof d === 'string') {
        try {
          d = JSON.parse(d);
        } catch {
          return;
        }
      }
      if (!d || typeof d !== 'object') return;
      if (d.type === 'complete' || d.event === 'complete') {
        if (enabledRef.current && nextUrl) setCount(10);
      }
    }
    window.addEventListener('message', onMsg);
    return () => window.removeEventListener('message', onMsg);
  }, [nextUrl]);

  useEffect(() => {
    if (count === null) return;
    if (count <= 0) {
      if (nextUrl) window.location.assign(nextUrl);
      return;
    }
    const t = setTimeout(() => setCount((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [count, nextUrl]);

  function toggle() {
    const v = !enabled;
    setEnabled(v);
    enabledRef.current = v;
    try {
      localStorage.setItem('hianime-autoplay', v ? '1' : '0');
    } catch {
      /* ignore */
    }
    if (!v) setCount(null);
  }

  return (
    <>
      <button
        onClick={toggle}
        title="Toggle autoplay"
        className={`rounded-full px-4 py-1.5 text-xs font-bold transition ${
          enabled ? 'bg-accent text-black' : 'bg-white/10 text-gray-300 hover:bg-white/20'
        }`}
      >
        {enabled ? '▶ Autoplay on' : '⏸ Autoplay off'}
      </button>
      {count !== null && nextUrl ? (
        <div className="fixed bottom-4 right-4 z-50 w-64 rounded-2xl bg-surface p-4 shadow-2xl ring-1 ring-accent/40">
          <p className="text-xs text-gray-400">Up next</p>
          <p className="truncate text-sm font-bold text-white">{nextLabel}</p>
          <p className="mt-1 text-xs text-accent">Playing in {count}s…</p>
          <div className="mt-3 flex gap-2">
            <button
              onClick={() => window.location.assign(nextUrl)}
              className="flex-1 rounded-full bg-accent py-1.5 text-xs font-bold text-black"
            >
              Play now
            </button>
            <button
              onClick={() => setCount(null)}
              className="flex-1 rounded-full bg-white/10 py-1.5 text-xs text-gray-200 hover:bg-white/20"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : null}
    </>
  );
}

export function TheaterToggle() {
  const [on, setOn] = useState(false);
  useEffect(() => {
    let v = false;
    try {
      v = localStorage.getItem('hianime-theater') === '1';
    } catch {
      /* ignore */
    }
    setOn(v);
    document.documentElement.classList.toggle('theater', v);
  }, []);
  function toggle() {
    const v = !on;
    setOn(v);
    try {
      localStorage.setItem('hianime-theater', v ? '1' : '0');
    } catch {
      /* ignore */
    }
    document.documentElement.classList.toggle('theater', v);
  }
  return (
    <button
      onClick={toggle}
      title="Toggle theater mode"
      className={`rounded-full px-4 py-1.5 text-xs font-medium transition ${
        on ? 'bg-accent font-bold text-black' : 'bg-white/10 text-gray-200 hover:bg-white/20'
      }`}
    >
      ⛶ {on ? 'Exit theater' : 'Theater'}
    </button>
  );
}

export function DownloadBox({ episodeId, type }) {
  const [state, setState] = useState({ loading: false, data: null, err: '' });
  // Same-origin proxy keeps the API key server-side.
  const base = '/api/proxy';

  async function load() {
    setState({ loading: true, data: null, err: '' });
    try {
      const res = await fetch(`${base}/download?id=${encodeURIComponent(episodeId)}&type=${type}`);
      const json = await res.json();
      if (!res.ok || !json.data?.m3u8) throw new Error(json.message || `API ${res.status}`);
      setState({ loading: false, data: json.data, err: '' });
    } catch (e) {
      setState({ loading: false, data: null, err: String(e?.message || e) });
    }
  }

  async function copy(text) {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      /* clipboard unavailable */
    }
  }

  return (
    <div className="mt-3 rounded-2xl bg-surface/50 p-4">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-bold uppercase tracking-wide text-gray-400">Download:</span>
        {!state.data ? (
          <button
            onClick={load}
            disabled={state.loading}
            className="rounded-full bg-accent px-4 py-1.5 text-xs font-bold text-black transition hover:brightness-110 disabled:opacity-60"
          >
            {state.loading ? 'Resolving…' : '⤓ Get direct links'}
          </button>
        ) : null}
        {state.err ? <span className="text-xs text-red-400">{state.err}</span> : null}
      </div>
      {state.data ? (
        <div className="mt-3 space-y-2 text-xs">
          {state.data.downloadPage ? (
            <div>
              <a
                href={state.data.downloadPage}
                target="_blank"
                rel="noreferrer"
                className="inline-block rounded-full bg-green-500/20 px-5 py-2 font-bold text-green-300 transition hover:bg-green-500/30"
              >
                ⤓ Download episode
              </a>
              <p className="mt-1.5 leading-relaxed text-gray-400">
                Opens the host&apos;s download page in a new tab — pick a quality and save.
              </p>
            </div>
          ) : null}
          <details>
            <summary className="cursor-pointer text-gray-500 hover:text-gray-300">
              Other options (extensions, direct link)
            </summary>
            <div className="mt-2 space-y-2">
              <p className="leading-relaxed text-gray-400">
                If the button above fails, install an HLS downloader extension (e.g.
                “Video DownloadHelper”), press play, and capture the stream.
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => copy(state.data.m3u8)}
                  className="rounded-full bg-white/10 px-3 py-1.5 text-gray-200 hover:bg-white/20"
                >
                  Copy stream link
                </button>
                {state.data.subtitles?.length ? (
                  <span className="text-gray-500">
                    + {state.data.subtitles.length} subtitle tracks (copy below)
                  </span>
                ) : null}
              </div>
              {state.data.subtitles?.length ? (
                <div className="flex flex-wrap items-center gap-1.5">
                  {state.data.subtitles.slice(0, 6).map((s, i) => (
                    <button
                      key={i}
                      onClick={() => copy(s.src)}
                      title={s.src}
                      className="rounded-full bg-white/10 px-2.5 py-1 text-gray-300 hover:bg-white/20"
                    >
                      Copy {s.label}
                    </button>
                  ))}
                </div>
              ) : null}
            </div>
          </details>
        </div>
      ) : null}
    </div>
  );
}

export function RememberProgress({ animeId, title, poster, ep, epNum, type }) {
  useEffect(() => {
    if (!animeId || !ep) return;
    try {
      const raw = JSON.parse(localStorage.getItem(CW_KEY) || '[]');
      const rest = raw.filter((x) => x.animeId !== animeId);
      rest.unshift({ animeId, title, poster, ep: String(ep), epNum, type });
      localStorage.setItem(CW_KEY, JSON.stringify(rest.slice(0, 12)));
    } catch {
      /* private mode — ignore */
    }
  }, [animeId, title, poster, ep, epNum, type]);
  return null;
}

export function ContinueWatching() {
  const [list, setList] = useState(null);
  useEffect(() => {
    try {
      setList(JSON.parse(localStorage.getItem(CW_KEY) || '[]'));
    } catch {
      setList([]);
    }
  }, []);
  if (!list?.length) return null;
  return (
    <section className="mx-auto mt-8 max-w-7xl px-4">
      <h2 className="mb-3 flex items-center gap-2 text-xl font-bold text-white">
        <span className="h-5 w-1 rounded bg-accent" /> Continue Watching
      </h2>
      <div className="no-scrollbar flex gap-3 overflow-x-auto pb-2">
        {list.map((x) => (
          <Link
            key={x.animeId}
            href={`/watch/${x.animeId}?ep=${x.ep}&type=${x.type || 'sub'}`}
            className="group w-[220px] shrink-0 overflow-hidden rounded-xl bg-surface/70 transition hover:ring-1 hover:ring-accent/60"
          >
            <div className="flex gap-2 p-2">
              {x.poster ? (
                <img src={x.poster} alt="" className="h-20 w-14 shrink-0 rounded-lg object-cover" />
              ) : null}
              <div className="min-w-0">
                <p className="line-clamp-2 text-xs font-medium text-white group-hover:text-accent">
                  {x.title || x.animeId}
                </p>
                <p className="mt-1 text-[11px] text-accent">Ep {x.epNum ?? ''}</p>
                <p className="mt-2 text-[11px] font-bold text-gray-400">▶ Resume</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

function dayStr(d) {
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${m}-${day}`;
}

export function Schedule() {
  const [days, setDays] = useState([]);
  const [sel, setSel] = useState('');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(false);
  const PAGE_SIZE = 7;

  useEffect(() => {
    const now = new Date();
    const arr = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(now);
      d.setDate(now.getDate() + i);
      return {
        date: dayStr(d),
        dow: d.toLocaleDateString('en-US', { weekday: 'short' }),
        label: `${d.toLocaleDateString('en-US', { month: 'short' })} ${d.getDate()}`,
      };
    });
    setDays(arr);
    setSel(dayStr(now));
  }, []);

  useEffect(() => {
    if (!sel) return;
    setLoading(true);
    setExpanded(false);
    fetch(`/api/proxy/schedule?date=${sel}`)
      .then((r) => r.json())
      .then((j) => setItems(j.data?.items || []))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, [sel]);

  return (
    <section className="mx-auto mt-10 max-w-7xl px-4">
      <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-white">
        <span className="h-5 w-1 rounded bg-accent" /> Estimated Schedule
      </h2>
      <div className="no-scrollbar flex gap-2 overflow-x-auto pb-1">
        {days.map((d) => (
          <button
            key={d.date}
            onClick={() => setSel(d.date)}
            className={`w-20 shrink-0 rounded-xl px-2 py-2.5 text-center transition ${
              sel === d.date ? 'bg-accent font-bold text-black' : 'bg-surface/70 text-gray-300 hover:bg-white/10'
            }`}
          >
            <p className="text-sm">{d.dow}</p>
            <p className={`mt-0.5 text-[11px] ${sel === d.date ? 'text-black/70' : 'text-gray-500'}`}>
              {d.label}
            </p>
          </button>
        ))}
      </div>
      <div className="mt-3 overflow-hidden rounded-2xl bg-surface/40">
        {loading ? (
          <div className="space-y-2 p-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-10 animate-pulse rounded-lg bg-white/5" />
            ))}
          </div>
        ) : items.length ? (
          <>
            <ul className="divide-y divide-white/5">
              {(expanded ? items : items.slice(0, PAGE_SIZE)).map((it) => (
                <li key={`${it.id}-${it.episode}`}>
                  <Link
                    href={`/anime/${it.id}`}
                    className="flex items-center gap-4 px-4 py-2.5 transition hover:bg-white/5"
                  >
                    <span className="w-12 shrink-0 text-xs font-bold text-gray-400">{it.time}</span>
                    <span className="min-w-0 flex-1 truncate text-sm text-gray-100">{it.title}</span>
                    {it.episode ? (
                      <span className="shrink-0 text-xs text-gray-400">▸ Episode {it.episode}</span>
                    ) : null}
                  </Link>
                </li>
              ))}
            </ul>
            {items.length > PAGE_SIZE ? (
              <button
                onClick={() => setExpanded((v) => !v)}
                className="px-4 py-3 text-sm font-bold text-white hover:text-accent"
              >
                {expanded ? 'Show less' : 'Show more'}
              </button>
            ) : null}
          </>
        ) : (
          <p className="p-6 text-center text-sm text-gray-500">No estimated airings for this day.</p>
        )}
      </div>
    </section>
  );
}

export function Synopsis({ text }) {
  const [open, setOpen] = useState(false);
  if (!text) return null;
  return (
    <div>
      <p className={`max-w-3xl text-sm leading-relaxed text-gray-200 ${open ? '' : 'line-clamp-3'}`}>
        {text}
      </p>
      <button
        onClick={() => setOpen((v) => !v)}
        className="mt-1 text-xs font-bold text-white hover:text-accent"
      >
        {open ? '− Less' : '+ More'}
      </button>
    </div>
  );
}

export function CastSection({ items }) {
  const [open, setOpen] = useState(false);
  if (!items?.length) return null;
  const shown = open ? items : items.slice(0, 6);
  return (
    <section className="mt-10">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-xl font-bold text-white">
          <span className="h-5 w-1 rounded bg-accent" /> Characters &amp; Voice Actors
        </h2>
        {items.length > 6 ? (
          <button
            onClick={() => setOpen((v) => !v)}
            className="rounded-full bg-surface px-4 py-1 text-xs font-medium text-gray-300 transition hover:bg-accent hover:text-black"
          >
            {open ? 'Show less' : `View more →`}
          </button>
        ) : null}
      </div>
      <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
        {shown.map((c) => {
          const va = c.voiceActors?.[0];
          return (
            <div
              key={c.id || c.name}
              className="flex items-center gap-3 rounded-xl bg-surface/70 p-2.5 ring-1 ring-white/5"
            >
              <div className="flex min-w-0 flex-1 items-center gap-2.5">
                {c.imageUrl ? (
                  <img src={c.imageUrl} alt={c.name} loading="lazy" className="h-12 w-12 shrink-0 rounded-full object-cover" />
                ) : null}
                <div className="min-w-0">
                  <p className="truncate text-xs font-bold text-white">{c.name}</p>
                  <p className="text-[11px] text-gray-400">{c.role}</p>
                </div>
              </div>
              {va ? (
                <div className="flex min-w-0 flex-1 items-center justify-end gap-2.5 text-right">
                  <div className="min-w-0">
                    <p className="truncate text-xs font-bold text-white">{va.name}</p>
                    <p className="text-[11px] text-gray-400">{va.cast || 'Voice'}</p>
                  </div>
                  {va.imageUrl ? (
                    <img src={va.imageUrl} alt={va.name} loading="lazy" className="h-12 w-12 shrink-0 rounded-full object-cover" />
                  ) : null}
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </section>
  );
}

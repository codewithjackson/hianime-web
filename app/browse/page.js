import Link from 'next/link';
import { Grid, Pagination } from '../../components/ui';
import { api } from '../../lib/api';

export async function generateMetadata({ searchParams }) {
  const q = searchParams.keyword ? ` — ${searchParams.keyword}` : '';
  return {
    title: `Browse Anime${q} | HiAnime`,
    description: 'Search and filter anime by type, status, genre and more.',
  };
}

const FILTERS = {
  type: ['all', 'tv', 'movie', 'ova', 'ona', 'special', 'music'],
  status: ['all', 'completed', 'airing', 'not_yet_aired'],
  rated: ['all', 'g', 'pg', 'pg_13', 'r_17', 'r_plus', 'rx'],
  season: ['all', 'spring', 'summer', 'fall', 'winter'],
  language: ['all', 'sub', 'dub'],
  sort: ['default', 'updated_date', 'added_date', 'release_date', 'trending', 'title_az', 'avg_score', 'mal_score'],
};

function qs(searchParams, page) {
  const p = new URLSearchParams();
  if (searchParams.keyword) p.set('keyword', searchParams.keyword);
  for (const k of Object.keys(FILTERS)) {
    if (searchParams[k]) p.set(k, searchParams[k]);
  }
  p.set('page', String(page));
  return p.toString();
}

export default async function BrowsePage({ searchParams }) {
  const page = Number(searchParams.page) || 1;
  const hasFilter = searchParams.keyword || Object.keys(FILTERS).some((k) => searchParams[k]);
  const data = hasFilter
    ? await api.filter(qs(searchParams, 1).replace(/&page=\d+$/, ''), page)
    : await api.explore('top-airing', page);

  return (
    <div className="mx-auto max-w-7xl px-4 pt-6">
      <h1 className="mb-4 flex items-center gap-2 text-2xl font-bold text-white">
        <span className="h-6 w-1 rounded bg-accent" />
        {searchParams.keyword ? (
          <>Results for &ldquo;{searchParams.keyword}&rdquo;</>
        ) : (
          'Browse Anime'
        )}
      </h1>
      <form
        method="get"
        action="/browse"
        className="mb-6 rounded-2xl bg-surface/50 p-4 ring-1 ring-white/5"
      >
        <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
          <input
            name="keyword"
            defaultValue={searchParams.keyword || ''}
            placeholder="Keyword..."
            className="col-span-2 rounded-xl bg-base px-3 py-2 text-sm outline-none ring-1 ring-white/10 placeholder:text-gray-500 focus:ring-2 focus:ring-accent md:col-span-1"
          />
          {Object.entries(FILTERS).map(([name, opts]) => (
            <label key={name} className="block">
              <span className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-gray-500">
                {name}
              </span>
              <select
                name={name}
                defaultValue={searchParams[name] || opts[0]}
                className="w-full rounded-xl bg-base px-3 py-2 text-sm capitalize outline-none ring-1 ring-white/10 focus:ring-2 focus:ring-accent"
              >
                {opts.map((o) => (
                  <option key={o} value={o}>
                    {o.replaceAll('_', ' ')}
                  </option>
                ))}
              </select>
            </label>
          ))}
        </div>
        <div className="mt-3 flex gap-2">
          <button className="rounded-full bg-accent px-6 py-1.5 text-sm font-bold text-black transition hover:brightness-110">
            Apply filters
          </button>
          <Link
            href="/browse"
            className="rounded-full bg-white/10 px-6 py-1.5 text-sm text-gray-200 hover:bg-white/20"
          >
            Reset
          </Link>
        </div>
      </form>
      <p className="mb-3 text-xs text-gray-500">
        {data.pageInfo.totalPages > 1
          ? `Page ${data.pageInfo.currentPage} of ${data.pageInfo.totalPages}`
          : `${data.response.length} titles`}
      </p>
      <Grid items={data.response} />
      <Pagination
        page={data.pageInfo.currentPage}
        totalPages={data.pageInfo.totalPages}
        makeHref={(p) => `/browse?${qs(searchParams, p)}`}
      />
    </div>
  );
}

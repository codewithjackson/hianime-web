import Link from 'next/link';
import { Grid, Pagination } from '../../components/ui';
import { FilterForm } from '../../components/client';
import { api } from '../../lib/api';

export const metadata = {
  title: 'Filter Anime | Animaze',
  description: 'Filter anime by type, status, rating, score, season, language, dates, genre and more.',
};

const KNOWN = [
  'keyword', 'type', 'status', 'rated', 'score', 'season', 'language',
  'sort', 'genres', 'sy', 'sm', 'sd', 'ey', 'em', 'ed',
];

function qs(searchParams, page) {
  const p = new URLSearchParams();
  for (const k of KNOWN) {
    if (searchParams[k]) p.set(k, searchParams[k]);
  }
  p.set('page', String(page));
  return p.toString();
}

export default async function FilterPage({ searchParams }) {
  const page = Number(searchParams.page) || 1;
  const hasFilter = KNOWN.some((k) => searchParams[k]);
  const meta = await api.meta().catch(() => ({ genres: [] }));
  const data = hasFilter ? await api.filter(qs(searchParams, 1).replace(/&page=\d+$/, ''), page) : null;

  return (
    <div className="mx-auto max-w-7xl px-4 pt-6">
      <nav className="mb-4 text-xs text-gray-500">
        <Link href="/" className="hover:text-gray-300">Home</Link>
        {' • '}
        <span className="text-gray-300">Filter</span>
      </nav>
      <FilterForm
        key={JSON.stringify(searchParams)}
        genres={meta.genres || []}
        initial={searchParams}
      />
      {data ? (
        <div className="mt-6">
          <p className="mb-3 text-xs text-gray-500">
            {data.pageInfo.totalPages > 1
              ? `Page ${data.pageInfo.currentPage} of ${data.pageInfo.totalPages}`
              : `${data.response.length} titles`}
          </p>
          <Grid items={data.response} />
          <Pagination
            page={data.pageInfo.currentPage}
            totalPages={data.pageInfo.totalPages}
            makeHref={(p) => `/filter?${qs(searchParams, p)}`}
          />
        </div>
      ) : (
        <p className="mt-6 text-center text-sm text-gray-500">
          Pick filters above and hit <strong className="text-gray-300">Filter</strong> to browse.
        </p>
      )}
    </div>
  );
}

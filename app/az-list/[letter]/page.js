import Link from 'next/link';
import { Grid, Pagination } from '../../../components/ui';
import { api } from '../../../lib/api';

export async function generateMetadata({ params }) {
  return {
    title: `A–Z List: ${String(params.letter).toUpperCase()} | Animaze`,
    description: 'Browse anime alphabetically.',
  };
}

const LETTERS = ['all', '0-9', ...'abcdefghijklmnopqrstuvwxyz'.split('')];

export default async function AzListPage({ params, searchParams }) {
  const page = Number(searchParams.page) || 1;
  const data = await api.azList(params.letter, page);
  return (
    <div className="mx-auto max-w-7xl px-4 pt-6">
      <h1 className="mb-4 flex items-center gap-2 text-2xl font-bold text-white">
        <span className="h-6 w-1 rounded bg-accent" /> A–Z List
      </h1>
      <div className="mb-6 flex flex-wrap gap-1.5">
        {LETTERS.map((l) => (
          <Link
            key={l}
            href={`/az-list/${l}`}
            className={`rounded-lg px-3 py-1.5 text-xs font-bold uppercase transition ${
              params.letter === l ? 'bg-accent text-black' : 'bg-surface/70 text-gray-300 hover:bg-white/10 hover:text-white'
            }`}
          >
            {l}
          </Link>
        ))}
      </div>
      <Grid items={data.response} />
      <Pagination
        page={data.pageInfo.currentPage}
        totalPages={data.pageInfo.totalPages}
        makeHref={(p) => `/az-list/${params.letter}?page=${p}`}
      />
    </div>
  );
}

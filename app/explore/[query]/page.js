import Link from 'next/link';
import { Grid, Pagination } from '../../../components/ui';
import { api } from '../../../lib/api';

export async function generateMetadata({ params }) {
  const label = (TITLES[params.query] || params.query).replace(/-/g, ' ');
  return {
    title: `${label} Anime | Animaze`,
    description: `Watch ${label.toLowerCase()} anime online free in HD.`,
  };
}

const TITLES = {
  'top-airing': 'Top Airing',
  'most-popular': 'Most Popular',
  'most-favorite': 'Most Favorite',
  completed: 'Completed',
  'recently-added': 'Recently Added',
  'recently-updated': 'Recently Updated',
  'top-upcoming': 'Top Upcoming',
  'subbed-anime': 'Subbed Anime',
  'dubbed-anime': 'Dubbed Anime',
  movie: 'Movies',
  tv: 'TV Series',
  ova: 'OVAs',
  ona: 'ONAs',
  special: 'Specials',
};

export default async function ExplorePage({ params, searchParams }) {
  const page = Number(searchParams.page) || 1;
  const data = await api.explore(params.query, page);
  return (
    <div className="mx-auto max-w-7xl px-4 pt-6">
      <h1 className="mb-4 text-2xl font-bold text-accent">
        {TITLES[params.query] || params.query}
      </h1>
      <Grid items={data.response} />
      <Pagination
        page={data.pageInfo.currentPage}
        totalPages={data.pageInfo.totalPages}
        makeHref={(p) => `/explore/${params.query}?page=${p}`}
      />
      <div className="mt-6 flex flex-wrap gap-2 text-xs">
        {Object.keys(TITLES).map((q) => (
          <Link
            key={q}
            href={`/explore/${q}`}
            className="rounded-full bg-surface px-3 py-1 hover:bg-accent hover:text-black"
          >
            {TITLES[q]}
          </Link>
        ))}
      </div>
    </div>
  );
}

import { Grid, Pagination } from '../../../components/ui';
import { api } from '../../../lib/api';

export async function generateMetadata({ params }) {
  const label = params.genre.replaceAll('-', ' ');
  return {
    title: `${label} Anime | Animaze`,
    description: `Watch ${label} anime online free in HD.`,
  };
}

export default async function GenrePage({ params, searchParams }) {
  const page = Number(searchParams.page) || 1;
  const data = await api.genre(params.genre, page);
  return (
    <div className="mx-auto max-w-7xl px-4 pt-6">
      <h1 className="mb-4 text-2xl font-bold capitalize text-accent">
        {params.genre.replaceAll('-', ' ')} Anime
      </h1>
      <Grid items={data.response} />
      <Pagination
        page={data.pageInfo.currentPage}
        totalPages={data.pageInfo.totalPages}
        makeHref={(p) => `/genre/${params.genre}?page=${p}`}
      />
    </div>
  );
}

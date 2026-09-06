import { Grid, Pagination } from '../../../components/ui';
import { api } from '../../../lib/api';

export async function generateMetadata({ params }) {
  const label = params.id.replaceAll('-', ' ');
  return {
    title: `${label} Anime | Animaze`,
    description: `Watch anime by ${label} online free in HD.`,
  };
}

export default async function StudiosPage({ params, searchParams }) {
  const page = Number(searchParams.page) || 1;
  const data = await api.producer(params.id, page);
  return (
    <div className="mx-auto max-w-7xl px-4 pt-6">
      <h1 className="mb-1 flex items-center gap-2 text-2xl font-bold text-white">
        <span className="h-6 w-1 rounded bg-accent" /> Studio
      </h1>
      <p className="mb-4 text-sm capitalize text-gray-400">{params.id.replaceAll('-', ' ')}</p>
      <Grid items={data.response} />
      <Pagination
        page={data.pageInfo.currentPage}
        totalPages={data.pageInfo.totalPages}
        makeHref={(p) => `/studios/${params.id}?page=${p}`}
      />
    </div>
  );
}

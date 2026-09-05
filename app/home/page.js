import Link from 'next/link';
import { AnimeCard, Row } from '../../components/ui';
import { Spotlight, TopTen, Trending, ContinueWatching, Schedule } from '../../components/client';
import { api } from '../../lib/api';

export default async function HomePage() {
  const home = await api.home();
  return (
    <>
      <Spotlight items={home.spotlight} />

      <ContinueWatching />

      <Trending items={home.trending} />

      <Row title="Top Airing" href="/explore/top-airing">
        {home.topAiring.map((a) => (
          <AnimeCard key={a.id} anime={a} />
        ))}
      </Row>

      <Row title="Most Popular" href="/explore/most-popular">
        {home.mostPopular.map((a) => (
          <AnimeCard key={a.id} anime={a} />
        ))}
      </Row>

      <Row title="Most Favorite" href="/explore/most-favorite">
        {home.mostFavorite.map((a) => (
          <AnimeCard key={a.id} anime={a} />
        ))}
      </Row>

      <Row title="Latest Episodes" href="/explore/recently-updated">
        {home.latestEpisode.map((a) => (
          <AnimeCard key={a.id} anime={a} />
        ))}
      </Row>

      <Row title="New on HiAnime" href="/explore/recently-added">
        {home.newAdded.map((a) => (
          <AnimeCard key={a.id} anime={a} />
        ))}
      </Row>

      <TopTen data={home.topTen} />

      <Schedule />

      <section className="mx-auto mt-8 max-w-7xl px-4">
        <h2 className="mb-3 text-xl font-bold text-accent">Genres</h2>
        <div className="flex flex-wrap gap-2">
          {(home.genres || []).slice(0, 40).map((g) => (
            <Link
              key={g}
              href={`/genre/${g}`}
              className="rounded-full bg-surface px-3 py-1 text-xs capitalize hover:bg-accent hover:text-black"
            >
              {g.replaceAll('-', ' ')}
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}

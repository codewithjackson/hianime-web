import Link from 'next/link';

export function AnimeCard({ anime }) {
  return (
    <Link
      href={`/anime/${anime.id}`}
      className="group w-[132px] shrink-0 overflow-hidden rounded-xl bg-surface/70 transition duration-200 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/50 hover:ring-1 hover:ring-accent/60 sm:w-[150px]"
    >
      <div className="relative h-[185px] w-full overflow-hidden bg-black/40 sm:h-[210px]">
        {anime.poster ? (
          <img
            src={anime.poster}
            alt={anime.title}
            loading="lazy"
            className="h-full w-full object-cover transition duration-300 group-hover:scale-110"
          />
        ) : null}
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition group-hover:opacity-100">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-accent text-lg font-bold text-black">
            ▶
          </span>
        </div>
        <div className="absolute left-1.5 top-1.5 flex gap-1 text-[10px] font-bold">
          {anime.episodes?.sub ? (
            <span className="rounded bg-black/75 px-1.5 py-0.5 text-green-300">
              SUB {anime.episodes.sub}
            </span>
          ) : null}
          {anime.episodes?.dub ? (
            <span className="rounded bg-black/75 px-1.5 py-0.5 text-sky-300">
              DUB {anime.episodes.dub}
            </span>
          ) : null}
        </div>
        {anime.type ? (
          <span className="absolute bottom-1.5 right-1.5 rounded bg-black/75 px-1.5 py-0.5 text-[10px] text-gray-200">
            {anime.type}
          </span>
        ) : null}
      </div>
      <div className="p-2">
        <p className="line-clamp-2 min-h-[2rem] text-xs font-medium text-white group-hover:text-accent">
          {anime.title}
        </p>
        {anime.duration ? <p className="mt-1 text-[10px] text-gray-400">{anime.duration}</p> : null}
      </div>
    </Link>
  );
}

export function Row({ title, href, children }) {
  return (
    <section className="mx-auto mt-10 max-w-7xl px-4">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-xl font-bold text-white">
          <span className="h-5 w-1 rounded bg-accent" /> {title}
        </h2>
        {href ? (
          <Link
            href={href}
            className="rounded-full bg-surface px-4 py-1 text-xs font-medium text-gray-300 transition hover:bg-accent hover:text-black"
          >
            View more →
          </Link>
        ) : null}
      </div>
      <div className="no-scrollbar flex gap-3 overflow-x-auto pb-2">{children}</div>
    </section>
  );
}

export function Grid({ items }) {
  return (
    <div className="grid grid-cols-2 gap-2 min-[420px]:grid-cols-3 sm:grid-cols-4 sm:gap-3 md:grid-cols-5 lg:grid-cols-6 2xl:grid-cols-8">
      {items.map((a) => (
        <div key={a.id} className="[&>a]:w-full">
          <AnimeCard anime={a} />
        </div>
      ))}
    </div>
  );
}

export function Pagination({ page, totalPages, makeHref }) {
  if (!totalPages || totalPages <= 1) return null;
  return (
    <div className="mt-6 flex items-center justify-center gap-2">
      {page > 1 ? (
        <Link
          href={makeHref(page - 1)}
          className="rounded bg-surface px-3 py-1 text-sm hover:bg-accent hover:text-black"
        >
          Prev
        </Link>
      ) : null}
      <span className="text-sm text-gray-300">
        Page {page} of {totalPages}
      </span>
      {page < totalPages ? (
        <Link
          href={makeHref(page + 1)}
          className="rounded bg-surface px-3 py-1 text-sm hover:bg-accent hover:text-black"
        >
          Next
        </Link>
      ) : null}
    </div>
  );
}

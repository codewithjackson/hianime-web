import Link from 'next/link';

export const metadata = {
  title: 'Request Anime | Animaze',
  description: 'How to request missing anime on Animaze.',
};

export default function RequestPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-6 px-4 pt-6 text-sm leading-relaxed text-gray-300">
      <h1 className="flex items-center gap-2 text-2xl font-bold text-white">
        <span className="h-6 w-1 rounded bg-accent" /> Request Anime
      </h1>
      <section>
        <h2 className="text-base font-bold text-white">How the catalog works</h2>
        <p className="mt-1">
          Animaze mirrors the hianime.at catalog through its API — if a title exists there, it
          exists here; if it is missing there, Animaze cannot show it either.
        </p>
      </section>
      <section>
        <h2 className="text-base font-bold text-white">Before requesting</h2>
        <ul className="mt-1 list-disc space-y-1 pl-5">
          <li>Search first — try alternate spellings and the Japanese title.</li>
          <li>Check the A–Z list and the studio page.</li>
          <li>Brand-new episodes can take a while to appear upstream.</li>
        </ul>
      </section>
      <section>
        <h2 className="text-base font-bold text-white">Still missing?</h2>
        <p className="mt-1">
          New titles arrive upstream daily, so check back later. For anything else,{' '}
          <Link href="/contact" className="font-bold text-accent hover:underline">
            contact us →
          </Link>
        </p>
      </section>
    </div>
  );
}

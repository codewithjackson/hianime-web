import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="mx-auto max-w-7xl px-4 pt-24 text-center">
      <p className="text-7xl font-black text-white/10">404</p>
      <h1 className="mt-2 text-2xl font-bold text-white">This page vanished like filler episodes</h1>
      <p className="mt-2 text-sm text-gray-400">
        The anime you&apos;re looking for doesn&apos;t exist (anymore).
      </p>
      <div className="mt-6 flex justify-center gap-3">
        <Link
          href="/"
          className="rounded-full bg-accent px-6 py-2 text-sm font-bold text-black"
        >
          Back home
        </Link>
        <Link
          href="/random"
          className="rounded-full bg-white/10 px-6 py-2 text-sm text-white hover:bg-white/20"
        >
          🎲 Random anime
        </Link>
      </div>
    </div>
  );
}

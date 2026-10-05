import Link from 'next/link';

export const metadata = {
  title: 'DMCA | Animaze',
  description: 'Animaze DMCA / copyright notice.',
};

export default function DmcaPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-6 px-4 pt-6 text-sm leading-relaxed text-gray-300">
      <h1 className="flex items-center gap-2 text-2xl font-bold text-white">
        <span className="h-6 w-1 rounded bg-accent" /> DMCA
      </h1>
      <section>
        <h2 className="text-base font-bold text-white">No files hosted here</h2>
        <p className="mt-1">
          Animaze does not store any files on its servers. All streams and download links point to
          media hosted on 3rd-party services — we only link to them.
        </p>
      </section>
      <section>
        <h2 className="text-base font-bold text-white">Report infringement</h2>
        <p className="mt-1">
          If you are a copyright owner (or act for one) and believe a linked title infringes your
          rights, send a notice with:
        </p>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          <li>The exact Animaze page URLs in question</li>
          <li>Proof that you own (or represent) the work</li>
          <li>Your contact details</li>
        </ul>
        <p className="mt-2">
          Valid notices lead to the offending links being removed from Animaze.{' '}
          <Link href="/contact" className="font-bold text-accent hover:underline">
            Contact us →
          </Link>
        </p>
      </section>
    </div>
  );
}

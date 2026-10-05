export const metadata = {
  title: 'Contact | Animaze',
  description: 'Contact the Animaze project.',
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-6 px-4 pt-6 text-sm leading-relaxed text-gray-300">
      <h1 className="flex items-center gap-2 text-2xl font-bold text-white">
        <span className="h-6 w-1 rounded bg-accent" /> Contact
      </h1>
      <p>
        Animaze has no accounts and no support desk — the fastest way to reach the project (bugs,
        takedown notices, or ideas) is through GitHub issues:
      </p>
      <div className="flex flex-wrap gap-2">
        <a
          href="https://github.com/codewithjackson/hianime-web/issues"
          target="_blank"
          rel="noreferrer"
          className="rounded-full bg-accent px-6 py-2 text-sm font-bold text-black transition hover:brightness-110"
        >
          Website issues →
        </a>
        <a
          href="https://github.com/codewithjackson/hianime-API/issues"
          target="_blank"
          rel="noreferrer"
          className="rounded-full bg-white/10 px-6 py-2 text-sm text-gray-200 transition hover:bg-white/20"
        >
          API issues →
        </a>
      </div>
      <p className="text-xs text-gray-500">
        Include the page URL and what you expected whenever you report something — it makes fixes
        much faster.
      </p>
    </div>
  );
}

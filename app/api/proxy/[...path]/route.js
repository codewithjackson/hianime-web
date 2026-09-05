// Same-origin proxy for browser-side calls (search suggestions, genre menu,
// download box). Attaches the server-only API key so browsers never see it.
export async function GET(req, { params }) {
  const base =
    process.env.API_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    'http://localhost:3000/api/v1';
  const key = process.env.API_KEY;

  const url = new URL(req.url);
  const target = `${base}/${params.path.join('/')}${url.search}`;

  const headers = {};
  if (key) headers['x-api-key'] = key;

  const upstream = await fetch(target, { headers });
  const body = await upstream.text();
  return new Response(body, {
    status: upstream.status,
    headers: {
      'content-type':
        upstream.headers.get('content-type') || 'application/json',
    },
  });
}

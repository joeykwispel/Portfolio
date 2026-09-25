import { locales, posts, siteUrl, visibleCaseStudies, visiblePosts } from '$lib/data';
import { localize } from '$lib/i18n';

export const prerender = true;

/** Every page in every language, with hreflang alternates. Regenerated on each build. */
export function GET() {
  const pages: { path: string; lastmod?: string }[] = [
    { path: '/' },
    { path: '/cv/' },
    ...visibleCaseStudies.map((c) => ({ path: `/work/${c.slug}/` })),
    ...(visiblePosts.length ? [{ path: '/writing/', lastmod: posts.find((p) => visiblePosts.includes(p))?.date }] : []),
    ...visiblePosts.map((p) => ({ path: `/writing/${p.slug}/`, lastmod: p.date }))
  ];
  const today = new Date().toISOString().slice(0, 10);
  const urls = pages.flatMap(({ path, lastmod }) =>
    locales.map(
      (l) => `  <url>
    <loc>${siteUrl}${localize(path, l)}</loc>
    <lastmod>${lastmod ?? today}</lastmod>
${locales.map((a) => `    <xhtml:link rel="alternate" hreflang="${a}" href="${siteUrl}${localize(path, a)}"/>`).join('\n')}
    <xhtml:link rel="alternate" hreflang="x-default" href="${siteUrl}${localize(path, 'en')}"/>
  </url>`
    )
  );
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls.join('\n')}
</urlset>
`;
  return new Response(xml, { headers: { 'Content-Type': 'application/xml' } });
}

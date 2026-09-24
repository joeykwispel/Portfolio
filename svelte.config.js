import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** Set BASE_PATH=/repo-name when deploying to GitHub Pages project sites. */
const base = process.env.BASE_PATH ?? '';

/**
 * SvelteKit hashes its own inline scripts for the CSP, but not the theme script in app.html.
 * Hash it here, after the %sveltekit.assets% placeholder is filled in, so the policy stays in sync when it changes.
 */
const appHtml = readFileSync(new URL('./src/app.html', import.meta.url), 'utf8');
const themeScript = /<script>([\s\S]*?)<\/script>/.exec(appHtml)?.[1] ?? '';
const themeHash = `sha256-${createHash('sha256').update(themeScript.replaceAll('%sveltekit.assets%', base)).digest('base64')}`;

export default {
  preprocess: vitePreprocess(),
  kit: {
    adapter: adapter({ pages: 'build', assets: 'build', fallback: '404.html', precompress: false, strict: true }),
    // absolute paths so `base` can be joined with siteUrl for canonical/og URLs
    paths: { base, relative: false },
    // Case study and post routes have no pages until something is published, so unseen routes only warn.
    prerender: { entries: ['*', '/nl/', '/sitemap.xml'], handleUnseenRoutes: 'warn' },
    // GitHub Pages can't send headers, so prerendered pages get the policy as a <meta> tag.
    csp: {
      mode: 'hash',
      directives: {
        'default-src': ['self'],
        'script-src': ['self', themeHash, 'https://static.cloudflareinsights.com'],
        // Svelte sets inline style attributes (CSS variables, transitions)
        'style-src': ['self', 'unsafe-inline'],
        'img-src': ['self', 'data:'],
        // Vite inlines small font subsets as data: URIs
        'font-src': ['self', 'data:'],
        'connect-src': ['self', 'https://cloudflareinsights.com'],
        'object-src': ['none'],
        'base-uri': ['self'],
        'form-action': ['none']
      }
    }
  }
};

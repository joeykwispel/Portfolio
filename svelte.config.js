import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** Set BASE_PATH=/repo-name when deploying to GitHub Pages project sites. */
const base = process.env.BASE_PATH ?? '';

export default {
  preprocess: vitePreprocess(),
  kit: {
    adapter: adapter({ pages: 'build', assets: 'build', fallback: '404.html', precompress: false, strict: true }),
    // absolute paths so `base` can be joined with siteUrl for canonical/og URLs
    paths: { base, relative: false }
  }
};

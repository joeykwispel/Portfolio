import { error } from '@sveltejs/kit';
import { visiblePosts } from '$lib/data';
import type { EntryGenerator, PageLoad } from './$types';

export const entries: EntryGenerator = () => visiblePosts.flatMap((p) => [{ slug: p.slug }, { lang: 'nl', slug: p.slug }]);

export const load: PageLoad = ({ params }) => {
  const post = visiblePosts.find((p) => p.slug === params.slug);
  if (!post) error(404, 'Post not found');
  return { post };
};

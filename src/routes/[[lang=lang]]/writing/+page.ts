import { error } from '@sveltejs/kit';
import { visiblePosts } from '$lib/data';
import type { PageLoad } from './$types';

/** The index only exists once something is published. */
export const prerender = visiblePosts.length > 0;

export const load: PageLoad = () => {
  if (!visiblePosts.length) error(404, 'No posts yet');
};

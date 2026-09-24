import type { Locale } from '$lib/data';
import type { LayoutLoad } from './$types';

export const load: LayoutLoad = ({ params }) => ({ locale: (params.lang === 'nl' ? 'nl' : 'en') as Locale });

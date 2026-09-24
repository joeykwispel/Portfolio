export interface Testimonial {
  quote: { en: string; nl: string };
  author: string;
  role: string;
}

/** No recommendations were found in the CV or LinkedIn screenshot, so the section stays hidden while this is empty. */
export const testimonials: Testimonial[] = [];

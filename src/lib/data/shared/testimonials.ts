export interface Testimonial {
  /** Shown in the original language in both locales, so the quote stays exactly as written. */
  quote: string;
  author: string;
  role: string;
  context: { en: string; nl: string };
  /** YYYY-MM-DD */
  date: string;
  source?: string;
}

/** Recommendations received on LinkedIn. The section and its nav link are hidden while this is empty. */
export const testimonials: Testimonial[] = [
  {
    quote:
      'Joey worked with me on the Red Ocelot, Code Tuner project. He has worked on front-end development, CI/CD pipelines and as a Scrum Master (all while I was Product Owner). Joey has been a pleasure to work with and contributed some interesting and innovative ideas to our product development. He has been a pleasure to work with, calmly helping to resolve some challenging issues. I really hope I get the chance to work with him again in the future.',
    author: 'Julian Bass',
    role: 'Co-founder @ Red Ocelot Ltd. | Professor of Software Engineering @ The University of Salford',
    context: { en: 'Product Owner on Code Tuner', nl: 'Product Owner bij Code Tuner' },
    date: '2025-07-06',
    source: 'LinkedIn'
  }
];

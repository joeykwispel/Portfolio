/** Contact details. Anything with placeholder: true is rendered with a visible "placeholder" badge. */
export const contact = {
  email: { value: 'joey.oosenbrug@gmail.com', placeholder: false },
  linkedin: { value: 'https://www.linkedin.com/in/joey-oosenbrug-3a7975171/', placeholder: false },
  github: { value: 'https://github.com/joeykwispel', placeholder: false }
};

/**
 * Public URL of the deployed site, without trailing slash (e.g. 'https://joeyoosenbrug.nl').
 * Used for the social preview image; LinkedIn/Slack/Teams need an absolute URL to show it.
 */
export const siteUrl = '';

export const person = {
  name: 'Joey Oosenbrug',
  location: 'Druten',
  photo: null as string | null // e.g. 'joey.jpg' placed in /static (placeholder: initials are shown instead)
};

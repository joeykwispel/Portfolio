/** Contact details. Anything with placeholder: true is rendered with a visible "placeholder" badge. */
export const contact = {
  email: { value: 'joey.oosenbrug@gmail.com', placeholder: false },
  linkedin: { value: 'https://www.linkedin.com/in/joey-oosenbrug-3a7975171/', placeholder: false },
  github: { value: 'https://github.com/joeykwispel', placeholder: false }
};

/**
 * Public origin of the deployed site, without trailing slash.
 * Used for canonical URLs and the social preview image (LinkedIn/Slack/Teams need an absolute URL).
 */
export const siteUrl = 'https://joeyoosenbrug.nl';

export const person = {
  name: 'Joey Oosenbrug',
  location: 'Druten',
  /** Files in /static. Set to null to show initials instead. Metadata is stripped; keep it that way for new photos. */
  photo: 'joey.jpg' as string | null, // 720x900 portrait, About section
  photoSquare: 'joey-square.jpg' as string | null // 480x480, CV header
};

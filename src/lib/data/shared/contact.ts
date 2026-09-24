/** Contact details. Anything with placeholder: true is rendered with a visible "placeholder" badge. */
export const contact = {
  email: { value: 'joey.oosenbrug@gmail.com', placeholder: false },
  linkedin: { value: 'https://www.linkedin.com/in/joey-oosenbrug-3a7975171/', placeholder: false },
  github: { value: 'https://github.com/joeykwispel', placeholder: false },
  /** Set to a Formspree URL (https://formspree.io/f/xxxx) to POST the form instead of opening a mail client. */
  formEndpoint: ''
};

export const person = {
  name: 'Joey Oosenbrug',
  location: 'Druten',
  photo: null as string | null, // e.g. 'joey.jpg' placed in /static (placeholder: initials are shown instead)
  cvFiles: { en: 'cv/Joey_Oosenbrug_CV_EN.docx', nl: 'cv/Joey_Oosenbrug_CV_NL.docx' }
};

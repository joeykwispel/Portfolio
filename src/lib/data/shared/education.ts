import type { EducationBase } from '../types';

export const education: EducationBase[] = [
  { id: 'mbo', kind: 'education', institution: 'mboRijnland', startYear: 2018, endYear: 2021 },
  {
    id: 'training-2024',
    kind: 'certification',
    institution: '',
    startYear: 2024,
    endYear: 2024,
    courses: ['C# for .NET Developers', 'Python for Everybody', 'Blockchain', 'Microservices']
  },
  {
    id: 'training-2023',
    kind: 'certification',
    institution: 'University of Salford, UK',
    startYear: 2023,
    endYear: 2023,
    courses: ['Lexers & Parsers (Computer Science)']
  },
  { id: 'training-2022', kind: 'certification', institution: '', startYear: 2022, endYear: 2022, courses: ['Scrum/Agile', 'Advanced TypeScript'] }
];

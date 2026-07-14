export type PortfolioLink = {
  label: string;
  href: string;
  external?: boolean;
};

export type SkillGroup = {
  label: string;
  skills: string[];
};

export type ExperienceItem = {
  position: string;
  company: string;
  startDate: string;
  endDate: string;
  highlights: string[];
};

export type PortfolioProject = {
  name: string;
  period: string;
  role: string;
  teamSize?: number;
  summary: string;
  technologies: string[];
  highlights: string[];
  githubUrl?: string | null;
  websiteUrl?: string | null;
};

export type EducationItem = {
  school: string;
  degree: string;
  period: string;
  details: string[];
};

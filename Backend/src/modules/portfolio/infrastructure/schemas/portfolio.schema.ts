import { Schema, Types, Document } from 'mongoose';

export interface SkillGroup {
  label: string;
  skills: string[];
}

export interface ExperienceItem {
  position: string;
  company: string;
  startDate: string;
  endDate: string;
  highlights: string[];
}

export interface PortfolioProject {
  name: string;
  period: string;
  role: string;
  teamSize?: number;
  summary: string;
  technologies: string[];
  highlights: string[];
  githubUrl?: string;
  websiteUrl?: string;
}

export interface EducationItem {
  school: string;
  degree: string;
  period: string;
  details: string[];
}

export interface Portfolio extends Document {
  userId: Types.ObjectId;
  name: string;
  initials: string;
  role: string;
  phone: string;
  phoneHref: string;
  email: string;
  emailHref: string;
  portfolioUrl: string;
  linkedinUrl: string;
  cvUrl: string;
  tagline: string;
  about: string[];
  softSkills: string;
  skillGroups: SkillGroup[];
  experiences: ExperienceItem[];
  projects: PortfolioProject[];
  education: EducationItem[];
}

export type PortfolioDocument = Portfolio;

export const PortfolioSchema = new Schema<Portfolio>({
  userId: { type: Schema.Types.ObjectId, required: true, index: true, unique: true },
  name: { type: String, required: true },
  initials: { type: String, required: true },
  role: { type: String, required: true },
  phone: { type: String, required: true },
  phoneHref: { type: String, required: true },
  email: { type: String, required: true },
  emailHref: { type: String, required: true },
  portfolioUrl: { type: String, required: true },
  linkedinUrl: { type: String, required: true },
  cvUrl: { type: String, required: true },
  tagline: { type: String, required: true },
  about: { type: [String], default: [] },
  softSkills: { type: String, required: true },
  skillGroups: { type: [Schema.Types.Mixed] as any, default: [] },
  experiences: { type: [Schema.Types.Mixed] as any, default: [] },
  projects: { type: [Schema.Types.Mixed] as any, default: [] },
  education: { type: [Schema.Types.Mixed] as any, default: [] },
}, {
  timestamps: true,
  collection: 'portfolios'
});

// For NestJS injection token compilation
export class Portfolio {}
export const PortfolioName = 'Portfolio';

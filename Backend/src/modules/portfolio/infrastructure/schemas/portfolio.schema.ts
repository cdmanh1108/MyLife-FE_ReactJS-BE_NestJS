import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema, Types } from 'mongoose';

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

export type PortfolioDocument = HydratedDocument<Portfolio>;

@Schema({ timestamps: true, collection: 'portfolios' })
export class Portfolio {
  @Prop({ type: Types.ObjectId, required: true, index: true, unique: true })
  userId: Types.ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  initials: string;

  @Prop({ required: true })
  role: string;

  @Prop({ required: true })
  phone: string;

  @Prop({ required: true })
  phoneHref: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  emailHref: string;

  @Prop({ required: true })
  portfolioUrl: string;

  @Prop({ required: true })
  linkedinUrl: string;

  @Prop({ required: true })
  cvUrl: string;

  @Prop({ required: true })
  tagline: string;

  @Prop({ type: [String], default: [] })
  about: string[];

  @Prop({ required: true })
  softSkills: string;

  @Prop({ type: [MongooseSchema.Types.Mixed], default: [] })
  skillGroups: SkillGroup[];

  @Prop({ type: [MongooseSchema.Types.Mixed], default: [] })
  experiences: ExperienceItem[];

  @Prop({ type: [MongooseSchema.Types.Mixed], default: [] })
  projects: PortfolioProject[];

  @Prop({ type: [MongooseSchema.Types.Mixed], default: [] })
  education: EducationItem[];
}

export const PortfolioSchema = SchemaFactory.createForClass(Portfolio);
export const PortfolioName = 'Portfolio';

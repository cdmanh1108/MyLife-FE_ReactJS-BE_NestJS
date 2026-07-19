import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class SkillGroupDto {
  @ApiProperty({ example: 'Frontend' })
  @IsString()
  label: string;

  @ApiProperty({ type: [String], example: ['React', 'Next.js'] })
  @IsArray()
  @IsString({ each: true })
  skills: string[];
}

export class ExperienceItemDto {
  @ApiProperty({ example: 'Backend Developer' })
  @IsString()
  position: string;

  @ApiProperty({ example: 'Diko Vina Co., Ltd' })
  @IsString()
  company: string;

  @ApiProperty({ example: 'Aug 2025' })
  @IsString()
  startDate: string;

  @ApiProperty({ example: 'Dec 2025' })
  @IsString()
  endDate: string;

  @ApiProperty({ type: [String], example: ['Wrote APIs'] })
  @IsArray()
  @IsString({ each: true })
  highlights: string[];
}

export class PortfolioProjectDto {
  @ApiProperty({ example: 'E-commerce Website' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'Feb 2025 – May 2025' })
  @IsString()
  period: string;

  @ApiProperty({ example: 'Backend Leader' })
  @IsString()
  role: string;

  @ApiPropertyOptional({ example: 4 })
  @IsOptional()
  @IsNumber()
  teamSize?: number;

  @ApiProperty({ example: 'An e-commerce platform' })
  @IsString()
  summary: string;

  @ApiProperty({ type: [String], example: ['React', 'Express'] })
  @IsArray()
  @IsString({ each: true })
  technologies: string[];

  @ApiProperty({ type: [String], example: ['Integrated payments'] })
  @IsArray()
  @IsString({ each: true })
  highlights: string[];

  @ApiPropertyOptional({ example: 'https://github.com/...' })
  @IsOptional()
  @IsString()
  githubUrl?: string;

  @ApiPropertyOptional({ example: 'https://website.com' })
  @IsOptional()
  @IsString()
  websiteUrl?: string;
}

export class EducationItemDto {
  @ApiProperty({ example: 'University of Information Technology' })
  @IsString()
  school: string;

  @ApiProperty({ example: 'Bachelor of IT' })
  @IsString()
  degree: string;

  @ApiProperty({ example: '2022 – 2026' })
  @IsString()
  period: string;

  @ApiProperty({ type: [String], example: ['TOEIC 725'] })
  @IsArray()
  @IsString({ each: true })
  details: string[];
}

export class PortfolioContentDto {
  @ApiProperty({ example: 'Chau Duc Manh' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'CM' })
  @IsString()
  initials: string;

  @ApiProperty({ example: 'Fullstack Developer' })
  @IsString()
  role: string;

  @ApiProperty({ example: 'I build web apps.' })
  @IsString()
  tagline: string;

  @ApiProperty({ type: [String], example: ['Line 1', 'Line 2'] })
  @IsArray()
  @IsString({ each: true })
  about: string[];

  @ApiProperty({ example: 'Good soft skills.' })
  @IsString()
  softSkills: string;

  @ApiProperty({ type: [SkillGroupDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SkillGroupDto)
  skillGroups: SkillGroupDto[];

  @ApiProperty({ type: [ExperienceItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ExperienceItemDto)
  experiences: ExperienceItemDto[];

  @ApiProperty({ type: [PortfolioProjectDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PortfolioProjectDto)
  projects: PortfolioProjectDto[];

  @ApiProperty({ type: [EducationItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => EducationItemDto)
  education: EducationItemDto[];
}

export class PortfolioLocalesDto {
  @ApiProperty({ type: PortfolioContentDto })
  @ValidateNested()
  @Type(() => PortfolioContentDto)
  en: PortfolioContentDto;

  @ApiProperty({ type: PortfolioContentDto })
  @ValidateNested()
  @Type(() => PortfolioContentDto)
  vi: PortfolioContentDto;

  @ApiProperty({ type: PortfolioContentDto })
  @ValidateNested()
  @Type(() => PortfolioContentDto)
  ko: PortfolioContentDto;
}

export class PortfolioResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  phone: string;

  @ApiProperty()
  phoneHref: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  emailHref: string;

  @ApiProperty()
  portfolioUrl: string;

  @ApiProperty()
  linkedinUrl: string;

  @ApiProperty()
  cvUrl: string;

  @ApiProperty({ type: PortfolioLocalesDto })
  @ValidateNested()
  @Type(() => PortfolioLocalesDto)
  locales: PortfolioLocalesDto;
}

export class UpdatePortfolioDto {
  @ApiProperty({ example: '+84 367 485 383' })
  @IsString()
  phone: string;

  @ApiProperty({ example: 'tel:+84367485383' })
  @IsString()
  phoneHref: string;

  @ApiProperty({ example: 'cdmanh1108@gmail.com' })
  @IsString()
  email: string;

  @ApiProperty({ example: 'mailto:cdmanh1108@gmail.com' })
  @IsString()
  emailHref: string;

  @ApiProperty({ example: 'https://portfolio.chaumanh.site' })
  @IsString()
  portfolioUrl: string;

  @ApiProperty({ example: 'https://linkedin.com/in/chaumanh1108' })
  @IsString()
  linkedinUrl: string;

  @ApiProperty({ example: '/cv/ChauDucManh_FullstackDeveloper.pdf' })
  @IsString()
  cvUrl: string;

  @ApiProperty({ type: PortfolioLocalesDto })
  @ValidateNested()
  @Type(() => PortfolioLocalesDto)
  locales: PortfolioLocalesDto;
}

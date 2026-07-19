import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Portfolio, PortfolioDocument } from '../infrastructure/schemas/portfolio.schema';
import { UpdatePortfolioDto, PortfolioResponseDto } from '../presentation/dto/portfolio.dto';

@Injectable()
export class PortfolioService {
  constructor(
    @InjectModel(Portfolio.name) private readonly portfolioModel: Model<PortfolioDocument>,
  ) {}

  async getPortfolio(userId: string): Promise<PortfolioResponseDto> {
    const uId = new Types.ObjectId(userId);
    const port = await this.portfolioModel.findOne({ userId: uId }).exec();

    if (!port) {
      throw new NotFoundException('Portfolio not found');
    }

    return this.toResponse(port);
  }

  async updatePortfolio(userId: string, dto: UpdatePortfolioDto): Promise<PortfolioResponseDto> {
    const uId = new Types.ObjectId(userId);
    const port = await this.portfolioModel.findOneAndUpdate(
      { userId: uId },
      { $set: dto },
      { new: true, upsert: true },
    ).exec();

    return this.toResponse(port);
  }

  toResponse(doc: PortfolioDocument): PortfolioResponseDto {
    const locales = doc.locales || { en: {} as any, vi: {} as any, ko: {} as any };
    return {
      id: doc._id.toString(),
      phone: doc.phone,
      phoneHref: doc.phoneHref,
      email: doc.email,
      emailHref: doc.emailHref,
      portfolioUrl: doc.portfolioUrl,
      linkedinUrl: doc.linkedinUrl,
      cvUrl: doc.cvUrl,
      locales: {
        en: this.toContentResponse(locales.en),
        vi: this.toContentResponse(locales.vi),
        ko: this.toContentResponse(locales.ko),
      },
    };
  }

  private toContentResponse(content: any): any {
    if (!content) return {} as any;
    return {
      name: content.name || '',
      initials: content.initials || '',
      role: content.role || '',
      tagline: content.tagline || '',
      about: content.about || [],
      softSkills: content.softSkills || '',
      skillGroups: content.skillGroups || [],
      experiences: content.experiences || [],
      projects: content.projects || [],
      education: content.education || [],
    };
  }
}

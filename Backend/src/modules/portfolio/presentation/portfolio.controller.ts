import { Body, Controller, Get, Patch, NotFoundException } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from '../../../common/decorators/public.decorator';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import { AuthenticatedUser } from '../../../common/types/authenticated-user.type';
import { PortfolioService } from '../application/portfolio.service';
import { UpdatePortfolioDto, PortfolioResponseDto } from './dto/portfolio.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Portfolio, PortfolioDocument } from '../infrastructure/schemas/portfolio.schema';

@ApiTags('portfolio')
@Controller('portfolio')
export class PortfolioController {
  constructor(
    private readonly portfolioService: PortfolioService,
    @InjectModel(Portfolio.name) private readonly portfolioModel: Model<PortfolioDocument>,
  ) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Get portfolio of the site owner' })
  @ApiOkResponse({ type: PortfolioResponseDto })
  async getOwnerPortfolio() {
    // Find the first portfolio in the database (since this is a personal OS)
    const port = await this.portfolioModel.findOne().exec();
    if (port) {
      return this.portfolioService.toResponse(port);
    }
    throw new NotFoundException('Portfolio not found');
  }

  @ApiBearerAuth('access-token')
  @Patch()
  @ApiOperation({ summary: 'Update current user portfolio' })
  @ApiOkResponse({ type: PortfolioResponseDto })
  async updateMyPortfolio(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: UpdatePortfolioDto,
  ) {
    return this.portfolioService.updatePortfolio(user.id, dto);
  }
}

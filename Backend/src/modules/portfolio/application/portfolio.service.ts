import { Injectable } from '@nestjs/common';
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
    let port = await this.portfolioModel.findOne({ userId: uId }).exec();

    if (!port) {
      // Initialize with default mock data if not found
      port = await this.portfolioModel.create({
        userId: uId,
        name: 'Chau Duc Manh',
        initials: 'CM',
        role: 'Fullstack Developer',
        phone: '+84 367 485 383',
        phoneHref: 'tel:+84367485383',
        email: 'cdmanh1108@gmail.com',
        emailHref: 'mailto:cdmanh1108@gmail.com',
        portfolioUrl: 'https://portfolio.chaumanh.site',
        linkedinUrl: 'https://linkedin.com/in/chaumanh1108',
        cvUrl: '/cv/ChauDucManh_FullstackDeveloper.pdf',
        tagline: 'I build scalable, performant, and user-friendly web applications with modern technologies.',
        about: [
          'I’m a Fullstack Developer with hands-on experience building and deploying web applications using React.js, Node.js, Express.js, NestJS, SQL, NoSQL, Redis, Docker, AWS, and GCP.',
          'I have experience designing RESTful APIs, authentication systems, payment integrations, caching strategies, real-time features, and cloud deployment.',
          'I’m seeking opportunities where I can contribute to scalable products while continuing to strengthen my full-stack engineering skills.',
        ],
        softSkills: 'Able to read technical documents in English, with strong communication, teamwork, self-learning, and problem-solving skills.',
        skillGroups: [
          { label: 'Frontend', skills: ['HTML', 'CSS', 'Tailwind CSS', 'React.js', 'Next.js'] },
          { label: 'Backend', skills: ['JavaScript', 'TypeScript', 'Node.js', 'Express.js', 'NestJS', 'RESTful APIs', 'Microservices', 'RabbitMQ'] },
          { label: 'Database', skills: ['MySQL', 'PostgreSQL', 'MongoDB', 'Redis', 'Prisma', 'TypeORM'] },
          { label: 'DevOps', skills: ['Linux', 'Ubuntu', 'Docker', 'AWS', 'GCP', 'Jenkins', 'CI/CD'] },
          { label: 'Others', skills: ['Git', 'GitHub', 'Postman', 'Java Spring Boot'] },
        ],
        experiences: [
          {
            position: 'Backend Developer',
            company: 'Diko Vina Co., Ltd',
            startDate: 'Aug 2025',
            endDate: 'Dec 2025',
            highlights: [
              'Worked in an Agile/Scrum team to design and optimize the database architecture for an Interactive Gamified Photobooth Platform combining photo-taking, coupons, and game-based rewards.',
              'Designed and implemented core RESTful APIs using Express.js, PostgreSQL, and ORM for authentication, user management, coupon, and gift modules.',
              'Engineered an automated QR code module that uploaded photos to Google Cloud Storage, generated secure 3-day signed URLs, and embedded them into QR codes.',
              'Integrated the KakaoTalk API to automate user messaging and notifications.',
              'Supported deployment using Docker, Google Cloud Run, Cloud SQL, and Firebase Hosting.',
            ],
          },
          {
            position: 'Backend Developer Intern',
            company: 'Diko Vina Co., Ltd',
            startDate: 'Jun 2025',
            endDate: 'Jul 2025',
            highlights: [
              'Participated in onboarding and technical training and learned professional software development workflows.',
              'Practiced full-stack development by cloning existing websites, designing MySQL databases, building RESTful APIs with Express.js, and integrating APIs with the frontend team.',
            ],
          },
        ],
        projects: [
          {
            name: 'Dine-in & Food Ordering System',
            period: 'Dec 2025 – Present',
            role: 'Fullstack Developer',
            teamSize: 1,
            summary: 'A scalable food ordering and dine-in platform with integrated payments and QR-code table session management.',
            technologies: ['Next.js', 'NestJS', 'TypeScript', 'Microservices', 'RabbitMQ', 'PostgreSQL', 'Prisma', 'Redis', 'Docker', 'AWS'],
            highlights: [
              'Architected a NestJS microservices backend using RabbitMQ, Prisma, PostgreSQL, and Redis.',
              'Implemented request-ID tracing, role-based access control, and QR-code table sessions.',
              'Integrated PayOS with asynchronous RabbitMQ-based webhook processing.',
              'Deployed containerized services on AWS using ECS, ALB, RDS, Amazon MQ, S3, CloudFront, VPC, and Secrets Manager.',
            ],
            githubUrl: '',
            websiteUrl: '',
          },
          {
            name: 'Weather Forecast Website',
            period: 'May 2025 – Jun 2025',
            role: 'Fullstack Developer',
            teamSize: 1,
            summary: 'A NestJS-based weather forecast website with automatic city detection and global weather search.',
            technologies: ['React.js', 'NestJS', 'MySQL', 'OpenWeather API', 'Docker', 'AWS'],
            highlights: [
              'Built modular NestJS services for authentication, users, cities, and weather.',
              'Integrated OpenWeather APIs and reverse geocoding for city detection and global search.',
              'Implemented JWT access and refresh authentication with HTTP-only cookies.',
              'Deployed the frontend using S3 and CloudFront and the backend using Docker Compose, Nginx, and EC2.',
            ],
            githubUrl: '',
            websiteUrl: '',
          },
          {
            name: 'E-commerce Website',
            period: 'Feb 2025 – May 2025',
            role: 'Backend Leader',
            teamSize: 4,
            summary: 'A sports e-commerce platform integrated with a RAG-based AI chatbot.',
            technologies: ['React.js', 'Express.js', 'MongoDB', 'Redis', 'Firebase', 'OpenAI API', 'Socket.io', 'PayOS', 'Docker', 'AWS'],
            highlights: [
              'Designed RESTful APIs for authentication, products, carts, orders, and payments.',
              'Integrated PayOS webhooks and real-time order updates using Socket.io.',
              'Implemented JWT authentication, centralized error handling, secure file uploads, and Google OAuth.',
              'Built a RAG-based chatbot using text chunking, embeddings, and the OpenAI API.',
            ],
            githubUrl: '',
            websiteUrl: '',
          },
        ],
        education: [
          {
            school: 'University of Information Technology – VNU-HCM',
            degree: 'Bachelor of Information Technology',
            period: '2022 – 2026',
            details: ['English: TOEIC 725'],
          },
        ],
      });
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
    return {
      id: doc._id.toString(),
      name: doc.name,
      initials: doc.initials,
      role: doc.role,
      phone: doc.phone,
      phoneHref: doc.phoneHref,
      email: doc.email,
      emailHref: doc.emailHref,
      portfolioUrl: doc.portfolioUrl,
      linkedinUrl: doc.linkedinUrl,
      cvUrl: doc.cvUrl,
      tagline: doc.tagline,
      about: doc.about || [],
      softSkills: doc.softSkills,
      skillGroups: doc.skillGroups || [],
      experiences: doc.experiences || [],
      projects: doc.projects || [],
      education: doc.education || [],
    };
  }
}

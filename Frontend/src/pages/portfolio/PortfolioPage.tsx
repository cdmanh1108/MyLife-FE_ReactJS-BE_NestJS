import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import {
  ArrowDown,
  ArrowUpRight,
  BookOpenCheck,
  BriefcaseBusiness,
  Code2,
  Download,
  ExternalLink,
  GraduationCap,
  Linkedin,
  Mail,
  MapPin,
  Phone,
  Rocket,
  Sparkles,
  UserRound,
} from 'lucide-react';
import { ROUTES } from '@/shared/constants/routes';
import { Badge } from '@/shared/ui/Badge';
import { ThemeToggle } from '@/shared/ui/ThemeToggle';
import * as mockData from './portfolio.data';
import { ExperienceTimeline } from './components/ExperienceTimeline';
import { PortfolioSection } from './components/PortfolioSection';
import { ProjectCard } from './components/ProjectCard';
import { usePortfolio } from '@/features/portfolio/api/usePortfolio';
import { LoadingState } from '@/shared/ui/LoadingState';

export default function PortfolioPage() {
  const { t } = useTranslation();

  const { data: portfolio, isLoading } = usePortfolio();

  useEffect(() => {
    const previousTitle = document.title;
    const description = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    const previousDescription = description?.content;

    const name = portfolio?.name || mockData.profile.name;
    const role = portfolio?.role || mockData.profile.role;
    const tagline = portfolio?.tagline || mockData.profile.tagline;

    document.title = `${name} | ${role}`;
    if (description) {
      description.content = tagline;
    }

    return () => {
      document.title = previousTitle;
      if (description && previousDescription) description.content = previousDescription;
    };
  }, [portfolio]);

  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const targetId = href.replace('#', '');
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      window.history.pushState(null, '', href);
    }
  };

  if (isLoading) {
    return <LoadingState />;
  }

  const profile = {
    name: portfolio?.name || mockData.profile.name,
    initials: portfolio?.initials || mockData.profile.initials,
    role: portfolio?.role || mockData.profile.role,
    phone: portfolio?.phone || mockData.profile.phone,
    phoneHref: portfolio?.phoneHref || mockData.profile.phoneHref,
    email: portfolio?.email || mockData.profile.email,
    emailHref: portfolio?.emailHref || mockData.profile.emailHref,
    portfolioUrl: portfolio?.portfolioUrl || mockData.profile.portfolioUrl,
    linkedinUrl: portfolio?.linkedinUrl || mockData.profile.linkedinUrl,
    cvUrl: portfolio?.cvUrl || mockData.profile.cvUrl,
    tagline: portfolio?.tagline || mockData.profile.tagline,
    about: portfolio?.about || mockData.profile.about,
    softSkills: portfolio?.softSkills || mockData.profile.softSkills,
  };

  const skillGroups = portfolio?.skillGroups?.length ? portfolio.skillGroups : mockData.skillGroups;
  const experiences = portfolio?.experiences?.length ? portfolio.experiences : mockData.experiences;
  const projects = portfolio?.projects?.length ? portfolio.projects : mockData.projects;
  const education = portfolio?.education?.length ? portfolio.education : mockData.education;

  const navigation = [
    { label: t('portfolio.about'), href: '#about' },
    { label: t('portfolio.experience'), href: '#experience' },
    { label: t('portfolio.projects'), href: '#projects' },
    { label: t('portfolio.contact'), href: '#contact' },
  ];

  return (
    <div className="min-h-screen overflow-x-hidden bg-background text-foreground">
      <header className="sticky top-0 z-50 border-b border-border/80 bg-background/85 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link
            to={ROUTES.LANDING}
            className="group inline-flex items-center gap-3 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label="Go to MyLife home"
          >
            <span className="flex size-9 items-center justify-center rounded-lg border border-primary/25 bg-primary/10 font-mono text-sm font-bold text-primary transition-colors group-hover:bg-primary/15">
              {profile.initials}
            </span>
            <span className="hidden text-sm font-semibold sm:inline">{profile.name}</span>
          </Link>

          <nav className="hidden items-center gap-6 md:flex" aria-label="Portfolio navigation">
            {navigation.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={(e) => handleScroll(e, item.href)}
                className="text-sm text-muted-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <a
              href={profile.emailHref}
              className="hidden h-9 items-center gap-2 rounded-md border border-primary/40 px-3 text-sm font-medium text-primary transition-colors hover:bg-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:inline-flex"
            >
              {t('portfolio.contact')}
              <ArrowUpRight size={14} aria-hidden="true" />
            </a>
          </div>
        </div>
      </header>

      <main>
        <section className="relative border-b border-border/70">
          <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
            <div className="absolute -right-28 -top-24 size-96 rounded-full bg-primary/8 blur-3xl" />
            <div className="absolute -left-40 bottom-0 size-80 rounded-full bg-cyan-500/5 blur-3xl" />
          </div>

          <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 sm:py-24 lg:grid-cols-[minmax(0,1.25fr)_minmax(320px,0.75fr)] lg:gap-20 lg:px-8 lg:py-28">
            <div className="animate-slide-up">
              <Badge className="mb-6 rounded-full px-3 py-1 font-mono tracking-wide">
                <Sparkles size={12} aria-hidden="true" /> {profile.role.toUpperCase()}
              </Badge>

              <p className="mb-3 font-mono text-sm text-primary">{t('portfolio.hello')}</p>
              <h1 className="max-w-4xl text-4xl font-semibold uppercase tracking-[-0.04em] text-foreground sm:text-6xl lg:text-7xl">
                {profile.name}
              </h1>
              <p className="mt-4 text-2xl font-semibold text-primary sm:text-3xl">{profile.role}</p>
              <p className="mt-6 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
                {profile.tagline}
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a
                  href={profile.cvUrl}
                  download="ChauDucManh_FullstackDeveloper.pdf"
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-primary px-5 text-sm font-semibold text-primary-foreground shadow-[0_0_24px_rgba(56,189,248,0.2)] transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer"
                >
                  <Download size={16} aria-hidden="true" />
                  {t('portfolio.downloadCv')}
                </a>
                <a
                  href={profile.cvUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-border bg-card/60 px-5 text-sm font-semibold text-foreground transition-colors hover:border-primary/30 hover:bg-secondary/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer"
                >
                  <ExternalLink size={16} aria-hidden="true" />
                  {t('portfolio.viewCv')}
                </a>
              </div>

              <div className="mt-8 grid gap-3 text-sm text-muted-foreground sm:grid-cols-2">
                <a
                  href={profile.phoneHref}
                  className="inline-flex items-center gap-2.5 transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <Phone size={15} className="text-primary" aria-hidden="true" />
                  {profile.phone}
                </a>
                <a
                  href={profile.emailHref}
                  className="inline-flex min-w-0 items-center gap-2.5 transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <Mail size={15} className="shrink-0 text-primary" aria-hidden="true" />
                  <span className="truncate">{profile.email}</span>
                </a>
                <a
                  href={profile.portfolioUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-w-0 items-center gap-2.5 transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <ExternalLink size={15} className="shrink-0 text-primary" aria-hidden="true" />
                  <span className="truncate">{profile.portfolioUrl.replace(/^https?:\/\//, '')}</span>
                </a>
                <a
                  href={profile.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-w-0 items-center gap-2.5 transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <Linkedin size={15} className="shrink-0 text-primary" aria-hidden="true" />
                  <span className="truncate">{profile.linkedinUrl.replace(/^https?:\/\/(www\.)?/, '')}</span>
                </a>
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-[420px] animate-scale-in lg:mx-0 lg:ml-auto">
              <div className="absolute inset-8 rounded-full bg-primary/15 blur-3xl" aria-hidden="true" />
              <div className="relative aspect-square rounded-[2rem] border border-primary/20 bg-card/80 p-5 shadow-[0_30px_100px_rgba(0,0,0,0.35)] backdrop-blur">
                <div className="relative flex h-full flex-col justify-between overflow-hidden rounded-[1.5rem] border border-border bg-background/80 p-7">
                  <div className="absolute -right-10 -top-10 size-44 rounded-full border border-primary/15" />
                  <div className="absolute -right-2 -top-2 size-28 rounded-full border border-primary/20" />
                  <div className="relative flex items-start justify-between">
                    <span className="font-mono text-xs uppercase tracking-[0.24em] text-muted-foreground">
                      Portfolio / 2026
                    </span>
                    <Code2 size={20} className="text-primary" aria-hidden="true" />
                  </div>

                  <div className="relative flex flex-1 items-center justify-center py-8">
                    <div className="flex size-44 items-center justify-center rounded-full border border-primary/30 bg-primary/10 shadow-[0_0_60px_rgba(56,189,248,0.16)] sm:size-52">
                      <span className="font-mono text-6xl font-bold tracking-[-0.08em] text-primary sm:text-7xl">
                        {profile.initials}
                      </span>
                    </div>
                  </div>

                  <div className="relative grid grid-cols-2 gap-3">
                    <div className="rounded-lg border border-border bg-card px-3 py-2.5">
                      <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                        Focus
                      </p>
                      <p className="mt-1 text-sm font-semibold">Scalable Systems</p>
                    </div>
                    <div className="rounded-lg border border-border bg-card px-3 py-2.5">
                      <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                        Based in
                      </p>
                      <p className="mt-1 inline-flex items-center gap-1.5 text-sm font-semibold">
                        <MapPin size={13} className="text-primary" aria-hidden="true" /> Vietnam
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <a
              href="#about"
              onClick={(e) => handleScroll(e, '#about')}
              className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 items-center gap-2 font-mono text-xs text-muted-foreground transition-colors hover:text-primary lg:inline-flex cursor-pointer"
            >
              {t('portfolio.scrollToExplore')} <ArrowDown size={13} aria-hidden="true" />
            </a>
          </div>
        </section>

        <div className="mx-auto max-w-7xl space-y-24 px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
          <PortfolioSection
            id="about"
            eyebrow={t('portfolio.about')}
            title={`${t('portfolio.about')} & ${t('portfolio.skillsTitle')}`}
            icon={<UserRound size={18} aria-hidden="true" />}
            description="A practical full-stack toolkit built through real products, integrations, and cloud deployments."
          >
            <div className="grid overflow-hidden rounded-2xl border border-border bg-card/75 lg:grid-cols-[0.85fr_1.15fr]">
              <div className="border-b border-border p-6 sm:p-8 lg:border-b-0 lg:border-r">
                <h3 className="mb-5 text-lg font-semibold">{t('portfolio.about')}</h3>
                <div className="space-y-4 text-sm leading-7 text-muted-foreground">
                  {profile.about.map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))}
                </div>
                <div className="mt-7 rounded-xl border border-primary/15 bg-primary/5 p-4">
                  <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-foreground">
                    <BookOpenCheck size={16} className="text-primary" aria-hidden="true" />
                    {t('portfolio.softSkillsTitle')}
                  </div>
                  <p className="text-sm leading-6 text-muted-foreground">{profile.softSkills}</p>
                </div>
              </div>

              <div className="p-6 sm:p-8">
                <h3 className="mb-5 text-lg font-semibold">{t('portfolio.skillsTitle')}</h3>
                <div className="space-y-5">
                  {skillGroups.map((group) => (
                    <div key={group.label} className="grid gap-2 sm:grid-cols-[88px_minmax(0,1fr)]">
                      <p className="pt-1 font-mono text-xs font-medium text-muted-foreground">
                        {group.label}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {group.skills.map((skill) => (
                          <Badge key={skill} variant="muted" className="bg-muted/60 px-2.5 py-1">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </PortfolioSection>

          <PortfolioSection
            id="experience"
            eyebrow={t('portfolio.experience')}
            title={t('portfolio.experience')}
            icon={<BriefcaseBusiness size={18} aria-hidden="true" />}
            description="Professional experience presented as a read-only timeline inspired by the MyLife timeline page."
          >
            <ExperienceTimeline items={experiences} />
          </PortfolioSection>

          <PortfolioSection
            id="projects"
            eyebrow={t('portfolio.projects')}
            title={t('portfolio.projects')}
            icon={<Rocket size={18} aria-hidden="true" />}
            description="Products where I owned architecture, backend systems, integrations, deployment, or the full stack."
          >
            <div className="grid gap-5 lg:grid-cols-3">
              {projects.map((project, index) => (
                <ProjectCard key={project.name} project={project} index={index} />
              ))}
            </div>
          </PortfolioSection>

          <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="rounded-2xl border border-border bg-card/75 p-6 sm:p-8">
              <div className="mb-6 flex items-center gap-3">
                <span className="flex size-9 items-center justify-center rounded-lg border border-primary/20 bg-primary/10 text-primary">
                  <GraduationCap size={18} aria-hidden="true" />
                </span>
                <div>
                  <p className="font-mono text-xs uppercase tracking-[0.2em] text-primary">{t('portfolio.education')}</p>
                  <h2 className="mt-1 text-2xl font-semibold">{t('portfolio.softSkillsTitle')}</h2>
                </div>
              </div>

              {education.map((item, index) => (
                <article key={index} className="mb-6 last:mb-0">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <h3 className="text-base font-semibold text-foreground">{item.school}</h3>
                      <p className="mt-2 text-sm text-muted-foreground">{item.degree}</p>
                    </div>
                    <span className="font-mono text-xs text-primary">{item.period}</span>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {item.details.map((detail, dIdx) => (
                      <Badge key={dIdx}>{detail}</Badge>
                    ))}
                  </div>
                </article>
              ))}
            </div>

            <div id="contact" className="scroll-mt-24 rounded-2xl border border-primary/20 bg-primary/5 p-6 sm:p-8">
              <div className="mb-6 flex items-center gap-3">
                <span className="flex size-9 items-center justify-center rounded-lg border border-primary/20 bg-primary/10 text-primary">
                  <Mail size={18} aria-hidden="true" />
                </span>
                <div>
                  <p className="font-mono text-xs uppercase tracking-[0.2em] text-primary">{t('portfolio.contact')}</p>
                  <h2 className="mt-1 text-2xl font-semibold">{t('portfolio.contactTitle')}</h2>
                </div>
              </div>

              <p className="max-w-xl text-sm leading-7 text-muted-foreground">
                {t('portfolio.contactSubtitle')}
              </p>

              <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <a
                  href={profile.emailHref}
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-primary px-5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer"
                >
                  <Mail size={16} aria-hidden="true" /> {t('portfolio.sendEmail')}
                </a>
                <a
                  href={profile.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-border bg-card px-5 text-sm font-semibold text-foreground transition-colors hover:border-primary/30 hover:bg-secondary/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer"
                >
                  <Linkedin size={16} aria-hidden="true" /> LinkedIn
                </a>
              </div>

              <div className="mt-8 grid gap-3 border-t border-primary/15 pt-6 text-sm text-muted-foreground sm:grid-cols-2">
                <a href={profile.phoneHref} className="inline-flex items-center gap-2 hover:text-primary">
                  <Phone size={15} className="text-primary" aria-hidden="true" /> {profile.phone}
                </a>
                <a href={profile.emailHref} className="inline-flex min-w-0 items-center gap-2 hover:text-primary">
                  <Mail size={15} className="shrink-0 text-primary" aria-hidden="true" />
                  <span className="truncate">{profile.email}</span>
                </a>
              </div>
            </div>
          </section>
        </div>
      </main>

      <footer className="border-t border-border/80">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-4 py-8 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p>© 2026 {profile.name}. {t('portfolio.builtWith')}</p>
          <div className="flex items-center gap-4">
            <a
              href={profile.linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-primary"
              aria-label="Open LinkedIn profile"
            >
              <Linkedin size={17} />
            </a>
            <a href={profile.emailHref} className="transition-colors hover:text-primary" aria-label="Send email">
              <Mail size={17} />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

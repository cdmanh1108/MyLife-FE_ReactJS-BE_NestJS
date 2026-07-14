import { ExternalLink, Github, Users } from 'lucide-react';
import { Badge } from '@/shared/ui/Badge';
import type { PortfolioProject } from '../portfolio.types';

interface ProjectCardProps {
  project: PortfolioProject;
  index: number;
}

export function ProjectCard({ project, index }: ProjectCardProps) {
  const projectNumber = String(index + 1).padStart(2, '0');

  return (
    <article className="group flex h-full flex-col rounded-xl border border-border bg-card/80 p-5 transition-all duration-300 hover:-translate-y-1 hover:border-primary/25 hover:shadow-[0_16px_50px_rgba(0,0,0,0.22)] sm:p-6">
      <div className="mb-5 flex items-start justify-between gap-4">
        <span className="font-mono text-sm font-semibold text-primary/70">{projectNumber}</span>
        <span className="rounded-full border border-border bg-muted/60 px-2.5 py-1 font-mono text-[11px] text-muted-foreground">
          {project.period}
        </span>
      </div>

      <div className="mb-5">
        <h3 className="text-xl font-semibold tracking-tight text-foreground transition-colors group-hover:text-primary">
          {project.name}
        </h3>
        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
          <span>{project.role}</span>
          {project.teamSize && (
            <span className="inline-flex items-center gap-1.5">
              <Users size={13} aria-hidden="true" />
              Team size: {project.teamSize}
            </span>
          )}
        </div>
      </div>

      <p className="mb-5 text-sm leading-6 text-muted-foreground">{project.summary}</p>

      <ul className="mb-5 space-y-2 text-sm leading-5 text-muted-foreground">
        {project.highlights.slice(0, 3).map((highlight) => (
          <li key={highlight} className="flex gap-2.5">
            <span className="mt-2 size-1.5 shrink-0 rounded-full bg-primary/60" />
            <span>{highlight}</span>
          </li>
        ))}
      </ul>

      <div className="mt-auto flex flex-wrap gap-2 border-t border-border pt-5">
        {project.technologies.map((technology) => (
          <Badge key={technology} variant="muted" className="bg-muted/50">
            {technology}
          </Badge>
        ))}
      </div>

      {(project.githubUrl || project.websiteUrl) && (
        <div className="mt-5 flex items-center gap-4 border-t border-border pt-4 text-sm">
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-muted-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <Github size={15} aria-hidden="true" /> GitHub
            </a>
          )}
          {project.websiteUrl && (
            <a
              href={project.websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-muted-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <ExternalLink size={15} aria-hidden="true" /> Website
            </a>
          )}
        </div>
      )}
    </article>
  );
}

"use client";

import { ProjectCard } from "@/components/ProjectCard";
import { Section } from "@/components/Section";

type Project = {
  id: string;
  name: string;
  status: string;
  developmentCost: number;
  deadline: string;
  createdAt: string;
  client?: {
    name: string;
    email: string;
  };
  milestones?: Array<{
    id: string;
    status: string;
  }>;
};

type ProjectsListProps = {
  projects: Project[];
  title: string;
  emptyMessage?: string;
};

export function ProjectsList({ projects, title, emptyMessage = "No projects found" }: ProjectsListProps) {
  if (projects.length === 0) {
    return (
      <Section eyebrow="Projects" title={title}>
        <div className="card card-dark p-12 text-center">
          <p className="muted">{emptyMessage}</p>
        </div>
      </Section>
    );
  }

  return (
    <Section eyebrow="Projects" title={title}>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </Section>
  );
}

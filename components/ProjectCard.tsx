import Link from "next/link";
import { Section } from "@/components/Section";
import { UnreadMessageBadge } from "@/components/UnreadMessageBadge";

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

type ProjectCardProps = {
  project: Project;
};

const statusColors: Record<string, string> = {
  APPLICATION_IN_PROGRESS: "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400",
  DISCUSSION_IN_PROGRESS: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400",
  DEVELOPMENT_IN_PROGRESS: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
  SUCCEEDED: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400",
  FAILED: "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400",
};

const statusLabels: Record<string, string> = {
  APPLICATION_IN_PROGRESS: "Application in progress",
  DISCUSSION_IN_PROGRESS: "Discussion in progress",
  DEVELOPMENT_IN_PROGRESS: "Development in progress",
  SUCCEEDED: "Succeeded",
  FAILED: "Failed",
};

export function ProjectCard({ project }: ProjectCardProps) {
  const paidMilestones = project.milestones?.filter((m) => m.status === "PAID").length || 0;
  const totalMilestones = project.milestones?.length || 0;

  return (
    <Link href={`/projects/${project.id}`}>
      <div className="rounded-3xl border border-ink/10 bg-white p-6 shadow-card transition hover:shadow-soft dark:border-white/10 dark:bg-nightSoft cursor-pointer">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-2">
            <h3 className="text-xl font-semibold text-ink dark:text-white">
              {project.name}
            </h3>
            <UnreadMessageBadge projectId={project.id} />
          </div>
          <span
            className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
              statusColors[project.status] || statusColors.APPLICATION_IN_PROGRESS
            }`}
          >
            {statusLabels[project.status] || project.status}
          </span>
        </div>

        <div className="space-y-2 text-sm text-ink/70 dark:text-white/70">
          <p>
            <span className="font-medium">Cost:</span> ${project.developmentCost.toLocaleString()}
          </p>
          <p>
            <span className="font-medium">Deadline:</span>{" "}
            {new Date(project.deadline).toLocaleDateString()}
          </p>
          {project.client && (
            <p>
              <span className="font-medium">Client:</span> {project.client.name}
            </p>
          )}
          {totalMilestones > 0 && (
            <p>
              <span className="font-medium">Progress:</span> {paidMilestones}/{totalMilestones}{" "}
              milestones completed
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}

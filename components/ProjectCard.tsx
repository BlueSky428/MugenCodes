import Link from "next/link";
import { Section } from "@/components/Section";
import { UnreadMessageBadge } from "@/components/UnreadMessageBadge";
import { formatProjectStatus, projectStatusColors, projectStatusIcons } from "@/lib/status";

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
  onCancel?: (projectId: string) => void;
  canCancel?: boolean;
};

export function ProjectCard({ project, onCancel, canCancel }: ProjectCardProps) {
  const paidMilestones = project.milestones?.filter((m) => m.status === "PAID").length || 0;
  const totalMilestones = project.milestones?.length || 0;
  const StatusIcon = projectStatusIcons[project.status] || projectStatusIcons.APPLICATION_IN_PROGRESS;

  return (
    <div className="relative group">
      <Link href={`/projects/${project.id}`} className="block">
        <div className="card card-dark card-hover cursor-pointer p-6 h-full animate-fade-in-up transition-all duration-300 group-hover:border-primary-200 dark:group-hover:border-primary-800">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <h3 className="text-xl font-semibold text-ink dark:text-white truncate group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-300">
                {project.name}
              </h3>
              <UnreadMessageBadge projectId={project.id} />
            </div>
            <div className="flex items-center gap-2">
              {canCancel && onCancel && (
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onCancel(project.id);
                  }}
                  className="p-2 rounded-lg text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 transition-colors"
                  title="Cancel Project"
                  aria-label="Cancel Project"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 ${
                  projectStatusColors[project.status] || projectStatusColors.APPLICATION_IN_PROGRESS
                }`}
                title={formatProjectStatus(project.status)}
              >
                <StatusIcon className="w-6 h-6" />
              </div>
            </div>
          </div>

        <div className="space-y-3 text-sm muted">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-primary-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p>
              <span className="font-semibold text-ink dark:text-white">Cost:</span> ${project.developmentCost.toLocaleString()}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-primary-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p>
              <span className="font-semibold text-ink dark:text-white">Deadline:</span>{" "}
              {new Date(project.deadline).toLocaleDateString()}
            </p>
          </div>
          {project.client && (
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-primary-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <p>
                <span className="font-semibold text-ink dark:text-white">Client:</span> {project.client.name}
              </p>
            </div>
          )}
          {totalMilestones > 0 && (
            <div className="flex items-center gap-2 pt-2 border-t border-gray-200 dark:border-gray-700">
              <svg className="w-4 h-4 text-primary-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p>
                <span className="font-semibold text-ink dark:text-white">Progress:</span> {paidMilestones}/{totalMilestones}{" "}
                milestones completed
              </p>
              <div className="ml-auto flex-1 max-w-[100px] h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-primary rounded-full transition-all duration-500"
                  style={{ width: `${(paidMilestones / totalMilestones) * 100}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>
        </div>
      </Link>
    </div>
  );
}

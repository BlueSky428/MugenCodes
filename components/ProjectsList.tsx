"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
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
    id: string;
    name: string;
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
  onProjectDeleted?: () => void;
};

export function ProjectsList({ projects, title, emptyMessage = "No projects found", onProjectDeleted }: ProjectsListProps) {
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === "ADMIN" || session?.user?.role === "DEVELOPER";
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  const handleDeleteClick = (project: Project) => {
    setSelectedProject(project);
    setShowDeleteModal(true);
    setDeleteError("");
  };

  const handleConfirmDelete = async () => {
    if (!selectedProject) return;

    setDeleting(true);
    setDeleteError("");

    try {
      const response = await fetch(`/api/projects/${selectedProject.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setShowDeleteModal(false);
        setSelectedProject(null);
        if (onProjectDeleted) {
          onProjectDeleted();
        }
      } else {
        const data = await response.json();
        setDeleteError(data.error || "Failed to delete project. Please try again.");
      }
    } catch (err) {
      setDeleteError("An error occurred. Please try again.");
    } finally {
      setDeleting(false);
    }
  };

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
    <>
      <Section eyebrow="Projects" title={title}>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <div key={project.id} className="relative group">
              <ProjectCard project={project} />
              {isAdmin && project.status === "FAILED" && (
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleDeleteClick(project);
                  }}
                  className="absolute top-4 right-4 p-2 rounded-lg bg-error-100 text-error-600 hover:bg-error-200 dark:bg-error-900/30 dark:text-error-400 dark:hover:bg-error-900/50 transition-colors opacity-0 group-hover:opacity-100 z-10"
                  title="Delete Project"
                  aria-label="Delete Project"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              )}
            </div>
          ))}
        </div>
      </Section>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedProject && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-fade-in"
          onClick={() => {
            setShowDeleteModal(false);
            setSelectedProject(null);
            setDeleteError("");
          }}
        >
          <div
            className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 animate-fade-in-up border border-gray-200 dark:border-gray-700"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-error-100 dark:bg-error-900/30 flex items-center justify-center">
                <svg className="w-6 h-6 text-error-600 dark:text-error-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Delete Project
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Project: <span className="font-medium text-gray-900 dark:text-white">{selectedProject.name}</span>
                </p>
              </div>
            </div>
            
            <p className="text-sm text-gray-700 dark:text-gray-300 mb-6">
              Are you sure you want to permanently delete this failed project? This action cannot be undone and all project data will be removed.
            </p>
            
            {deleteError && (
              <div className="rounded-xl bg-error-50 dark:bg-error-900/20 border border-error-200 dark:border-error-800 p-3 text-sm text-error-700 dark:text-error-400 mb-4">
                {deleteError}
              </div>
            )}
            
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setSelectedProject(null);
                  setDeleteError("");
                }}
                disabled={deleting}
                className="flex-1 inline-flex items-center justify-center rounded-xl border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-6 py-3 text-sm font-semibold text-gray-700 dark:text-gray-200 transition hover:bg-gray-50 dark:hover:bg-gray-600 hover:border-gray-400 dark:hover:border-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                disabled={deleting}
                className="flex-1 inline-flex items-center justify-center rounded-xl bg-error-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-error-700 focus:outline-none focus:ring-2 focus:ring-error-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {deleting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Deleting...
                  </>
                ) : (
                  "Delete Permanently"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

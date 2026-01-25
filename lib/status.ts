// Status formatting utilities
import { FileText, MessageCircle, Code, CheckCircle, XCircle, LucideIcon } from "lucide-react";

export const projectStatusLabels: Record<string, string> = {
  APPLICATION_IN_PROGRESS: "Application in progress",
  DISCUSSION_IN_PROGRESS: "Discussion in progress",
  DEVELOPMENT_IN_PROGRESS: "Development in progress",
  SUCCEEDED: "Succeeded",
  FAILED: "Failed",
};

export const projectStatusIcons: Record<string, LucideIcon> = {
  APPLICATION_IN_PROGRESS: FileText,
  DISCUSSION_IN_PROGRESS: MessageCircle,
  DEVELOPMENT_IN_PROGRESS: Code,
  SUCCEEDED: CheckCircle,
  FAILED: XCircle,
};

// Icon container colors (for status icons)
export const projectStatusColors: Record<string, string> = {
  APPLICATION_IN_PROGRESS: "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400",
  DISCUSSION_IN_PROGRESS: "bg-warning-100 dark:bg-warning-900/30 text-warning-600 dark:text-warning-400",
  DEVELOPMENT_IN_PROGRESS: "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400",
  SUCCEEDED: "bg-success-100 dark:bg-success-900/30 text-success-600 dark:text-success-400",
  FAILED: "bg-error-100 dark:bg-error-900/30 text-error-600 dark:text-error-400",
};

// Text colors for status labels
export const projectStatusTextColors: Record<string, string> = {
  APPLICATION_IN_PROGRESS: "text-blue-700 dark:text-blue-300",
  DISCUSSION_IN_PROGRESS: "text-warning-700 dark:text-warning-300",
  DEVELOPMENT_IN_PROGRESS: "text-indigo-700 dark:text-indigo-300",
  SUCCEEDED: "text-success-700 dark:text-success-300",
  FAILED: "text-error-700 dark:text-error-300",
};

// Badge colors for status badges
export const projectStatusBadgeColors: Record<string, string> = {
  APPLICATION_IN_PROGRESS: "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800",
  DISCUSSION_IN_PROGRESS: "bg-warning-100 text-warning-700 border-warning-200 dark:bg-warning-900/30 dark:text-warning-300 dark:border-warning-800",
  DEVELOPMENT_IN_PROGRESS: "bg-indigo-100 text-indigo-700 border-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-300 dark:border-indigo-800",
  SUCCEEDED: "bg-success-100 text-success-700 border-success-200 dark:bg-success-900/30 dark:text-success-300 dark:border-success-800",
  FAILED: "bg-error-100 text-error-700 border-error-200 dark:bg-error-900/30 dark:text-error-300 dark:border-error-800",
};

// Border colors for project cards
export const projectStatusBorderColors: Record<string, string> = {
  APPLICATION_IN_PROGRESS: "border-blue-300 dark:border-blue-700 group-hover:border-blue-400 dark:group-hover:border-blue-600",
  DISCUSSION_IN_PROGRESS: "border-warning-300 dark:border-warning-700 group-hover:border-warning-400 dark:group-hover:border-warning-600",
  DEVELOPMENT_IN_PROGRESS: "border-indigo-300 dark:border-indigo-700 group-hover:border-indigo-400 dark:group-hover:border-indigo-600",
  SUCCEEDED: "border-success-300 dark:border-success-700 group-hover:border-success-400 dark:group-hover:border-success-600",
  FAILED: "border-error-300 dark:border-error-700 group-hover:border-error-400 dark:group-hover:border-error-600",
};

export const feasibilityStatusLabels: Record<string, string> = {
  PENDING: "Pending",
  APPROVED: "Approved",
  REJECTED: "Rejected",
};

export const feasibilityStatusColors: Record<string, string> = {
  PENDING: "bg-warning-100 text-warning-800 border-warning-300 dark:bg-warning-900/30 dark:text-warning-300 dark:border-warning-700",
  APPROVED: "bg-success-500 text-white border-success-600 dark:bg-success-600 dark:text-white dark:border-success-500",
  REJECTED: "bg-error-50 text-error-700 border-error-200 dark:bg-error-900/30 dark:text-error-300 dark:border-error-700",
};

export function formatProjectStatus(status: string): string {
  return projectStatusLabels[status] || status;
}

export function formatFeasibilityStatus(status: string): string {
  return feasibilityStatusLabels[status] || status;
}

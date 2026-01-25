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

export const projectStatusColors: Record<string, string> = {
  APPLICATION_IN_PROGRESS: "bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300",
  DISCUSSION_IN_PROGRESS: "bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300",
  DEVELOPMENT_IN_PROGRESS: "bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300",
  SUCCEEDED: "bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300",
  FAILED: "bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300",
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

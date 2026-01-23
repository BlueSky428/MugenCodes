// Status formatting utilities

export const projectStatusLabels: Record<string, string> = {
  APPLICATION_IN_PROGRESS: "Application in progress",
  DISCUSSION_IN_PROGRESS: "Discussion in progress",
  DEVELOPMENT_IN_PROGRESS: "Development in progress",
  SUCCEEDED: "Succeeded",
  FAILED: "Failed",
};

export const projectStatusColors: Record<string, string> = {
  APPLICATION_IN_PROGRESS: "bg-gray-100 text-gray-800 border-gray-300 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600",
  DISCUSSION_IN_PROGRESS: "bg-gray-200 text-gray-900 border-gray-400 dark:bg-gray-700 dark:text-gray-100 dark:border-gray-500",
  DEVELOPMENT_IN_PROGRESS: "bg-gray-300 text-gray-900 border-gray-500 dark:bg-gray-600 dark:text-white dark:border-gray-400",
  SUCCEEDED: "bg-black text-white border-gray-900 dark:bg-white dark:text-black dark:border-gray-200",
  FAILED: "bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700",
};

export const feasibilityStatusLabels: Record<string, string> = {
  PENDING: "Pending",
  APPROVED: "Approved",
  REJECTED: "Rejected",
};

export const feasibilityStatusColors: Record<string, string> = {
  PENDING: "bg-gray-200 text-gray-900 border-gray-400 dark:bg-gray-700 dark:text-gray-100 dark:border-gray-500",
  APPROVED: "bg-black text-white border-gray-900 dark:bg-white dark:text-black dark:border-gray-200",
  REJECTED: "bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700",
};

export function formatProjectStatus(status: string): string {
  return projectStatusLabels[status] || status;
}

export function formatFeasibilityStatus(status: string): string {
  return feasibilityStatusLabels[status] || status;
}

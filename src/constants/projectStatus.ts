export const PROJECT_STATUS = ["planning", "in progress", "on hold", "completed", "cancelled"] as const;
export type ProjectStatusType = (typeof PROJECT_STATUS)[number];

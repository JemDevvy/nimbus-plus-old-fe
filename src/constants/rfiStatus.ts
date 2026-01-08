export const RFI_STATUS  = ["Requested", "In Progress", "Pending Info", "Responded", "Closed", "Overdue", "Cancelled"] as const;
export type RfiStatusType = (typeof RFI_STATUS)[number];

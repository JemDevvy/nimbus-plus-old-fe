export const PROJECT_STAGE  = ["Concept", "DA", "CC", "IFC", "Tender"] as const;
export type ProjectStageType = (typeof PROJECT_STAGE)[number];

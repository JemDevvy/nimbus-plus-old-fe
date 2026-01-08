import { createContext, useContext } from 'react';

export interface ProjectSelectionContextType {
  selectedProject: number;
  setSelectedProject: (projectId: number) => void;
}

export const ProjectSelectionContext = createContext<ProjectSelectionContextType | undefined>(undefined);

export const useProjectSelection = () => {
  const context = useContext(ProjectSelectionContext);
  if (context === undefined) {
    throw new Error('useProjectSelection must be used within a ProjectSelectionProvider');
  }
  return context;
};
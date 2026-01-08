import { useContext } from 'react';
import { ProjectSelectionContext } from '../context/ProjectSelectionContext';

export const useProjectSelection = () => {
  const context = useContext(ProjectSelectionContext);
  if (context === undefined) {
    throw new Error('useProjectSelection must be used within a ProjectSelectionProvider');
  }
  return context;
};

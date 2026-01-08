import React, { useState, useContext } from 'react';
import type { ReactNode } from 'react';
import { ProjectSelectionContext } from './ProjectSelectionContext';

interface ProjectSelectionProviderProps {
  children: ReactNode;
}

export const ProjectSelectionProvider: React.FC<ProjectSelectionProviderProps> = ({ children }) => {
  const [selectedProject, setSelectedProjectState] = useState(() => {
    // Only load from localStorage, never auto-select from project list
    const storedProject = localStorage.getItem('selectedProject');
    return storedProject ? parseInt(storedProject, 10) : 0;
  });

  // Update localStorage whenever selectedProject changes
  const setSelectedProject = (projectId: number) => {
    setSelectedProjectState(projectId);
    localStorage.setItem('selectedProject', projectId.toString());
  };


  return (
    <ProjectSelectionContext.Provider value={{ selectedProject, setSelectedProject }}>
      {children}
    </ProjectSelectionContext.Provider>
  );
};




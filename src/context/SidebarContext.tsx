import React, { createContext, useContext, useState, ReactNode } from 'react';

interface SidebarContextProps {
  isMini: boolean;
  setIsMini: (val: boolean) => void;
  sidebarWidth: number;
}

const SidebarContext = createContext<SidebarContextProps | undefined>(undefined);

export const SIDEBAR_WIDTH = 200;
export const SIDEBAR_MINI_WIDTH = 50;

export function SidebarProvider({ children }: { children: ReactNode }) {
  const [isMini, setIsMini] = useState(false);
  const sidebarWidth = isMini ? SIDEBAR_MINI_WIDTH : SIDEBAR_WIDTH;

  return (
    <SidebarContext.Provider value={{ isMini, setIsMini, sidebarWidth }}>
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  const ctx = useContext(SidebarContext);
  if (!ctx) throw new Error('useSidebar must be used within SidebarProvider');
  return ctx;
}

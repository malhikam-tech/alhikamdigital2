import React, { createContext, useContext, ReactNode } from 'react';
import { 
  usePortfolioQuery, 
  useSkillsQuery, 
  usePackagesQuery, 
  useProjectsQuery,
  type PortfolioData,
  type Skill,
  type Package,
  type Project,
} from '@/hooks/usePortfolioData';

interface PortfolioContextType {
  portfolio: PortfolioData | undefined;
  skills: Skill[] | undefined;
  packages: Package[] | undefined;
  projects: Project[] | undefined;
  isLoading: boolean;
}

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

export const PortfolioProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { data: portfolio, isLoading: portfolioLoading } = usePortfolioQuery();
  const { data: skills, isLoading: skillsLoading } = useSkillsQuery();
  const { data: packages, isLoading: packagesLoading } = usePackagesQuery();
  const { data: projects, isLoading: projectsLoading } = useProjectsQuery();

  const isLoading = portfolioLoading || skillsLoading || packagesLoading || projectsLoading;

  return (
    <PortfolioContext.Provider value={{ portfolio, skills, packages, projects, isLoading }}>
      {children}
    </PortfolioContext.Provider>
  );
};

export const usePortfolio = () => {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error('usePortfolio must be used within a PortfolioProvider');
  }
  return context;
};

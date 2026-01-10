import React, { createContext, useContext, ReactNode } from 'react';
import { usePortfolioData, PortfolioData, Project, Skill, Package } from '@/hooks/usePortfolioData';

interface PortfolioContextType {
  data: {
    name: string;
    tagline: string;
    age: number;
    grade: string;
    bio: string;
    profileImage: string;
    logoImage: string;
    skills: { name: string; percentage: number; category: 'webdev' | 'security' }[];
    socialLinks: {
      github?: string;
      instagram?: string;
      email?: string;
    };
    packages: {
      id: string;
      name: string;
      priceMin: number;
      priceMax: number;
      features: string[];
    }[];
    projects: {
      id: string;
      title: string;
      description: string;
      image: string;
      category: string;
      technologies: string[];
      liveUrl?: string;
      githubUrl?: string;
    }[];
    whatsappNumber: string;
    location?: string;
  };
  isLoading: boolean;
  refetch: () => Promise<void>;
}

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

export const PortfolioProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { data: rawData, isLoading, refetch } = usePortfolioData();

  // Transform data to match existing component expectations
  const data = {
    name: rawData.name,
    tagline: rawData.tagline,
    age: rawData.age,
    grade: rawData.grade,
    bio: rawData.bio,
    profileImage: rawData.profileImage,
    logoImage: rawData.logoImage,
    skills: rawData.skills.map((s, i) => ({
      name: s.name,
      percentage: s.percentage,
      category: (i < 5 ? 'webdev' : 'security') as 'webdev' | 'security',
    })),
    socialLinks: {
      github: rawData.github,
      instagram: rawData.instagram,
      email: rawData.email,
    },
    packages: rawData.packages.map(p => ({
      id: p.id,
      name: p.name,
      priceMin: p.priceMin,
      priceMax: p.priceMax,
      features: p.features,
    })),
    projects: rawData.projects.map(p => ({
      id: p.id,
      title: p.title,
      description: p.description,
      image: p.image,
      category: p.category,
      technologies: p.technologies,
      liveUrl: p.liveUrl,
      githubUrl: p.githubUrl,
    })),
    whatsappNumber: rawData.whatsappNumber,
    location: rawData.location,
  };

  return (
    <PortfolioContext.Provider value={{ data, isLoading, refetch }}>
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

export type { PortfolioData, Project, Skill, Package };

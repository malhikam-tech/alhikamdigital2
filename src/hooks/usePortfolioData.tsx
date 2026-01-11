import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface Skill {
  id: string;
  name: string;
  percentage: number;
  category?: 'webdev' | 'security';
  sort_order: number;
}

export interface Package {
  id: string;
  name: string;
  price_min: number;
  price_max: number;
  features: string[];
  sort_order: number;
}

export interface Project {
  id: string;
  title: string;
  description: string | null;
  image: string | null;
  category: string | null;
  technologies: string[];
  live_url: string | null;
  github_url: string | null;
  sort_order: number;
}

export interface PortfolioData {
  id: string;
  name: string;
  tagline: string;
  age: number;
  grade: string;
  bio: string;
  profile_image: string | null;
  logo_image: string | null;
  whatsapp: string | null;
  email: string | null;
  github: string | null;
  instagram: string | null;
  location: string | null;
}

interface UsePortfolioDataReturn {
  portfolio: PortfolioData | null;
  skills: Skill[];
  packages: Package[];
  projects: Project[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  updatePortfolio: (data: Partial<PortfolioData>) => Promise<{ error: string | null }>;
  updateSkill: (id: string, data: Partial<Skill>) => Promise<{ error: string | null }>;
  updatePackage: (id: string, data: Partial<Package>) => Promise<{ error: string | null }>;
}

export const usePortfolioData = (): UsePortfolioDataReturn => {
  const { isAdmin } = useAuth();
  const [portfolio, setPortfolio] = useState<PortfolioData | null>(null);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [packages, setPackages] = useState<Package[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Fetch portfolio data
      const { data: portfolioData, error: portfolioError } = await supabase
        .from('portfolio_data')
        .select('*')
        .limit(1)
        .maybeSingle();

      if (portfolioError) throw portfolioError;
      setPortfolio(portfolioData);

      const portfolioId = portfolioData?.id;

      // Fetch skills
      const { data: skillsData, error: skillsError } = await supabase
        .from('skills')
        .select('*')
        .order('sort_order', { ascending: true });

      if (skillsError) throw skillsError;
      setSkills(skillsData || []);

      // Fetch packages
      const { data: packagesData, error: packagesError } = await supabase
        .from('packages')
        .select('*')
        .order('sort_order', { ascending: true });

      if (packagesError) throw packagesError;
      setPackages(packagesData || []);

      // Fetch projects
      const { data: projectsData, error: projectsError } = await supabase
        .from('projects')
        .select('*')
        .order('sort_order', { ascending: true });

      if (projectsError) throw projectsError;
      setProjects(projectsData || []);

    } catch (err: any) {
      console.error('Error fetching portfolio data:', err);
      setError(err.message || 'Error fetching data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const updatePortfolio = async (data: Partial<PortfolioData>) => {
    if (!portfolio?.id || !isAdmin) {
      return { error: 'Unauthorized' };
    }

    try {
      const { error } = await supabase
        .from('portfolio_data')
        .update(data)
        .eq('id', portfolio.id);

      if (error) throw error;

      setPortfolio(prev => prev ? { ...prev, ...data } : null);
      return { error: null };
    } catch (err: any) {
      return { error: err.message };
    }
  };

  const updateSkill = async (id: string, data: Partial<Skill>) => {
    if (!isAdmin) {
      return { error: 'Unauthorized' };
    }

    try {
      const { error } = await supabase
        .from('skills')
        .update(data)
        .eq('id', id);

      if (error) throw error;

      setSkills(prev => prev.map(s => s.id === id ? { ...s, ...data } : s));
      return { error: null };
    } catch (err: any) {
      return { error: err.message };
    }
  };

  const updatePackage = async (id: string, data: Partial<Package>) => {
    if (!isAdmin) {
      return { error: 'Unauthorized' };
    }

    try {
      const { error } = await supabase
        .from('packages')
        .update(data)
        .eq('id', id);

      if (error) throw error;

      setPackages(prev => prev.map(p => p.id === id ? { ...p, ...data } : p));
      return { error: null };
    } catch (err: any) {
      return { error: err.message };
    }
  };

  return {
    portfolio,
    skills,
    packages,
    projects,
    isLoading,
    error,
    refetch: fetchData,
    updatePortfolio,
    updateSkill,
    updatePackage,
  };
};

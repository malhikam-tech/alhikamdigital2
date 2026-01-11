import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  category: string;
  technologies: string[];
  liveUrl?: string;
  githubUrl?: string;
}

interface Skill {
  name: string;
  percentage: number;
  category: 'webdev' | 'security';
}

interface Package {
  id: string;
  name: string;
  priceMin: number;
  priceMax: number;
  features: string[];
}

interface PortfolioData {
  name: string;
  tagline: string;
  age: number;
  grade: string;
  bio: string;
  profileImage: string;
  logoImage: string;
  skills: Skill[];
  socialLinks: {
    github?: string;
    instagram?: string;
    email?: string;
  };
  packages: Package[];
  projects: Project[];
  whatsappNumber: string;
}

interface PortfolioContextType {
  data: PortfolioData;
  isLoading: boolean;
  refetch: () => Promise<void>;
}

const defaultData: PortfolioData = {
  name: "M. Al Hikam Baihaqi",
  tagline: "Web Developer & Cyber Security Enthusiast",
  age: 13,
  grade: "Kelas VIII",
  bio: "Seorang pelajar yang passionate dalam dunia web development dan cyber security.",
  profileImage: "",
  logoImage: "",
  skills: [],
  socialLinks: {},
  packages: [],
  projects: [],
  whatsappNumber: "",
};

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

export const PortfolioProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [data, setData] = useState<PortfolioData>(defaultData);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      // Fetch portfolio data
      const { data: portfolioData, error: portfolioError } = await supabase
        .from('portfolio_data')
        .select('*')
        .limit(1)
        .maybeSingle();

      if (portfolioError) throw portfolioError;

      // Fetch skills
      const { data: skillsData, error: skillsError } = await supabase
        .from('skills')
        .select('*')
        .order('sort_order', { ascending: true });

      if (skillsError) throw skillsError;

      // Fetch packages
      const { data: packagesData, error: packagesError } = await supabase
        .from('packages')
        .select('*')
        .order('sort_order', { ascending: true });

      if (packagesError) throw packagesError;

      // Fetch projects
      const { data: projectsData, error: projectsError } = await supabase
        .from('projects')
        .select('*')
        .order('sort_order', { ascending: true });

      if (projectsError) throw projectsError;

      // Transform data to match the expected format
      const transformedData: PortfolioData = {
        name: portfolioData?.name || defaultData.name,
        tagline: portfolioData?.tagline || defaultData.tagline,
        age: portfolioData?.age || defaultData.age,
        grade: portfolioData?.grade || defaultData.grade,
        bio: portfolioData?.bio || defaultData.bio,
        profileImage: portfolioData?.profile_image || '',
        logoImage: portfolioData?.logo_image || '',
        whatsappNumber: portfolioData?.whatsapp || '',
        socialLinks: {
          github: portfolioData?.github || '',
          instagram: portfolioData?.instagram || '',
          email: portfolioData?.email || '',
        },
        skills: (skillsData || []).map((skill) => ({
          name: skill.name,
          percentage: skill.percentage,
          category: skill.sort_order <= 5 ? 'webdev' : 'security',
        })),
        packages: (packagesData || []).map((pkg) => ({
          id: pkg.id,
          name: pkg.name,
          priceMin: pkg.price_min,
          priceMax: pkg.price_max,
          features: pkg.features || [],
        })),
        projects: (projectsData || []).map((project) => ({
          id: project.id,
          title: project.title,
          description: project.description || '',
          image: project.image || '',
          category: project.category || '',
          technologies: project.technologies || [],
          liveUrl: project.live_url || undefined,
          githubUrl: project.github_url || undefined,
        })),
      };

      setData(transformedData);
    } catch (error) {
      console.error('Error fetching portfolio data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <PortfolioContext.Provider value={{ data, isLoading, refetch: fetchData }}>
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

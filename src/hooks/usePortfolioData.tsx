import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  category: string;
  technologies: string[];
  liveUrl?: string;
  githubUrl?: string;
}

export interface Skill {
  id: string;
  name: string;
  percentage: number;
}

export interface Package {
  id: string;
  name: string;
  priceMin: number;
  priceMax: number;
  features: string[];
}

export interface PortfolioData {
  id: string;
  name: string;
  tagline: string;
  age: number;
  grade: string;
  bio: string;
  profileImage: string;
  logoImage: string;
  whatsappNumber: string;
  email: string;
  github: string;
  instagram: string;
  location: string;
  skills: Skill[];
  packages: Package[];
  projects: Project[];
}

const defaultData: PortfolioData = {
  id: '',
  name: 'M. Al Hikam Baihaqi',
  tagline: 'Web Developer & Cyber Security Enthusiast',
  age: 13,
  grade: 'Kelas VIII',
  bio: 'Seorang pelajar yang passionate dalam dunia web development dan cyber security.',
  profileImage: '',
  logoImage: '',
  whatsappNumber: '+6282122662713',
  email: 'contact@alhikam.dev',
  github: 'https://github.com',
  instagram: 'https://instagram.com',
  location: 'Indonesia',
  skills: [],
  packages: [],
  projects: [],
};

export const usePortfolioData = () => {
  const [data, setData] = useState<PortfolioData>(defaultData);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchData = useCallback(async () => {
    try {
      // Fetch portfolio data
      const { data: portfolioData, error: portfolioError } = await supabase
        .from('portfolio_data')
        .select('*')
        .limit(1)
        .maybeSingle();

      if (portfolioError) throw portfolioError;

      if (portfolioData) {
        // Fetch related data
        const [skillsRes, packagesRes, projectsRes] = await Promise.all([
          supabase.from('skills').select('*').eq('portfolio_id', portfolioData.id).order('sort_order'),
          supabase.from('packages').select('*').eq('portfolio_id', portfolioData.id).order('sort_order'),
          supabase.from('projects').select('*').eq('portfolio_id', portfolioData.id).order('sort_order'),
        ]);

        setData({
          id: portfolioData.id,
          name: portfolioData.name,
          tagline: portfolioData.tagline,
          age: portfolioData.age,
          grade: portfolioData.grade,
          bio: portfolioData.bio,
          profileImage: portfolioData.profile_image || '',
          logoImage: portfolioData.logo_image || '',
          whatsappNumber: portfolioData.whatsapp || '',
          email: portfolioData.email || '',
          github: portfolioData.github || '',
          instagram: portfolioData.instagram || '',
          location: portfolioData.location || '',
          skills: (skillsRes.data || []).map(s => ({
            id: s.id,
            name: s.name,
            percentage: s.percentage,
          })),
          packages: (packagesRes.data || []).map(p => ({
            id: p.id,
            name: p.name,
            priceMin: p.price_min,
            priceMax: p.price_max,
            features: p.features || [],
          })),
          projects: (projectsRes.data || []).map(p => ({
            id: p.id,
            title: p.title,
            description: p.description || '',
            image: p.image || '',
            category: p.category || '',
            technologies: p.technologies || [],
            liveUrl: p.live_url || undefined,
            githubUrl: p.github_url || undefined,
          })),
        });
      }
    } catch (error) {
      console.error('Error fetching portfolio data:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const updatePortfolio = async (updates: Partial<PortfolioData>) => {
    if (!data.id) return false;

    try {
      const { error } = await supabase
        .from('portfolio_data')
        .update({
          name: updates.name ?? data.name,
          tagline: updates.tagline ?? data.tagline,
          age: updates.age ?? data.age,
          grade: updates.grade ?? data.grade,
          bio: updates.bio ?? data.bio,
          profile_image: updates.profileImage ?? data.profileImage,
          logo_image: updates.logoImage ?? data.logoImage,
          whatsapp: updates.whatsappNumber ?? data.whatsappNumber,
          email: updates.email ?? data.email,
          github: updates.github ?? data.github,
          instagram: updates.instagram ?? data.instagram,
          location: updates.location ?? data.location,
        })
        .eq('id', data.id);

      if (error) throw error;
      
      await fetchData();
      return true;
    } catch (error) {
      console.error('Error updating portfolio:', error);
      toast({
        title: 'Error',
        description: 'Gagal menyimpan perubahan',
        variant: 'destructive',
      });
      return false;
    }
  };

  const updateSkills = async (skills: Skill[]) => {
    if (!data.id) return false;

    try {
      // Delete existing skills
      await supabase.from('skills').delete().eq('portfolio_id', data.id);
      
      // Insert new skills
      if (skills.length > 0) {
        const { error } = await supabase.from('skills').insert(
          skills.map((s, index) => ({
            portfolio_id: data.id,
            name: s.name,
            percentage: s.percentage,
            sort_order: index,
          }))
        );
        if (error) throw error;
      }
      
      await fetchData();
      return true;
    } catch (error) {
      console.error('Error updating skills:', error);
      return false;
    }
  };

  const updatePackages = async (packages: Package[]) => {
    if (!data.id) return false;

    try {
      // Delete existing packages
      await supabase.from('packages').delete().eq('portfolio_id', data.id);
      
      // Insert new packages
      if (packages.length > 0) {
        const { error } = await supabase.from('packages').insert(
          packages.map((p, index) => ({
            portfolio_id: data.id,
            name: p.name,
            price_min: p.priceMin,
            price_max: p.priceMax,
            features: p.features,
            sort_order: index,
          }))
        );
        if (error) throw error;
      }
      
      await fetchData();
      return true;
    } catch (error) {
      console.error('Error updating packages:', error);
      return false;
    }
  };

  const updateProjects = async (projects: Project[]) => {
    if (!data.id) return false;

    try {
      // Delete existing projects
      await supabase.from('projects').delete().eq('portfolio_id', data.id);
      
      // Insert new projects
      if (projects.length > 0) {
        const { error } = await supabase.from('projects').insert(
          projects.map((p, index) => ({
            portfolio_id: data.id,
            title: p.title,
            description: p.description,
            image: p.image,
            category: p.category,
            technologies: p.technologies,
            live_url: p.liveUrl,
            github_url: p.githubUrl,
            sort_order: index,
          }))
        );
        if (error) throw error;
      }
      
      await fetchData();
      return true;
    } catch (error) {
      console.error('Error updating projects:', error);
      return false;
    }
  };

  return {
    data,
    isLoading,
    refetch: fetchData,
    updatePortfolio,
    updateSkills,
    updatePackages,
    updateProjects,
  };
};

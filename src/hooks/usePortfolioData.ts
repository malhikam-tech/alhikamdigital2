import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

// Types
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

export interface Skill {
  id: string;
  name: string;
  percentage: number;
  portfolio_id: string | null;
  sort_order: number;
}

export interface Package {
  id: string;
  name: string;
  price_min: number;
  price_max: number;
  features: string[] | null;
  portfolio_id: string | null;
  sort_order: number;
}

export interface Project {
  id: string;
  title: string;
  description: string | null;
  image: string | null;
  category: string | null;
  technologies: string[] | null;
  live_url: string | null;
  github_url: string | null;
  portfolio_id: string | null;
  sort_order: number;
}

// Fetch portfolio data
export function usePortfolioQuery() {
  return useQuery({
    queryKey: ['portfolio'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('portfolio_data')
        .select('*')
        .limit(1)
        .single();
      
      if (error) throw error;
      return data as PortfolioData;
    },
  });
}

// Fetch skills
export function useSkillsQuery() {
  return useQuery({
    queryKey: ['skills'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('skills')
        .select('*')
        .order('sort_order', { ascending: true });
      
      if (error) throw error;
      return data as Skill[];
    },
  });
}

// Fetch packages
export function usePackagesQuery() {
  return useQuery({
    queryKey: ['packages'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('packages')
        .select('*')
        .order('sort_order', { ascending: true });
      
      if (error) throw error;
      return data as Package[];
    },
  });
}

// Fetch projects
export function useProjectsQuery() {
  return useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('sort_order', { ascending: true });
      
      if (error) throw error;
      return data as Project[];
    },
  });
}

// Update portfolio data
export function useUpdatePortfolio() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: Partial<PortfolioData> & { id: string }) => {
      const { error } = await supabase
        .from('portfolio_data')
        .update(data)
        .eq('id', data.id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['portfolio'] });
      toast({
        title: "Berhasil disimpan!",
        description: "Data portfolio telah diperbarui",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Gagal menyimpan",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

// Update skills
export function useUpdateSkills() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (skills: Skill[]) => {
      // Update each skill
      for (const skill of skills) {
        const { error } = await supabase
          .from('skills')
          .update({ name: skill.name, percentage: skill.percentage })
          .eq('id', skill.id);
        
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['skills'] });
      toast({
        title: "Berhasil disimpan!",
        description: "Skills telah diperbarui",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Gagal menyimpan",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

// Update packages
export function useUpdatePackages() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (packages: Package[]) => {
      for (const pkg of packages) {
        const { error } = await supabase
          .from('packages')
          .update({ 
            name: pkg.name, 
            price_min: pkg.price_min, 
            price_max: pkg.price_max,
            features: pkg.features 
          })
          .eq('id', pkg.id);
        
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['packages'] });
      toast({
        title: "Berhasil disimpan!",
        description: "Packages telah diperbarui",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Gagal menyimpan",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

// Update/Create/Delete projects
export function useUpdateProjects() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (projects: Project[]) => {
      for (const project of projects) {
        const { error } = await supabase
          .from('projects')
          .upsert({
            id: project.id,
            title: project.title,
            description: project.description,
            image: project.image,
            category: project.category,
            technologies: project.technologies,
            live_url: project.live_url,
            github_url: project.github_url,
            sort_order: project.sort_order,
          });
        
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      toast({
        title: "Berhasil disimpan!",
        description: "Projects telah diperbarui",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Gagal menyimpan",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

export function useDeleteProject() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (projectId: string) => {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', projectId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      toast({
        title: "Project dihapus",
        description: "Project telah dihapus dari database",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Gagal menghapus",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

export function useCreateProject() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (project: Omit<Project, 'id'>) => {
      const { error } = await supabase
        .from('projects')
        .insert(project);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      toast({
        title: "Project ditambahkan",
        description: "Project baru telah ditambahkan",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Gagal menambahkan",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

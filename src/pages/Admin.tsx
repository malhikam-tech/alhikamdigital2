import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { 
  LogOut, Save, User, Image, Code, Shield, 
  Link as LinkIcon, Package, MessageCircle, Briefcase, Plus, Trash2, Loader2
} from 'lucide-react';
import {
  usePortfolioQuery,
  useSkillsQuery,
  usePackagesQuery,
  useProjectsQuery,
  useUpdatePortfolio,
  useUpdateSkills,
  useUpdatePackages,
  useUpdateProjects,
  useDeleteProject,
  useCreateProject,
  type PortfolioData,
  type Skill,
  type Package as PackageType,
  type Project,
} from '@/hooks/usePortfolioData';

const Admin: React.FC = () => {
  const { isAdmin, loading: authLoading, logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const { data: portfolio, isLoading: portfolioLoading } = usePortfolioQuery();
  const { data: skills, isLoading: skillsLoading } = useSkillsQuery();
  const { data: packages, isLoading: packagesLoading } = usePackagesQuery();
  const { data: projects, isLoading: projectsLoading } = useProjectsQuery();
  
  const updatePortfolio = useUpdatePortfolio();
  const updateSkills = useUpdateSkills();
  const updatePackages = useUpdatePackages();
  const updateProjects = useUpdateProjects();
  const deleteProject = useDeleteProject();
  const createProject = useCreateProject();
  
  const [activeTab, setActiveTab] = useState('profile');
  const [formData, setFormData] = useState<Partial<PortfolioData>>({});
  const [skillsForm, setSkillsForm] = useState<Skill[]>([]);
  const [packagesForm, setPackagesForm] = useState<PackageType[]>([]);
  const [projectsForm, setProjectsForm] = useState<Project[]>([]);
  const [newProject, setNewProject] = useState({
    title: '',
    description: '',
    image: '',
    category: 'Web Development',
    technologies: [] as string[],
    live_url: '',
    github_url: '',
  });

  // Redirect if not admin
  useEffect(() => {
    if (!authLoading && !isAdmin) {
      navigate('/login');
    }
  }, [isAdmin, authLoading, navigate]);

  // Set form data when data loads
  useEffect(() => {
    if (portfolio) setFormData(portfolio);
  }, [portfolio]);

  useEffect(() => {
    if (skills) setSkillsForm(skills);
  }, [skills]);

  useEffect(() => {
    if (packages) setPackagesForm(packages);
  }, [packages]);

  useEffect(() => {
    if (projects) setProjectsForm(projects);
  }, [projects]);

  const handleSaveProfile = () => {
    if (portfolio && formData) {
      updatePortfolio.mutate({ ...formData, id: portfolio.id } as PortfolioData & { id: string });
    }
  };

  const handleSaveSkills = () => {
    updateSkills.mutate(skillsForm);
  };

  const handleSavePackages = () => {
    updatePackages.mutate(packagesForm);
  };

  const handleSaveProjects = () => {
    updateProjects.mutate(projectsForm);
  };

  const handleDeleteProject = (projectId: string) => {
    if (confirm('Yakin ingin menghapus project ini?')) {
      deleteProject.mutate(projectId);
    }
  };

  const handleAddProject = () => {
    if (!newProject.title) {
      toast({
        title: "Error",
        description: "Judul project harus diisi",
        variant: "destructive",
      });
      return;
    }
    
    createProject.mutate({
      ...newProject,
      portfolio_id: portfolio?.id || null,
      sort_order: projectsForm.length,
    });
    
    setNewProject({
      title: '',
      description: '',
      image: '',
      category: 'Web Development',
      technologies: [],
      live_url: '',
      github_url: '',
    });
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const updateSkillForm = (index: number, field: keyof Skill, value: string | number) => {
    const newSkills = [...skillsForm];
    newSkills[index] = { ...newSkills[index], [field]: value };
    setSkillsForm(newSkills);
  };

  const updatePackageForm = (index: number, field: keyof PackageType, value: string | number | string[] | null) => {
    const newPackages = [...packagesForm];
    newPackages[index] = { ...newPackages[index], [field]: value };
    setPackagesForm(newPackages);
  };

  const updateProjectForm = (index: number, field: keyof Project, value: string | string[] | null) => {
    const newProjects = [...projectsForm];
    newProjects[index] = { ...newProjects[index], [field]: value };
    setProjectsForm(newProjects);
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'skills', label: 'Skills', icon: Code },
    { id: 'packages', label: 'Packages', icon: Package },
    { id: 'projects', label: 'Projects', icon: Briefcase },
    { id: 'social', label: 'Social', icon: LinkIcon },
  ];

  const isLoading = authLoading || portfolioLoading || skillsLoading || packagesLoading || projectsLoading;

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="glass-card border-b border-border/30 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
            <h1 className="text-sm font-heading font-bold text-foreground">Admin Panel</h1>
            <span className="text-xs text-muted-foreground">(Supabase)</span>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1 px-3 py-1.5 bg-destructive/10 text-destructive rounded-lg text-xs font-medium hover:bg-destructive/20 transition-colors"
          >
            <LogOut className="w-3 h-3" />
            Logout
          </button>
        </div>
      </header>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="container mx-auto px-4 py-6">
          <div className="grid lg:grid-cols-[200px_1fr] gap-6">
            {/* Sidebar */}
            <aside className="glass-card rounded-xl p-4 h-fit lg:sticky lg:top-20">
              <nav className="space-y-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                      activeTab === tab.id
                        ? 'bg-primary/10 text-primary border border-primary/30'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                    }`}
                  >
                    <tab.icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                ))}
              </nav>
            </aside>

            {/* Content */}
            <main className="glass-card rounded-xl p-6">
              {/* Profile Tab */}
              {activeTab === 'profile' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-heading font-semibold text-foreground">Profile</h2>
                    <button
                      onClick={handleSaveProfile}
                      disabled={updatePortfolio.isPending}
                      className="flex items-center gap-1 px-3 py-1.5 bg-primary text-primary-foreground rounded-lg text-xs font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
                    >
                      {updatePortfolio.isPending ? <Loader2 className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />}
                      Simpan
                    </button>
                  </div>
                  
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-muted-foreground mb-1">Nama</label>
                      <input
                        type="text"
                        value={formData.name || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:border-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-muted-foreground mb-1">Tagline</label>
                      <input
                        type="text"
                        value={formData.tagline || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, tagline: e.target.value }))}
                        className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:border-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-muted-foreground mb-1">Umur</label>
                      <input
                        type="number"
                        value={formData.age || 0}
                        onChange={(e) => setFormData(prev => ({ ...prev, age: parseInt(e.target.value) || 0 }))}
                        className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:border-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-muted-foreground mb-1">Kelas</label>
                      <input
                        type="text"
                        value={formData.grade || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, grade: e.target.value }))}
                        className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:border-primary"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-1">Bio</label>
                    <textarea
                      value={formData.bio || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                      rows={4}
                      className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:border-primary resize-none"
                    />
                  </div>
                </div>
              )}

              {/* Skills Tab */}
              {activeTab === 'skills' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-heading font-semibold text-foreground">Skills</h2>
                    <button
                      onClick={handleSaveSkills}
                      disabled={updateSkills.isPending}
                      className="flex items-center gap-1 px-3 py-1.5 bg-primary text-primary-foreground rounded-lg text-xs font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
                    >
                      {updateSkills.isPending ? <Loader2 className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />}
                      Simpan
                    </button>
                  </div>
                  
                  <div className="space-y-3">
                    {skillsForm.map((skill, index) => (
                      <div key={skill.id} className="grid grid-cols-[1fr_80px] gap-2 items-center">
                        <input
                          type="text"
                          value={skill.name}
                          onChange={(e) => updateSkillForm(index, 'name', e.target.value)}
                          className="px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:border-primary"
                        />
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={skill.percentage}
                          onChange={(e) => updateSkillForm(index, 'percentage', parseInt(e.target.value) || 0)}
                          className="px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:border-primary"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Packages Tab */}
              {activeTab === 'packages' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-heading font-semibold text-foreground">Packages</h2>
                    <button
                      onClick={handleSavePackages}
                      disabled={updatePackages.isPending}
                      className="flex items-center gap-1 px-3 py-1.5 bg-primary text-primary-foreground rounded-lg text-xs font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
                    >
                      {updatePackages.isPending ? <Loader2 className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />}
                      Simpan
                    </button>
                  </div>
                  
                  {packagesForm.map((pkg, index) => (
                    <div key={pkg.id} className="p-4 border border-border rounded-lg space-y-3">
                      <h3 className="text-sm font-semibold text-foreground">{pkg.name}</h3>
                      <div className="grid sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs text-muted-foreground mb-1">Harga Min (Rp)</label>
                          <input
                            type="number"
                            value={pkg.price_min}
                            onChange={(e) => updatePackageForm(index, 'price_min', parseInt(e.target.value) || 0)}
                            className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:border-primary"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-muted-foreground mb-1">Harga Max (Rp)</label>
                          <input
                            type="number"
                            value={pkg.price_max}
                            onChange={(e) => updatePackageForm(index, 'price_max', parseInt(e.target.value) || 0)}
                            className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:border-primary"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs text-muted-foreground mb-1">Features (pisahkan dengan enter)</label>
                        <textarea
                          value={pkg.features?.join('\n') || ''}
                          onChange={(e) => updatePackageForm(index, 'features', e.target.value.split('\n'))}
                          rows={4}
                          className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:border-primary resize-none"
                        />
                      </div>
                    </div>
                  ))}

                  <div className="p-4 border border-border rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <MessageCircle className="w-4 h-4 text-primary" />
                      <label className="text-sm font-medium text-foreground">WhatsApp Number</label>
                    </div>
                    <input
                      type="text"
                      value={formData.whatsapp || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, whatsapp: e.target.value }))}
                      className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:border-primary"
                      placeholder="+62 xxx xxxx xxxx"
                    />
                    <button
                      onClick={handleSaveProfile}
                      disabled={updatePortfolio.isPending}
                      className="mt-2 flex items-center gap-1 px-3 py-1.5 bg-primary text-primary-foreground rounded-lg text-xs font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
                    >
                      {updatePortfolio.isPending ? <Loader2 className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />}
                      Simpan WhatsApp
                    </button>
                  </div>
                </div>
              )}

              {/* Projects Tab */}
              {activeTab === 'projects' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-heading font-semibold text-foreground">Projects</h2>
                    <button
                      onClick={handleSaveProjects}
                      disabled={updateProjects.isPending}
                      className="flex items-center gap-1 px-3 py-1.5 bg-primary text-primary-foreground rounded-lg text-xs font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
                    >
                      {updateProjects.isPending ? <Loader2 className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />}
                      Simpan Semua
                    </button>
                  </div>
                  
                  {/* Existing Projects */}
                  <div className="space-y-4">
                    {projectsForm.map((project, index) => (
                      <div key={project.id} className="p-4 border border-border rounded-lg space-y-3">
                        <div className="flex items-center justify-between">
                          <h3 className="text-sm font-semibold text-foreground">{project.title}</h3>
                          <button
                            onClick={() => handleDeleteProject(project.id)}
                            disabled={deleteProject.isPending}
                            className="p-1.5 text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="grid sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs text-muted-foreground mb-1">Judul</label>
                            <input
                              type="text"
                              value={project.title}
                              onChange={(e) => updateProjectForm(index, 'title', e.target.value)}
                              className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:border-primary"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-muted-foreground mb-1">Category</label>
                            <input
                              type="text"
                              value={project.category || ''}
                              onChange={(e) => updateProjectForm(index, 'category', e.target.value)}
                              className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:border-primary"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs text-muted-foreground mb-1">Deskripsi</label>
                          <textarea
                            value={project.description || ''}
                            onChange={(e) => updateProjectForm(index, 'description', e.target.value)}
                            rows={2}
                            className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:border-primary resize-none"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-muted-foreground mb-1">Image URL</label>
                          <input
                            type="text"
                            value={project.image || ''}
                            onChange={(e) => updateProjectForm(index, 'image', e.target.value)}
                            className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:border-primary"
                          />
                        </div>
                        <div className="grid sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs text-muted-foreground mb-1">Live URL</label>
                            <input
                              type="text"
                              value={project.live_url || ''}
                              onChange={(e) => updateProjectForm(index, 'live_url', e.target.value)}
                              className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:border-primary"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-muted-foreground mb-1">GitHub URL</label>
                            <input
                              type="text"
                              value={project.github_url || ''}
                              onChange={(e) => updateProjectForm(index, 'github_url', e.target.value)}
                              className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:border-primary"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs text-muted-foreground mb-1">Technologies (pisahkan dengan koma)</label>
                          <input
                            type="text"
                            value={project.technologies?.join(', ') || ''}
                            onChange={(e) => updateProjectForm(index, 'technologies', e.target.value.split(',').map(t => t.trim()))}
                            className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:border-primary"
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Add New Project */}
                  <div className="p-4 border-2 border-dashed border-primary/30 rounded-lg space-y-3">
                    <h3 className="text-sm font-semibold text-primary flex items-center gap-2">
                      <Plus className="w-4 h-4" />
                      Tambah Project Baru
                    </h3>
                    <div className="grid sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs text-muted-foreground mb-1">Judul *</label>
                        <input
                          type="text"
                          value={newProject.title}
                          onChange={(e) => setNewProject(prev => ({ ...prev, title: e.target.value }))}
                          className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:border-primary"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-muted-foreground mb-1">Category</label>
                        <input
                          type="text"
                          value={newProject.category}
                          onChange={(e) => setNewProject(prev => ({ ...prev, category: e.target.value }))}
                          className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:border-primary"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs text-muted-foreground mb-1">Deskripsi</label>
                      <textarea
                        value={newProject.description}
                        onChange={(e) => setNewProject(prev => ({ ...prev, description: e.target.value }))}
                        rows={2}
                        className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:border-primary resize-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-muted-foreground mb-1">Image URL</label>
                      <input
                        type="text"
                        value={newProject.image}
                        onChange={(e) => setNewProject(prev => ({ ...prev, image: e.target.value }))}
                        className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:border-primary"
                        placeholder="https://images.unsplash.com/..."
                      />
                    </div>
                    <button
                      onClick={handleAddProject}
                      disabled={createProject.isPending}
                      className="flex items-center gap-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-xs font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
                    >
                      {createProject.isPending ? <Loader2 className="w-3 h-3 animate-spin" /> : <Plus className="w-3 h-3" />}
                      Tambah Project
                    </button>
                  </div>
                </div>
              )}

              {/* Social Tab */}
              {activeTab === 'social' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-heading font-semibold text-foreground">Social Links</h2>
                    <button
                      onClick={handleSaveProfile}
                      disabled={updatePortfolio.isPending}
                      className="flex items-center gap-1 px-3 py-1.5 bg-primary text-primary-foreground rounded-lg text-xs font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
                    >
                      {updatePortfolio.isPending ? <Loader2 className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />}
                      Simpan
                    </button>
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-1">GitHub URL</label>
                    <input
                      type="url"
                      value={formData.github || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, github: e.target.value }))}
                      className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:border-primary"
                      placeholder="https://github.com/username"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-1">Instagram URL</label>
                    <input
                      type="url"
                      value={formData.instagram || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, instagram: e.target.value }))}
                      className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:border-primary"
                      placeholder="https://instagram.com/username"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-1">Email</label>
                    <input
                      type="email"
                      value={formData.email || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:border-primary"
                      placeholder="email@example.com"
                    />
                  </div>
                </div>
              )}
            </main>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;

import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { usePortfolioData, Skill, Package, Project } from '@/hooks/usePortfolioData';
import { useToast } from '@/hooks/use-toast';
import { 
  LogOut, Save, User, Image, Code, 
  Link as LinkIcon, Package as PackageIcon, MessageCircle, Upload, X, 
  Loader2, Plus, Trash2, FolderOpen
} from 'lucide-react';

const AdminPanel: React.FC = () => {
  const { user, isAdmin, isLoading: authLoading, signOut } = useAuth();
  const { data, isLoading: dataLoading, updatePortfolio, updateSkills, updatePackages, updateProjects } = usePortfolioData();
  const navigate = useNavigate();
  const { toast } = useToast();
  const profileInputRef = useRef<HTMLInputElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);
  
  const [activeTab, setActiveTab] = useState('profile');
  const [isSaving, setIsSaving] = useState(false);
  
  // Form states
  const [formData, setFormData] = useState({
    name: '',
    tagline: '',
    age: 13,
    grade: '',
    bio: '',
    profileImage: '',
    logoImage: '',
    whatsappNumber: '',
    email: '',
    github: '',
    instagram: '',
    location: '',
  });
  const [skills, setSkills] = useState<Skill[]>([]);
  const [packages, setPackages] = useState<Package[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);

  // Sync form data with fetched data
  useEffect(() => {
    if (data) {
      setFormData({
        name: data.name,
        tagline: data.tagline,
        age: data.age,
        grade: data.grade,
        bio: data.bio,
        profileImage: data.profileImage,
        logoImage: data.logoImage,
        whatsappNumber: data.whatsappNumber,
        email: data.email,
        github: data.github,
        instagram: data.instagram,
        location: data.location,
      });
      setSkills(data.skills);
      setPackages(data.packages);
      setProjects(data.projects);
    }
  }, [data]);

  // Redirect if not authenticated or not admin
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [authLoading, user, navigate]);

  const handleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>, 
    type: 'profileImage' | 'logoImage'
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          [type]: reader.result as string
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    
    try {
      const results = await Promise.all([
        updatePortfolio(formData),
        updateSkills(skills),
        updatePackages(packages),
        updateProjects(projects),
      ]);
      
      if (results.every(r => r)) {
        toast({
          title: 'Berhasil disimpan!',
          description: 'Perubahan telah diterapkan dan tersinkronisasi',
        });
      } else {
        throw new Error('Some updates failed');
      }
    } catch (error) {
      toast({
        title: 'Gagal menyimpan',
        description: 'Terjadi kesalahan saat menyimpan',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  // Skill handlers
  const addSkill = () => {
    setSkills([...skills, { id: crypto.randomUUID(), name: '', percentage: 50 }]);
  };

  const removeSkill = (index: number) => {
    setSkills(skills.filter((_, i) => i !== index));
  };

  const updateSkill = (index: number, field: keyof Skill, value: string | number) => {
    const newSkills = [...skills];
    newSkills[index] = { ...newSkills[index], [field]: value };
    setSkills(newSkills);
  };

  // Package handlers
  const addPackage = () => {
    setPackages([...packages, { 
      id: crypto.randomUUID(), 
      name: 'New Package', 
      priceMin: 0, 
      priceMax: 0, 
      features: [] 
    }]);
  };

  const removePackage = (index: number) => {
    setPackages(packages.filter((_, i) => i !== index));
  };

  const updatePackageField = (index: number, field: string, value: string | number | string[]) => {
    const newPackages = [...packages];
    newPackages[index] = { ...newPackages[index], [field]: value };
    setPackages(newPackages);
  };

  // Project handlers
  const addProject = () => {
    setProjects([...projects, {
      id: crypto.randomUUID(),
      title: 'New Project',
      description: '',
      image: '',
      category: 'Web Development',
      technologies: [],
      liveUrl: '',
      githubUrl: '',
    }]);
  };

  const removeProject = (index: number) => {
    setProjects(projects.filter((_, i) => i !== index));
  };

  const updateProjectField = (index: number, field: keyof Project, value: string | string[]) => {
    const newProjects = [...projects];
    newProjects[index] = { ...newProjects[index], [field]: value };
    setProjects(newProjects);
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'images', label: 'Images', icon: Image },
    { id: 'skills', label: 'Skills', icon: Code },
    { id: 'packages', label: 'Packages', icon: PackageIcon },
    { id: 'projects', label: 'Projects', icon: FolderOpen },
    { id: 'social', label: 'Social', icon: LinkIcon },
  ];

  if (authLoading || dataLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="glass-card border-b border-border/30 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Code className="w-5 h-5 text-primary" />
            <h1 className="text-sm font-heading font-bold text-foreground">Admin Panel</h1>
            {!isAdmin && (
              <span className="text-xs text-muted-foreground">(View Only)</span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {isAdmin && (
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center gap-1 px-3 py-1.5 bg-primary text-primary-foreground rounded-lg text-xs font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                {isSaving ? <Loader2 className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />}
                Save
              </button>
            )}
            <button
              onClick={handleLogout}
              className="flex items-center gap-1 px-3 py-1.5 bg-destructive/10 text-destructive rounded-lg text-xs font-medium hover:bg-destructive/20 transition-colors"
            >
              <LogOut className="w-3 h-3" />
              Logout
            </button>
          </div>
        </div>
      </header>

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
                <h2 className="text-lg font-heading font-semibold text-foreground">Profile</h2>
                
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-1">Nama</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      disabled={!isAdmin}
                      className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:border-primary disabled:opacity-50"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-1">Tagline</label>
                    <input
                      type="text"
                      value={formData.tagline}
                      onChange={(e) => setFormData(prev => ({ ...prev, tagline: e.target.value }))}
                      disabled={!isAdmin}
                      className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:border-primary disabled:opacity-50"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-1">Umur</label>
                    <input
                      type="number"
                      value={formData.age}
                      onChange={(e) => setFormData(prev => ({ ...prev, age: parseInt(e.target.value) || 0 }))}
                      disabled={!isAdmin}
                      className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:border-primary disabled:opacity-50"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-1">Kelas</label>
                    <input
                      type="text"
                      value={formData.grade}
                      onChange={(e) => setFormData(prev => ({ ...prev, grade: e.target.value }))}
                      disabled={!isAdmin}
                      className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:border-primary disabled:opacity-50"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Bio</label>
                  <textarea
                    value={formData.bio}
                    onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                    disabled={!isAdmin}
                    rows={4}
                    className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:border-primary resize-none disabled:opacity-50"
                  />
                </div>
              </div>
            )}

            {/* Images Tab */}
            {activeTab === 'images' && (
              <div className="space-y-6">
                <h2 className="text-lg font-heading font-semibold text-foreground">Images</h2>
                
                {/* Profile Image */}
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-2">Foto Profile</label>
                  <div className="flex items-center gap-4">
                    <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-border bg-muted flex-shrink-0">
                      {formData.profileImage ? (
                        <img src={formData.profileImage} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                          <User className="w-8 h-8" />
                        </div>
                      )}
                    </div>
                    {isAdmin && (
                      <div className="flex flex-col gap-2">
                        <input
                          ref={profileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageUpload(e, 'profileImage')}
                          className="hidden"
                        />
                        <button
                          onClick={() => profileInputRef.current?.click()}
                          className="flex items-center gap-1 px-3 py-1.5 btn-neon rounded-lg text-xs"
                        >
                          <Upload className="w-3 h-3" />
                          Upload
                        </button>
                        {formData.profileImage && (
                          <button
                            onClick={() => setFormData(prev => ({ ...prev, profileImage: '' }))}
                            className="flex items-center gap-1 px-3 py-1.5 bg-destructive/10 text-destructive rounded-lg text-xs"
                          >
                            <X className="w-3 h-3" />
                            Remove
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Logo Image */}
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-2">Logo</label>
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-lg overflow-hidden border border-border bg-muted flex items-center justify-center flex-shrink-0">
                      {formData.logoImage ? (
                        <img src={formData.logoImage} alt="Logo" className="w-full h-full object-contain p-2" />
                      ) : (
                        <Code className="w-6 h-6 text-muted-foreground" />
                      )}
                    </div>
                    {isAdmin && (
                      <div className="flex flex-col gap-2">
                        <input
                          ref={logoInputRef}
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageUpload(e, 'logoImage')}
                          className="hidden"
                        />
                        <button
                          onClick={() => logoInputRef.current?.click()}
                          className="flex items-center gap-1 px-3 py-1.5 btn-neon rounded-lg text-xs"
                        >
                          <Upload className="w-3 h-3" />
                          Upload
                        </button>
                        {formData.logoImage && (
                          <button
                            onClick={() => setFormData(prev => ({ ...prev, logoImage: '' }))}
                            className="flex items-center gap-1 px-3 py-1.5 bg-destructive/10 text-destructive rounded-lg text-xs"
                          >
                            <X className="w-3 h-3" />
                            Remove
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Skills Tab */}
            {activeTab === 'skills' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-heading font-semibold text-foreground">Skills</h2>
                  {isAdmin && (
                    <button
                      onClick={addSkill}
                      className="flex items-center gap-1 px-3 py-1.5 btn-neon rounded-lg text-xs"
                    >
                      <Plus className="w-3 h-3" />
                      Add Skill
                    </button>
                  )}
                </div>
                
                <div className="space-y-3">
                  {skills.map((skill, index) => (
                    <div key={skill.id} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={skill.name}
                        onChange={(e) => updateSkill(index, 'name', e.target.value)}
                        disabled={!isAdmin}
                        placeholder="Skill name"
                        className="flex-1 px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:border-primary disabled:opacity-50"
                      />
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={skill.percentage}
                        onChange={(e) => updateSkill(index, 'percentage', parseInt(e.target.value) || 0)}
                        disabled={!isAdmin}
                        className="w-20 px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:border-primary disabled:opacity-50"
                      />
                      <span className="text-xs text-muted-foreground">%</span>
                      {isAdmin && (
                        <button
                          onClick={() => removeSkill(index)}
                          className="p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                  {skills.length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-8">
                      Belum ada skill. {isAdmin && 'Klik "Add Skill" untuk menambahkan.'}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Packages Tab */}
            {activeTab === 'packages' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-heading font-semibold text-foreground">Packages</h2>
                  {isAdmin && (
                    <button
                      onClick={addPackage}
                      className="flex items-center gap-1 px-3 py-1.5 btn-neon rounded-lg text-xs"
                    >
                      <Plus className="w-3 h-3" />
                      Add Package
                    </button>
                  )}
                </div>
                
                {packages.map((pkg, index) => (
                  <div key={pkg.id} className="p-4 border border-border rounded-lg space-y-3">
                    <div className="flex items-center justify-between">
                      <input
                        type="text"
                        value={pkg.name}
                        onChange={(e) => updatePackageField(index, 'name', e.target.value)}
                        disabled={!isAdmin}
                        className="text-sm font-semibold bg-transparent border-0 focus:outline-none focus:ring-0 disabled:opacity-50"
                      />
                      {isAdmin && (
                        <button
                          onClick={() => removePackage(index)}
                          className="p-1 text-destructive hover:bg-destructive/10 rounded transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                    <div className="grid sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs text-muted-foreground mb-1">Harga Min (Rp)</label>
                        <input
                          type="number"
                          value={pkg.priceMin}
                          onChange={(e) => updatePackageField(index, 'priceMin', parseInt(e.target.value) || 0)}
                          disabled={!isAdmin}
                          className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:border-primary disabled:opacity-50"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-muted-foreground mb-1">Harga Max (Rp)</label>
                        <input
                          type="number"
                          value={pkg.priceMax}
                          onChange={(e) => updatePackageField(index, 'priceMax', parseInt(e.target.value) || 0)}
                          disabled={!isAdmin}
                          className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:border-primary disabled:opacity-50"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs text-muted-foreground mb-1">Features (pisahkan dengan enter)</label>
                      <textarea
                        value={pkg.features.join('\n')}
                        onChange={(e) => updatePackageField(index, 'features', e.target.value.split('\n').filter(f => f.trim()))}
                        disabled={!isAdmin}
                        rows={4}
                        className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:border-primary resize-none disabled:opacity-50"
                      />
                    </div>
                  </div>
                ))}

                {packages.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    Belum ada package. {isAdmin && 'Klik "Add Package" untuk menambahkan.'}
                  </p>
                )}

                <div className="p-4 border border-border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <MessageCircle className="w-4 h-4 text-primary" />
                    <label className="text-sm font-medium text-foreground">WhatsApp Number</label>
                  </div>
                  <input
                    type="text"
                    value={formData.whatsappNumber}
                    onChange={(e) => setFormData(prev => ({ ...prev, whatsappNumber: e.target.value }))}
                    disabled={!isAdmin}
                    className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:border-primary disabled:opacity-50"
                    placeholder="+62 xxx xxxx xxxx"
                  />
                </div>
              </div>
            )}

            {/* Projects Tab */}
            {activeTab === 'projects' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-heading font-semibold text-foreground">Projects</h2>
                  {isAdmin && (
                    <button
                      onClick={addProject}
                      className="flex items-center gap-1 px-3 py-1.5 btn-neon rounded-lg text-xs"
                    >
                      <Plus className="w-3 h-3" />
                      Add Project
                    </button>
                  )}
                </div>
                
                {projects.map((project, index) => (
                  <div key={project.id} className="p-4 border border-border rounded-lg space-y-3">
                    <div className="flex items-center justify-between">
                      <input
                        type="text"
                        value={project.title}
                        onChange={(e) => updateProjectField(index, 'title', e.target.value)}
                        disabled={!isAdmin}
                        placeholder="Project Title"
                        className="text-sm font-semibold bg-transparent border-0 focus:outline-none disabled:opacity-50"
                      />
                      {isAdmin && (
                        <button
                          onClick={() => removeProject(index)}
                          className="p-1 text-destructive hover:bg-destructive/10 rounded transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                    
                    <div className="grid sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs text-muted-foreground mb-1">Category</label>
                        <input
                          type="text"
                          value={project.category}
                          onChange={(e) => updateProjectField(index, 'category', e.target.value)}
                          disabled={!isAdmin}
                          className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:border-primary disabled:opacity-50"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-muted-foreground mb-1">Image URL</label>
                        <input
                          type="text"
                          value={project.image}
                          onChange={(e) => updateProjectField(index, 'image', e.target.value)}
                          disabled={!isAdmin}
                          className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:border-primary disabled:opacity-50"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-xs text-muted-foreground mb-1">Description</label>
                      <textarea
                        value={project.description}
                        onChange={(e) => updateProjectField(index, 'description', e.target.value)}
                        disabled={!isAdmin}
                        rows={2}
                        className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:border-primary resize-none disabled:opacity-50"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-xs text-muted-foreground mb-1">Technologies (comma separated)</label>
                      <input
                        type="text"
                        value={project.technologies.join(', ')}
                        onChange={(e) => updateProjectField(index, 'technologies', e.target.value.split(',').map(t => t.trim()).filter(t => t))}
                        disabled={!isAdmin}
                        className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:border-primary disabled:opacity-50"
                      />
                    </div>
                    
                    <div className="grid sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs text-muted-foreground mb-1">Live URL</label>
                        <input
                          type="text"
                          value={project.liveUrl || ''}
                          onChange={(e) => updateProjectField(index, 'liveUrl', e.target.value)}
                          disabled={!isAdmin}
                          className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:border-primary disabled:opacity-50"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-muted-foreground mb-1">GitHub URL</label>
                        <input
                          type="text"
                          value={project.githubUrl || ''}
                          onChange={(e) => updateProjectField(index, 'githubUrl', e.target.value)}
                          disabled={!isAdmin}
                          className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:border-primary disabled:opacity-50"
                        />
                      </div>
                    </div>
                  </div>
                ))}

                {projects.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    Belum ada project. {isAdmin && 'Klik "Add Project" untuk menambahkan.'}
                  </p>
                )}
              </div>
            )}

            {/* Social Tab */}
            {activeTab === 'social' && (
              <div className="space-y-4">
                <h2 className="text-lg font-heading font-semibold text-foreground">Social Links</h2>
                
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">GitHub URL</label>
                  <input
                    type="url"
                    value={formData.github}
                    onChange={(e) => setFormData(prev => ({ ...prev, github: e.target.value }))}
                    disabled={!isAdmin}
                    className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:border-primary disabled:opacity-50"
                    placeholder="https://github.com/username"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Instagram URL</label>
                  <input
                    type="url"
                    value={formData.instagram}
                    onChange={(e) => setFormData(prev => ({ ...prev, instagram: e.target.value }))}
                    disabled={!isAdmin}
                    className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:border-primary disabled:opacity-50"
                    placeholder="https://instagram.com/username"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    disabled={!isAdmin}
                    className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:border-primary disabled:opacity-50"
                    placeholder="email@example.com"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Location</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                    disabled={!isAdmin}
                    className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:border-primary disabled:opacity-50"
                    placeholder="Indonesia"
                  />
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;

import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { usePortfolioData } from '@/hooks/usePortfolioData';
import { useToast } from '@/hooks/use-toast';
import { 
  LogOut, Save, User, Image, Code, Shield, 
  Link as LinkIcon, Package, MessageCircle, Upload, X, Loader2 
} from 'lucide-react';

const Admin: React.FC = () => {
  const { isAdmin, isLoading: authLoading, logout } = useAuth();
  const { 
    portfolio, 
    skills, 
    packages, 
    isLoading: dataLoading,
    updatePortfolio,
    updateSkill,
    updatePackage,
    refetch
  } = usePortfolioData();
  const navigate = useNavigate();
  const { toast } = useToast();
  const profileInputRef = useRef<HTMLInputElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);
  
  const [activeTab, setActiveTab] = useState('profile');
  const [formData, setFormData] = useState<{
    name: string;
    tagline: string;
    age: number;
    grade: string;
    bio: string;
    profile_image: string;
    logo_image: string;
    whatsapp: string;
    email: string;
    github: string;
    instagram: string;
  }>({
    name: '',
    tagline: '',
    age: 13,
    grade: '',
    bio: '',
    profile_image: '',
    logo_image: '',
    whatsapp: '',
    email: '',
    github: '',
    instagram: '',
  });

  const [skillsData, setSkillsData] = useState<typeof skills>([]);
  const [packagesData, setPackagesData] = useState<typeof packages>([]);
  const [isSaving, setIsSaving] = useState(false);

  // Redirect if not admin
  useEffect(() => {
    if (!authLoading && !isAdmin) {
      navigate('/login');
    }
  }, [isAdmin, authLoading, navigate]);

  // Initialize form data when portfolio loads
  useEffect(() => {
    if (portfolio) {
      setFormData({
        name: portfolio.name || '',
        tagline: portfolio.tagline || '',
        age: portfolio.age || 13,
        grade: portfolio.grade || '',
        bio: portfolio.bio || '',
        profile_image: portfolio.profile_image || '',
        logo_image: portfolio.logo_image || '',
        whatsapp: portfolio.whatsapp || '',
        email: portfolio.email || '',
        github: portfolio.github || '',
        instagram: portfolio.instagram || '',
      });
    }
  }, [portfolio]);

  useEffect(() => {
    setSkillsData(skills);
  }, [skills]);

  useEffect(() => {
    setPackagesData(packages);
  }, [packages]);

  const handleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>, 
    type: 'profile_image' | 'logo_image'
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
      // Save portfolio data
      const { error: portfolioError } = await updatePortfolio(formData);
      if (portfolioError) throw new Error(portfolioError);

      // Save skills
      for (const skill of skillsData) {
        const { error } = await updateSkill(skill.id, {
          name: skill.name,
          percentage: skill.percentage,
        });
        if (error) throw new Error(error);
      }

      // Save packages
      for (const pkg of packagesData) {
        const { error } = await updatePackage(pkg.id, {
          name: pkg.name,
          price_min: pkg.price_min,
          price_max: pkg.price_max,
          features: pkg.features,
        });
        if (error) throw new Error(error);
      }

      toast({
        title: "Berhasil disimpan!",
        description: "Perubahan telah diterapkan ke database",
      });

      refetch();
    } catch (err: any) {
      toast({
        title: "Gagal menyimpan",
        description: err.message || "Terjadi kesalahan",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const handleUpdateSkill = (index: number, field: 'name' | 'percentage', value: string | number) => {
    const newSkills = [...skillsData];
    newSkills[index] = { ...newSkills[index], [field]: value };
    setSkillsData(newSkills);
  };

  const handleUpdatePackage = (index: number, field: string, value: string | number | string[]) => {
    const newPackages = [...packagesData];
    newPackages[index] = { ...newPackages[index], [field]: value };
    setPackagesData(newPackages);
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'images', label: 'Images', icon: Image },
    { id: 'skills', label: 'Skills', icon: Code },
    { id: 'packages', label: 'Packages', icon: Package },
    { id: 'social', label: 'Social', icon: LinkIcon },
  ];

  if (authLoading || dataLoading) {
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
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-1 px-3 py-1.5 bg-primary text-primary-foreground rounded-lg text-xs font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {isSaving ? (
                <Loader2 className="w-3 h-3 animate-spin" />
              ) : (
                <Save className="w-3 h-3" />
              )}
              Save
            </button>
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
                      className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-1">Tagline</label>
                    <input
                      type="text"
                      value={formData.tagline}
                      onChange={(e) => setFormData(prev => ({ ...prev, tagline: e.target.value }))}
                      className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-1">Umur</label>
                    <input
                      type="number"
                      value={formData.age}
                      onChange={(e) => setFormData(prev => ({ ...prev, age: parseInt(e.target.value) || 0 }))}
                      className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-1">Kelas</label>
                    <input
                      type="text"
                      value={formData.grade}
                      onChange={(e) => setFormData(prev => ({ ...prev, grade: e.target.value }))}
                      className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:border-primary"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Bio</label>
                  <textarea
                    value={formData.bio}
                    onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                    rows={4}
                    className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:border-primary resize-none"
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
                    <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-border bg-muted">
                      {formData.profile_image ? (
                        <img src={formData.profile_image} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                          <User className="w-8 h-8" />
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col gap-2">
                      <input
                        ref={profileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, 'profile_image')}
                        className="hidden"
                      />
                      <button
                        onClick={() => profileInputRef.current?.click()}
                        className="flex items-center gap-1 px-3 py-1.5 btn-neon rounded-lg text-xs"
                      >
                        <Upload className="w-3 h-3" />
                        Upload
                      </button>
                      {formData.profile_image && (
                        <button
                          onClick={() => setFormData(prev => ({ ...prev, profile_image: '' }))}
                          className="flex items-center gap-1 px-3 py-1.5 bg-destructive/10 text-destructive rounded-lg text-xs"
                        >
                          <X className="w-3 h-3" />
                          Remove
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Logo Image */}
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-2">Logo</label>
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-lg overflow-hidden border border-border bg-muted flex items-center justify-center">
                      {formData.logo_image ? (
                        <img src={formData.logo_image} alt="Logo" className="w-full h-full object-contain p-2" />
                      ) : (
                        <Shield className="w-6 h-6 text-muted-foreground" />
                      )}
                    </div>
                    <div className="flex flex-col gap-2">
                      <input
                        ref={logoInputRef}
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, 'logo_image')}
                        className="hidden"
                      />
                      <button
                        onClick={() => logoInputRef.current?.click()}
                        className="flex items-center gap-1 px-3 py-1.5 btn-neon rounded-lg text-xs"
                      >
                        <Upload className="w-3 h-3" />
                        Upload
                      </button>
                      {formData.logo_image && (
                        <button
                          onClick={() => setFormData(prev => ({ ...prev, logo_image: '' }))}
                          className="flex items-center gap-1 px-3 py-1.5 bg-destructive/10 text-destructive rounded-lg text-xs"
                        >
                          <X className="w-3 h-3" />
                          Remove
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Skills Tab */}
            {activeTab === 'skills' && (
              <div className="space-y-4">
                <h2 className="text-lg font-heading font-semibold text-foreground">Skills</h2>
                
                <div className="space-y-3">
                  {skillsData.map((skill, index) => (
                    <div key={skill.id} className="grid grid-cols-[1fr_80px] gap-2 items-center">
                      <input
                        type="text"
                        value={skill.name}
                        onChange={(e) => handleUpdateSkill(index, 'name', e.target.value)}
                        className="px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:border-primary"
                      />
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={skill.percentage}
                        onChange={(e) => handleUpdateSkill(index, 'percentage', parseInt(e.target.value) || 0)}
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
                <h2 className="text-lg font-heading font-semibold text-foreground">Packages</h2>
                
                {packagesData.map((pkg, index) => (
                  <div key={pkg.id} className="p-4 border border-border rounded-lg space-y-3">
                    <h3 className="text-sm font-semibold text-foreground">{pkg.name}</h3>
                    <div className="grid sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs text-muted-foreground mb-1">Harga Min (Rp)</label>
                        <input
                          type="number"
                          value={pkg.price_min}
                          onChange={(e) => handleUpdatePackage(index, 'price_min', parseInt(e.target.value) || 0)}
                          className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:border-primary"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-muted-foreground mb-1">Harga Max (Rp)</label>
                        <input
                          type="number"
                          value={pkg.price_max}
                          onChange={(e) => handleUpdatePackage(index, 'price_max', parseInt(e.target.value) || 0)}
                          className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:border-primary"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs text-muted-foreground mb-1">Features (pisahkan dengan enter)</label>
                      <textarea
                        value={pkg.features.join('\n')}
                        onChange={(e) => handleUpdatePackage(index, 'features', e.target.value.split('\n'))}
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
                    value={formData.whatsapp}
                    onChange={(e) => setFormData(prev => ({ ...prev, whatsapp: e.target.value }))}
                    className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:border-primary"
                    placeholder="+62 xxx xxxx xxxx"
                  />
                </div>
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
                    className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:border-primary"
                    placeholder="https://github.com/username"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Instagram URL</label>
                  <input
                    type="url"
                    value={formData.instagram}
                    onChange={(e) => setFormData(prev => ({ ...prev, instagram: e.target.value }))}
                    className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:border-primary"
                    placeholder="https://instagram.com/username"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Email</label>
                  <input
                    type="email"
                    value={formData.email}
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
    </div>
  );
};

export default Admin;

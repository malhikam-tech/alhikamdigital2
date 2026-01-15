import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePortfolio } from '@/contexts/PortfolioContext';
import { useToast } from '@/hooks/use-toast';
import { 
  LogOut, Save, User, Image, Code, Shield, 
  Link as LinkIcon, Package, MessageCircle, Upload, X 
} from 'lucide-react';

const Admin: React.FC = () => {
  const { data, updateData, isAdmin, logout } = usePortfolio();
  const navigate = useNavigate();
  const { toast } = useToast();
  const profileInputRef = useRef<HTMLInputElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);
  
  const [activeTab, setActiveTab] = useState('profile');
  const [formData, setFormData] = useState(data);

  // Redirect if not admin
  React.useEffect(() => {
    if (!isAdmin) {
      navigate('/login');
    }
  }, [isAdmin, navigate]);

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

  const handleSave = () => {
    updateData(formData);
    toast({
      title: "Berhasil disimpan!",
      description: "Perubahan telah diterapkan",
    });
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const updateSkill = (index: number, field: 'name' | 'percentage', value: string | number) => {
    const newSkills = [...formData.skills];
    newSkills[index] = { ...newSkills[index], [field]: value };
    setFormData(prev => ({ ...prev, skills: newSkills }));
  };

  const updatePackage = (index: number, field: string, value: string | number | string[]) => {
    const newPackages = [...formData.packages];
    newPackages[index] = { ...newPackages[index], [field]: value };
    setFormData(prev => ({ ...prev, packages: newPackages }));
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'images', label: 'Images', icon: Image },
    { id: 'skills', label: 'Skills', icon: Code },
    { id: 'packages', label: 'Packages', icon: Package },
    { id: 'social', label: 'Social', icon: LinkIcon },
  ];

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
              className="flex items-center gap-1 px-3 py-1.5 bg-primary text-primary-foreground rounded-lg text-xs font-medium hover:bg-primary/90 transition-colors"
            >
              <Save className="w-3 h-3" />
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
                      {formData.profileImage ? (
                        <img src={formData.profileImage} alt="Profile" className="w-full h-full object-cover" />
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
                  </div>
                </div>

                {/* Logo Image */}
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-2">Logo</label>
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-lg overflow-hidden border border-border bg-muted flex items-center justify-center">
                      {formData.logoImage ? (
                        <img src={formData.logoImage} alt="Logo" className="w-full h-full object-contain p-2" />
                      ) : (
                        <Shield className="w-6 h-6 text-muted-foreground" />
                      )}
                    </div>
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
                  </div>
                </div>
              </div>
            )}

            {/* Skills Tab */}
            {activeTab === 'skills' && (
              <div className="space-y-4">
                <h2 className="text-lg font-heading font-semibold text-foreground">Skills</h2>
                
                <div className="space-y-3">
                  {formData.skills.map((skill, index) => (
                    <div key={index} className="grid grid-cols-[1fr_80px_80px] gap-2 items-center">
                      <input
                        type="text"
                        value={skill.name}
                        onChange={(e) => updateSkill(index, 'name', e.target.value)}
                        className="px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:border-primary"
                      />
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={skill.percentage}
                        onChange={(e) => updateSkill(index, 'percentage', parseInt(e.target.value) || 0)}
                        className="px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:border-primary"
                      />
                      <span className={`text-xs px-2 py-1 rounded-full text-center ${
                        skill.category === 'webdev' 
                          ? 'bg-primary/10 text-primary' 
                          : 'bg-accent/10 text-accent'
                      }`}>
                        {skill.category}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Packages Tab */}
            {activeTab === 'packages' && (
              <div className="space-y-6">
                <h2 className="text-lg font-heading font-semibold text-foreground">Packages</h2>
                
                {formData.packages.map((pkg, index) => (
                  <div key={pkg.id} className="p-4 border border-border rounded-lg space-y-3">
                    <h3 className="text-sm font-semibold text-foreground">{pkg.name}</h3>
                    <div className="grid sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs text-muted-foreground mb-1">Harga Min (Rp)</label>
                        <input
                          type="number"
                          value={pkg.priceMin}
                          onChange={(e) => updatePackage(index, 'priceMin', parseInt(e.target.value) || 0)}
                          className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:border-primary"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-muted-foreground mb-1">Harga Max (Rp)</label>
                        <input
                          type="number"
                          value={pkg.priceMax}
                          onChange={(e) => updatePackage(index, 'priceMax', parseInt(e.target.value) || 0)}
                          className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:border-primary"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs text-muted-foreground mb-1">Features (pisahkan dengan enter)</label>
                      <textarea
                        value={pkg.features.join('\n')}
                        onChange={(e) => updatePackage(index, 'features', e.target.value.split('\n'))}
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
                    value={formData.whatsappNumber}
                    onChange={(e) => setFormData(prev => ({ ...prev, whatsappNumber: e.target.value }))}
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
                    value={formData.socialLinks.github || ''}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      socialLinks: { ...prev.socialLinks, github: e.target.value } 
                    }))}
                    className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:border-primary"
                    placeholder="https://github.com/username"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Instagram URL</label>
                  <input
                    type="url"
                    value={formData.socialLinks.instagram || ''}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      socialLinks: { ...prev.socialLinks, instagram: e.target.value } 
                    }))}
                    className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:border-primary"
                    placeholder="https://instagram.com/username"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Email</label>
                  <input
                    type="email"
                    value={formData.socialLinks.email || ''}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      socialLinks: { ...prev.socialLinks, email: e.target.value } 
                    }))}
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

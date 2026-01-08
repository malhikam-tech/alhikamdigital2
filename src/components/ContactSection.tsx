import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, Send, Mail, MapPin } from 'lucide-react';
import { usePortfolio } from '@/contexts/PortfolioContext';
import { useToast } from '@/hooks/use-toast';

const ContactSection: React.FC = () => {
  const { data } = usePortfolio();
  const { toast } = useToast();
  const [isVisible, setIsVisible] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const message = encodeURIComponent(
      `Halo, nama saya ${formData.name}.\n\nEmail: ${formData.email}\n\nPesan:\n${formData.message}`
    );
    const waNumber = data.whatsappNumber.replace(/[^0-9]/g, '');
    window.open(`https://wa.me/${waNumber}?text=${message}`, '_blank');
    
    toast({
      title: "Redirecting ke WhatsApp",
      description: "Pesan Anda akan dikirim melalui WhatsApp",
    });
    
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="py-20 relative overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0">
        <div 
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `radial-gradient(circle at 80% 20%, hsl(var(--primary)) 0%, transparent 30%)`,
          }}
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section header */}
        <div className="text-center mb-12">
          <p className="text-xs uppercase tracking-widest text-primary mb-2">Contact</p>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-heading font-bold">
            Hubungi <span className="gradient-text">Saya</span>
          </h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Contact Info */}
          <div
            className={`space-y-4 transition-all duration-700 ${
              isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'
            }`}
          >
            <div className="glass-card p-4 rounded-xl flex items-center gap-4 group hover:border-primary/50 transition-all">
              <div className="p-2 rounded-lg bg-primary/10 border border-primary/30">
                <MessageCircle className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">WhatsApp</p>
                <a 
                  href={`https://wa.me/${data.whatsappNumber.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium text-foreground hover:text-primary transition-colors"
                >
                  {data.whatsappNumber}
                </a>
              </div>
            </div>

            {data.socialLinks.email && (
              <div className="glass-card p-4 rounded-xl flex items-center gap-4 group hover:border-primary/50 transition-all">
                <div className="p-2 rounded-lg bg-accent/10 border border-accent/30">
                  <Mail className="w-4 h-4 text-accent" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Email</p>
                  <a 
                    href={`mailto:${data.socialLinks.email}`}
                    className="text-sm font-medium text-foreground hover:text-primary transition-colors"
                  >
                    {data.socialLinks.email}
                  </a>
                </div>
              </div>
            )}

            <div className="glass-card p-4 rounded-xl flex items-center gap-4 group hover:border-primary/50 transition-all">
              <div className="p-2 rounded-lg bg-neon-purple/10 border border-neon-purple/30">
                <MapPin className="w-4 h-4 text-neon-purple" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Location</p>
                <p className="text-sm font-medium text-foreground">Indonesia</p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <form
            onSubmit={handleSubmit}
            className={`glass-card p-6 rounded-xl transition-all duration-700 ${
              isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'
            }`}
          >
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">
                  Nama
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="w-full px-3 py-2 text-sm bg-background/50 border border-border rounded-lg focus:outline-none focus:border-primary transition-colors"
                  placeholder="Nama Anda"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="w-full px-3 py-2 text-sm bg-background/50 border border-border rounded-lg focus:outline-none focus:border-primary transition-colors"
                  placeholder="email@example.com"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">
                  Pesan
                </label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  required
                  rows={4}
                  className="w-full px-3 py-2 text-sm bg-background/50 border border-border rounded-lg focus:outline-none focus:border-primary transition-colors resize-none"
                  placeholder="Tulis pesan Anda..."
                />
              </div>
              <button
                type="submit"
                className="w-full bg-primary text-primary-foreground py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                Kirim via WhatsApp
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;

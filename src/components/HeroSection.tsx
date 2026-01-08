import React from 'react';
import { ChevronDown, Github, Instagram, Mail } from 'lucide-react';
import { usePortfolio } from '@/contexts/PortfolioContext';

const HeroSection: React.FC = () => {
  const { data } = usePortfolio();

  const scrollToAbout = () => {
    document.querySelector('#about')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="home" className="min-h-screen flex items-center justify-center relative overflow-hidden pt-16">
      {/* Background effects */}
      <div className="absolute inset-0">
        <div 
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `radial-gradient(circle at 50% 50%, hsl(var(--primary)) 0%, transparent 50%)`,
          }}
        />
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `linear-gradient(hsl(var(--primary) / 0.05) 1px, transparent 1px),
                              linear-gradient(90deg, hsl(var(--primary) / 0.05) 1px, transparent 1px)`,
            backgroundSize: '100px 100px',
          }}
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-16">
          {/* Profile Image */}
          <div className="relative animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <div className="w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 rounded-full overflow-hidden border-2 border-primary/30 neon-border animate-float">
              {data.profileImage ? (
                <img 
                  src={data.profileImage} 
                  alt={data.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                  <span className="text-4xl sm:text-5xl font-heading font-bold text-primary">
                    {data.name.charAt(0)}
                  </span>
                </div>
              )}
            </div>
            {/* Decorative ring */}
            <div className="absolute inset-0 rounded-full border border-primary/20 scale-110 animate-pulse" />
            <div className="absolute inset-0 rounded-full border border-primary/10 scale-125" />
          </div>

          {/* Content */}
          <div className="text-center lg:text-left max-w-lg">
            <p 
              className="text-xs uppercase tracking-widest text-primary mb-2 animate-fade-in"
              style={{ animationDelay: '0.3s' }}
            >
              Hello, World!
            </p>
            <h1 
              className="text-2xl sm:text-3xl md:text-4xl font-heading font-bold mb-3 animate-fade-in"
              style={{ animationDelay: '0.4s' }}
            >
              I'm <span className="gradient-text">{data.name}</span>
            </h1>
            <p 
              className="text-sm sm:text-base text-muted-foreground mb-4 animate-fade-in"
              style={{ animationDelay: '0.5s' }}
            >
              {data.tagline}
            </p>
            <p 
              className="text-xs text-muted-foreground/70 mb-6 animate-fade-in"
              style={{ animationDelay: '0.6s' }}
            >
              {data.age} tahun • {data.grade}
            </p>

            {/* Social Links */}
            <div 
              className="flex items-center justify-center lg:justify-start gap-3 mb-6 animate-fade-in"
              style={{ animationDelay: '0.7s' }}
            >
              {data.socialLinks.github && (
                <a
                  href={data.socialLinks.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 glass-card hover:bg-primary/10 hover:border-primary/50 transition-all duration-300 group"
                >
                  <Github className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </a>
              )}
              {data.socialLinks.instagram && (
                <a
                  href={data.socialLinks.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 glass-card hover:bg-primary/10 hover:border-primary/50 transition-all duration-300 group"
                >
                  <Instagram className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </a>
              )}
              {data.socialLinks.email && (
                <a
                  href={`mailto:${data.socialLinks.email}`}
                  className="p-2 glass-card hover:bg-primary/10 hover:border-primary/50 transition-all duration-300 group"
                >
                  <Mail className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </a>
              )}
            </div>

            {/* CTA Button */}
            <button
              onClick={scrollToAbout}
              className="btn-neon px-6 py-2 rounded-lg text-xs font-medium animate-fade-in"
              style={{ animationDelay: '0.8s' }}
            >
              Explore More
            </button>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <button
        onClick={scrollToAbout}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce"
      >
        <ChevronDown className="w-5 h-5 text-primary" />
      </button>
    </section>
  );
};

export default HeroSection;

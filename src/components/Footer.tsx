import React from 'react';
import { Heart, Shield } from 'lucide-react';
import { usePortfolio } from '@/contexts/PortfolioContext';

const Footer: React.FC = () => {
  const { data } = usePortfolio();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-8 border-t border-border/30">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex items-center gap-2">
            {data.logoImage ? (
              <img src={data.logoImage} alt="Logo" className="w-6 h-6 object-contain" />
            ) : (
              <div className="w-6 h-6 rounded bg-primary/20 border border-primary/50 flex items-center justify-center">
                <Shield className="w-3 h-3 text-primary" />
              </div>
            )}
            <span className="text-xs font-heading font-semibold text-foreground">
              ALHIKAM DIGITAL
            </span>
          </div>

          {/* Copyright */}
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            © 2026 Al Hikam Digital. Made with <Heart className="w-3 h-3 text-destructive" /> in Indonesia
          </p>

          {/* Quick Links */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => document.querySelector('#home')?.scrollIntoView({ behavior: 'smooth' })}
              className="text-xs text-muted-foreground hover:text-primary transition-colors"
            >
              Home
            </button>
            <button
              onClick={() => document.querySelector('#services')?.scrollIntoView({ behavior: 'smooth' })}
              className="text-xs text-muted-foreground hover:text-primary transition-colors"
            >
              Services
            </button>
            <button
              onClick={() => document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })}
              className="text-xs text-muted-foreground hover:text-primary transition-colors"
            >
              Contact
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

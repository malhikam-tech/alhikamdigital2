import React, { useState, useEffect } from 'react';
import { Menu, X, Shield, User } from 'lucide-react';
import { usePortfolio } from '@/contexts/PortfolioContext';
import { useAuth } from '@/hooks/useAuth';
import { Link, useLocation } from 'react-router-dom';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { data } = usePortfolio();
  const { isAdmin } = useAuth();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'About', href: '#about' },
    { name: 'Skills', href: '#skills' },
    { name: 'Services', href: '#services' },
    { name: 'Contact', href: '#contact' },
  ];

  const scrollToSection = (href: string) => {
    if (location.pathname !== '/') {
      window.location.href = '/' + href;
      return;
    }
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsOpen(false);
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled ? 'glass-card py-2' : 'bg-transparent py-4'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            {data.logoImage ? (
              <img 
                src={data.logoImage} 
                alt="Logo" 
                className="w-8 h-8 object-contain"
              />
            ) : (
              <div className="w-8 h-8 rounded-lg bg-primary/20 border border-primary/50 flex items-center justify-center group-hover:animate-glow-pulse">
                <Shield className="w-4 h-4 text-primary" />
              </div>
            )}
            <span className="text-sm font-heading font-semibold text-foreground group-hover:text-primary transition-colors">
              ALHIKAM
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <button
                key={link.name}
                onClick={() => scrollToSection(link.href)}
                className="text-xs font-medium text-muted-foreground hover:text-primary transition-colors relative group"
              >
                {link.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full" />
              </button>
            ))}
            {isAdmin && (
              <Link
                to="/admin"
                className="flex items-center gap-1 text-xs font-medium text-accent hover:text-accent/80 transition-colors"
              >
                <User className="w-3 h-3" />
                Admin
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-foreground hover:text-primary transition-colors"
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden absolute top-full left-0 right-0 glass-card transition-all duration-300 ${
          isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
      >
        <div className="container mx-auto px-4 py-4 flex flex-col gap-3">
          {navLinks.map((link) => (
            <button
              key={link.name}
              onClick={() => scrollToSection(link.href)}
              className="text-sm text-muted-foreground hover:text-primary transition-colors text-left py-2"
            >
              {link.name}
            </button>
          ))}
          {isAdmin && (
            <Link
              to="/admin"
              className="flex items-center gap-2 text-sm text-accent hover:text-accent/80 transition-colors py-2"
              onClick={() => setIsOpen(false)}
            >
              <User className="w-4 h-4" />
              Admin Panel
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

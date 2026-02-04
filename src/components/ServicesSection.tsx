import React, { useEffect, useRef, useState } from 'react';
import { Check, MessageCircle, Star } from 'lucide-react';
import { usePortfolio } from '@/contexts/PortfolioContext';

const ServicesSection: React.FC = () => {
  const { portfolio, packages } = usePortfolio();
  const [isVisible, setIsVisible] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleOrder = (packageName: string) => {
    const message = encodeURIComponent(
      `Halo, saya tertarik untuk memesan paket ${packageName} untuk pembuatan website. Bisa tolong jelaskan lebih lanjut?`
    );
    const waNumber = (portfolio?.whatsapp || '').replace(/[^0-9]/g, '');
    window.open(`https://wa.me/${waNumber}?text=${message}`, '_blank');
  };

  if (!packages || packages.length === 0) return null;

  return (
    <section
      id="services"
      ref={sectionRef}
      className="py-20 relative overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0">
        <div 
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `linear-gradient(45deg, hsl(var(--primary) / 0.1) 25%, transparent 25%, transparent 75%, hsl(var(--primary) / 0.1) 75%)`,
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section header */}
        <div className="text-center mb-12">
          <p className="text-xs uppercase tracking-widest text-primary mb-2">Services</p>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-heading font-bold mb-3">
            Pesan <span className="gradient-text">Website</span> Anda
          </h2>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            Pilih paket yang sesuai dengan kebutuhan Anda
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {packages.map((pkg, index) => (
            <div
              key={pkg.id}
              onMouseEnter={() => setSelectedPackage(pkg.id)}
              onMouseLeave={() => setSelectedPackage(null)}
              className={`glass-card rounded-xl overflow-hidden transition-all duration-500 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              } ${
                index === 1 ? 'md:-mt-4 md:mb-4 border-primary/50' : ''
              } ${
                selectedPackage === pkg.id ? 'scale-105 border-primary/70' : ''
              }`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              {/* Popular badge */}
              {index === 1 && (
                <div className="bg-primary text-primary-foreground text-xs font-medium py-1 text-center flex items-center justify-center gap-1">
                  <Star className="w-3 h-3" />
                  Paling Populer
                </div>
              )}

              <div className="p-6">
                {/* Package name */}
                <h3 className="text-lg font-heading font-bold text-foreground mb-2">
                  {pkg.name}
                </h3>

                {/* Price */}
                <div className="mb-4">
                  <span className="text-xs text-muted-foreground">Mulai dari</span>
                  <div className="text-xl font-heading font-bold text-primary">
                    {formatPrice(pkg.price_min)}
                  </div>
                  <span className="text-xs text-muted-foreground">
                    s/d {formatPrice(pkg.price_max)}
                  </span>
                </div>

                {/* Features */}
                <ul className="space-y-2 mb-6">
                  {pkg.features?.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-xs text-muted-foreground">
                      <Check className="w-3 h-3 text-accent mt-0.5 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* Order button */}
                <button
                  onClick={() => handleOrder(pkg.name)}
                  className={`w-full py-2 rounded-lg text-xs font-medium transition-all duration-300 flex items-center justify-center gap-2 ${
                    index === 1
                      ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                      : 'btn-neon'
                  }`}
                >
                  <MessageCircle className="w-3 h-3" />
                  Pesan Sekarang
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Contact info */}
        <div className="text-center mt-10">
          <p className="text-xs text-muted-foreground">
            Atau hubungi langsung via WhatsApp:
          </p>
          <a
            href={`https://wa.me/${(portfolio?.whatsapp || '').replace(/[^0-9]/g, '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-primary hover:underline"
          >
            {portfolio?.whatsapp}
          </a>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;

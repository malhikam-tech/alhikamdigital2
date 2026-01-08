import React, { useEffect, useRef, useState } from 'react';
import { Code2, Shield, Sparkles } from 'lucide-react';
import { usePortfolio } from '@/contexts/PortfolioContext';

const AboutSection: React.FC = () => {
  const { data } = usePortfolio();
  const [isVisible, setIsVisible] = useState(false);
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

  const features = [
    {
      icon: Code2,
      title: 'Web Development',
      description: 'Membuat website modern dan responsif dengan teknologi terkini',
    },
    {
      icon: Shield,
      title: 'Cyber Security',
      description: 'Mempelajari keamanan siber dan ethical hacking',
    },
    {
      icon: Sparkles,
      title: 'Creative Design',
      description: 'Mendesain UI/UX yang menarik dan user-friendly',
    },
  ];

  return (
    <section
      id="about"
      ref={sectionRef}
      className="py-20 relative overflow-hidden"
    >
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Section header */}
        <div className="text-center mb-12">
          <p className="text-xs uppercase tracking-widest text-primary mb-2">About Me</p>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-heading font-bold">
            Kenali Saya <span className="gradient-text">Lebih Dekat</span>
          </h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 items-center">
          {/* Bio */}
          <div
            className={`transition-all duration-700 ${
              isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'
            }`}
          >
            <div className="glass-card p-6 rounded-xl">
              <h3 className="text-lg font-heading font-semibold mb-3 text-foreground">
                Halo! Saya <span className="text-primary">{data.name}</span>
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                {data.bio}
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 text-xs rounded-full bg-primary/10 text-primary border border-primary/30">
                  {data.age} Tahun
                </span>
                <span className="px-3 py-1 text-xs rounded-full bg-accent/10 text-accent border border-accent/30">
                  {data.grade}
                </span>
                <span className="px-3 py-1 text-xs rounded-full bg-neon-purple/10 text-neon-purple border border-neon-purple/30">
                  Self-taught
                </span>
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="grid gap-4">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className={`glass-card p-4 rounded-xl flex items-start gap-4 group hover:border-primary/50 transition-all duration-300 ${
                  isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'
                }`}
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                <div className="p-2 rounded-lg bg-primary/10 border border-primary/30 group-hover:animate-glow-pulse">
                  <feature.icon className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <h4 className="text-sm font-heading font-semibold text-foreground mb-1">
                    {feature.title}
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;

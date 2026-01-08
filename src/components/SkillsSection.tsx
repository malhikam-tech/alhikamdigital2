import React, { useEffect, useRef, useState } from 'react';
import { Code, Shield } from 'lucide-react';
import { usePortfolio } from '@/contexts/PortfolioContext';

const SkillsSection: React.FC = () => {
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

  const webDevSkills = data.skills.filter(s => s.category === 'webdev');
  const securitySkills = data.skills.filter(s => s.category === 'security');

  const SkillBar = ({ skill, delay }: { skill: typeof data.skills[0]; delay: number }) => (
    <div
      className={`transition-all duration-700 ${
        isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="flex justify-between items-center mb-1">
        <span className="text-xs font-medium text-foreground">{skill.name}</span>
        <span className="text-xs text-primary">{skill.percentage}%</span>
      </div>
      <div className="skill-bar">
        <div
          className={`skill-bar-fill ${isVisible ? 'progress-animate' : ''}`}
          style={{ 
            width: isVisible ? `${skill.percentage}%` : '0%',
            animationDelay: `${delay}ms`,
          }}
        />
      </div>
    </div>
  );

  return (
    <section
      id="skills"
      ref={sectionRef}
      className="py-20 relative overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 opacity-5">
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 30% 70%, hsl(var(--primary)) 0%, transparent 40%),
                              radial-gradient(circle at 70% 30%, hsl(var(--accent)) 0%, transparent 40%)`,
          }}
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section header */}
        <div className="text-center mb-12">
          <p className="text-xs uppercase tracking-widest text-primary mb-2">My Skills</p>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-heading font-bold">
            Keahlian <span className="gradient-text">Saya</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Web Development */}
          <div
            className={`glass-card p-6 rounded-xl transition-all duration-500 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-primary/10 border border-primary/30">
                <Code className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-lg font-heading font-semibold text-foreground">
                Web Development
              </h3>
            </div>
            <div className="space-y-4">
              {webDevSkills.map((skill, index) => (
                <SkillBar key={skill.name} skill={skill} delay={index * 100} />
              ))}
            </div>
          </div>

          {/* Cyber Security */}
          <div
            className={`glass-card p-6 rounded-xl transition-all duration-500 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
            style={{ transitionDelay: '200ms' }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-accent/10 border border-accent/30">
                <Shield className="w-5 h-5 text-accent" />
              </div>
              <h3 className="text-lg font-heading font-semibold text-foreground">
                Cyber Security
              </h3>
            </div>
            <div className="space-y-4">
              {securitySkills.map((skill, index) => (
                <SkillBar key={skill.name} skill={skill} delay={(index + webDevSkills.length) * 100} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SkillsSection;

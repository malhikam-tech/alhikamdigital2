import React, { useState, useEffect } from 'react';

interface IntroAnimationProps {
  onComplete: () => void;
}

const IntroAnimation: React.FC<IntroAnimationProps> = ({ onComplete }) => {
  const [currentWord, setCurrentWord] = useState(0);
  const [isExiting, setIsExiting] = useState(false);
  
  const words = ['welcome', 'alhikam', 'digital'];

  useEffect(() => {
    const wordTimer = setInterval(() => {
      setCurrentWord(prev => {
        if (prev < words.length - 1) {
          return prev + 1;
        }
        return prev;
      });
    }, 1000);

    const exitTimer = setTimeout(() => {
      setIsExiting(true);
    }, 3500);

    const completeTimer = setTimeout(() => {
      onComplete();
    }, 4500);

    return () => {
      clearInterval(wordTimer);
      clearTimeout(exitTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center bg-background transition-all duration-1000 ${
        isExiting ? 'opacity-0 blur-xl scale-110' : 'opacity-100 blur-0 scale-100'
      }`}
    >
      {/* Background grid effect */}
      <div className="absolute inset-0 opacity-10">
        <div 
          className="absolute inset-0" 
          style={{
            backgroundImage: `linear-gradient(hsl(var(--primary) / 0.1) 1px, transparent 1px),
                              linear-gradient(90deg, hsl(var(--primary) / 0.1) 1px, transparent 1px)`,
            backgroundSize: '50px 50px',
          }}
        />
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-primary rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${3 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      {/* Main text container */}
      <div className="relative">
        {words.map((word, index) => (
          <div
            key={word}
            className={`absolute left-1/2 -translate-x-1/2 whitespace-nowrap transition-all duration-700 ${
              index === currentWord 
                ? 'opacity-100 translate-y-0' 
                : index < currentWord 
                  ? 'opacity-0 -translate-y-20' 
                  : 'opacity-0 translate-y-20'
            }`}
          >
            <span className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-heading font-bold tracking-wider uppercase neon-text text-primary">
              {word}
            </span>
          </div>
        ))}
        
        {/* Hidden spacer to maintain layout */}
        <span className="invisible text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-heading font-bold tracking-wider uppercase">
          {words[words.length - 1]}
        </span>
      </div>

      {/* Decorative lines */}
      <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex gap-2">
        {words.map((_, index) => (
          <div
            key={index}
            className={`h-0.5 transition-all duration-500 ${
              index <= currentWord ? 'w-8 bg-primary' : 'w-4 bg-muted'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default IntroAnimation;

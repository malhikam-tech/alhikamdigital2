import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  category: string;
  technologies: string[];
  liveUrl?: string;
  githubUrl?: string;
}

interface PortfolioData {
  name: string;
  tagline: string;
  age: number;
  grade: string;
  bio: string;
  profileImage: string;
  logoImage: string;
  skills: {
    name: string;
    percentage: number;
    category: 'webdev' | 'security';
  }[];
  socialLinks: {
    github?: string;
    instagram?: string;
    email?: string;
  };
  packages: {
    id: string;
    name: string;
    priceMin: number;
    priceMax: number;
    features: string[];
  }[];
  projects: Project[];
  whatsappNumber: string;
}

interface PortfolioContextType {
  data: PortfolioData;
  updateData: (newData: Partial<PortfolioData>) => void;
  isAdmin: boolean;
  login: (username: string, password: string) => boolean;
  logout: () => void;
}

const defaultData: PortfolioData = {
  name: "M. Al Hikam Baihaqi",
  tagline: "Web Developer & Cyber Security Enthusiast",
  age: 13,
  grade: "Kelas VIII",
  bio: "Seorang pelajar yang passionate dalam dunia web development dan cyber security. Saya senang menciptakan website yang modern, responsif, dan aman.",
  profileImage: "",
  logoImage: "",
  skills: [
    { name: "HTML & CSS", percentage: 90, category: 'webdev' },
    { name: "JavaScript", percentage: 85, category: 'webdev' },
    { name: "React.js", percentage: 75, category: 'webdev' },
    { name: "Tailwind CSS", percentage: 88, category: 'webdev' },
    { name: "Node.js", percentage: 70, category: 'webdev' },
    { name: "Network Security", percentage: 80, category: 'security' },
    { name: "Penetration Testing", percentage: 65, category: 'security' },
    { name: "Cryptography", percentage: 60, category: 'security' },
    { name: "Linux Security", percentage: 75, category: 'security' },
  ],
  socialLinks: {
    github: "https://github.com",
    instagram: "https://instagram.com",
    email: "alhikam@example.com",
  },
  packages: [
    {
      id: 'basic',
      name: 'Basic',
      priceMin: 300000,
      priceMax: 600000,
      features: [
        'Landing Page 1 Halaman',
        'Desain Responsif',
        'Hosting 1 Bulan',
        'Revisi 2x',
        'Waktu Pengerjaan 3-5 Hari',
      ],
    },
    {
      id: 'combo',
      name: 'Combo',
      priceMin: 600000,
      priceMax: 1200000,
      features: [
        'Website 3-5 Halaman',
        'Desain Custom',
        'Hosting 3 Bulan',
        'Domain .com',
        'Revisi 5x',
        'SEO Basic',
        'Waktu Pengerjaan 7-14 Hari',
      ],
    },
    {
      id: 'combo-plus',
      name: 'Combo Plus',
      priceMin: 1200000,
      priceMax: 5999000,
      features: [
        'Website Unlimited Halaman',
        'Desain Premium Custom',
        'Hosting 1 Tahun',
        'Domain Premium',
        'Revisi Unlimited',
        'SEO Advanced',
        'Admin Panel',
        'Database Integration',
        'Support 24/7',
        'Waktu Pengerjaan 14-30 Hari',
      ],
    },
  ],
  projects: [
    {
      id: 'portfolio-website',
      title: 'Portfolio Website',
      description: 'Website portfolio pribadi dengan desain modern, dark theme, dan efek glassmorphism. Dibuat menggunakan React dan Tailwind CSS.',
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80',
      category: 'Web Development',
      technologies: ['React', 'Tailwind CSS', 'TypeScript', 'Framer Motion'],
      liveUrl: 'https://example.com',
      githubUrl: 'https://github.com',
    },
    {
      id: 'e-commerce-store',
      title: 'E-Commerce Store',
      description: 'Platform toko online dengan fitur keranjang belanja, pembayaran, dan dashboard admin untuk mengelola produk.',
      image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80',
      category: 'Web Development',
      technologies: ['React', 'Node.js', 'MongoDB', 'Stripe'],
      liveUrl: 'https://example.com',
    },
    {
      id: 'network-scanner',
      title: 'Network Security Scanner',
      description: 'Tool untuk scanning jaringan dan mendeteksi vulnerability pada sistem. Membantu identifikasi kelemahan keamanan.',
      image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&q=80',
      category: 'Cyber Security',
      technologies: ['Python', 'Nmap', 'Linux', 'Bash'],
      githubUrl: 'https://github.com',
    },
    {
      id: 'school-website',
      title: 'Website Sekolah',
      description: 'Website informatif untuk sekolah dengan fitur berita, galeri foto, dan sistem informasi siswa.',
      image: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800&q=80',
      category: 'Web Development',
      technologies: ['HTML', 'CSS', 'JavaScript', 'PHP'],
      liveUrl: 'https://example.com',
    },
    {
      id: 'password-manager',
      title: 'Secure Password Manager',
      description: 'Aplikasi untuk menyimpan password dengan enkripsi AES-256. Aman dan mudah digunakan.',
      image: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=800&q=80',
      category: 'Cyber Security',
      technologies: ['Python', 'Cryptography', 'SQLite'],
      githubUrl: 'https://github.com',
    },
    {
      id: 'landing-page-client',
      title: 'Landing Page Bisnis',
      description: 'Landing page modern untuk client bisnis dengan desain yang menarik dan responsif.',
      image: 'https://images.unsplash.com/photo-1522542550221-31fd8575f488?w=800&q=80',
      category: 'Web Development',
      technologies: ['React', 'Tailwind CSS', 'Vite'],
      liveUrl: 'https://example.com',
    },
  ],
  whatsappNumber: "+6282122662713",
};

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

export const PortfolioProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [data, setData] = useState<PortfolioData>(() => {
    const saved = localStorage.getItem('portfolioData');
    return saved ? { ...defaultData, ...JSON.parse(saved) } : defaultData;
  });
  
  const [isAdmin, setIsAdmin] = useState(() => {
    return localStorage.getItem('isAdmin') === 'true';
  });

  useEffect(() => {
    localStorage.setItem('portfolioData', JSON.stringify(data));
  }, [data]);

  const updateData = (newData: Partial<PortfolioData>) => {
    setData(prev => ({ ...prev, ...newData }));
  };

  const login = (username: string, password: string): boolean => {
    if (username === 'AdminPanel' && password === 'Kemerdekaan45') {
      setIsAdmin(true);
      localStorage.setItem('isAdmin', 'true');
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAdmin(false);
    localStorage.removeItem('isAdmin');
  };

  return (
    <PortfolioContext.Provider value={{ data, updateData, isAdmin, login, logout }}>
      {children}
    </PortfolioContext.Provider>
  );
};

export const usePortfolio = () => {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error('usePortfolio must be used within a PortfolioProvider');
  }
  return context;
};

-- Create portfolio_data table for storing all portfolio content
CREATE TABLE public.portfolio_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL DEFAULT 'M. Al Hikam Baihaqi',
  tagline TEXT NOT NULL DEFAULT 'Web Developer & Cyber Security Enthusiast',
  age INTEGER NOT NULL DEFAULT 13,
  grade TEXT NOT NULL DEFAULT 'VIII',
  bio TEXT NOT NULL DEFAULT 'Seorang pelajar kelas VIII yang memiliki passion dalam dunia web development dan cyber security.',
  profile_image TEXT,
  logo_image TEXT,
  whatsapp TEXT DEFAULT '6281234567890',
  email TEXT DEFAULT 'contact@alhikam.dev',
  github TEXT DEFAULT 'https://github.com/alhikam',
  instagram TEXT DEFAULT 'https://instagram.com/alhikam',
  location TEXT DEFAULT 'Indonesia',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create skills table
CREATE TABLE public.skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  portfolio_id UUID REFERENCES public.portfolio_data(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  percentage INTEGER NOT NULL DEFAULT 0,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create packages table for services
CREATE TABLE public.packages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  portfolio_id UUID REFERENCES public.portfolio_data(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  price_min INTEGER NOT NULL DEFAULT 0,
  price_max INTEGER NOT NULL DEFAULT 0,
  features TEXT[] DEFAULT '{}',
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create projects table
CREATE TABLE public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  portfolio_id UUID REFERENCES public.portfolio_data(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  image TEXT,
  category TEXT,
  technologies TEXT[] DEFAULT '{}',
  live_url TEXT,
  github_url TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create user_roles table for admin access (security best practice)
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL DEFAULT 'user',
  UNIQUE (user_id, role)
);

-- Enable RLS on all tables
ALTER TABLE public.portfolio_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- RLS Policies for portfolio_data (public read, admin write)
CREATE POLICY "Anyone can view portfolio" ON public.portfolio_data
  FOR SELECT USING (true);

CREATE POLICY "Admins can update portfolio" ON public.portfolio_data
  FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert portfolio" ON public.portfolio_data
  FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for skills
CREATE POLICY "Anyone can view skills" ON public.skills
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage skills" ON public.skills
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for packages
CREATE POLICY "Anyone can view packages" ON public.packages
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage packages" ON public.packages
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for projects
CREATE POLICY "Anyone can view projects" ON public.projects
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage projects" ON public.projects
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS for user_roles (only admins can view/manage)
CREATE POLICY "Users can view own role" ON public.user_roles
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

-- Function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Trigger for portfolio_data timestamp
CREATE TRIGGER update_portfolio_data_updated_at
  BEFORE UPDATE ON public.portfolio_data
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default portfolio data
INSERT INTO public.portfolio_data (
  name, tagline, age, grade, bio, whatsapp, email, github, instagram, location
) VALUES (
  'M. Al Hikam Baihaqi',
  'Web Developer & Cyber Security Enthusiast',
  13,
  'VIII',
  'Seorang pelajar kelas VIII yang memiliki passion dalam dunia web development dan cyber security. Fokus pada pengembangan website modern dan keamanan digital.',
  '6281234567890',
  'contact@alhikam.dev',
  'https://github.com/alhikam',
  'https://instagram.com/alhikam',
  'Indonesia'
);
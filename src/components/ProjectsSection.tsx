import React, { useState } from 'react';
import { usePortfolio } from '@/contexts/PortfolioContext';
import { ExternalLink, Github, X } from 'lucide-react';
import { Dialog, DialogContent, DialogClose } from '@/components/ui/dialog';
import { type Project } from '@/hooks/usePortfolioData';

const ProjectsSection: React.FC = () => {
  const { projects } = usePortfolio();
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  if (!projects || projects.length === 0) return null;

  return (
    <section id="projects" className="py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-heading font-bold mb-3">
            <span className="gradient-text">Proyek</span> Portfolio
          </h2>
          <p className="text-muted-foreground text-xs md:text-sm max-w-md mx-auto">
            Beberapa proyek yang telah saya kerjakan
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, index) => (
            <div
              key={project.id}
              className="glass-card group cursor-pointer overflow-hidden hover:border-primary/50 transition-all duration-300"
              style={{ animationDelay: `${index * 100}ms` }}
              onClick={() => setSelectedProject(project)}
            >
              {/* Project Image */}
              <div className="relative h-48 overflow-hidden">
                {project.image ? (
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full bg-muted flex items-center justify-center">
                    <span className="text-muted-foreground text-xs">No Image</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent" />
                
                {/* Category Badge */}
                <div className="absolute top-3 left-3">
                  <span className="px-2 py-1 text-[10px] font-medium bg-primary/20 text-primary border border-primary/30 rounded-full">
                    {project.category}
                  </span>
                </div>
              </div>

              {/* Project Info */}
              <div className="p-4">
                <h3 className="text-sm font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                  {project.title}
                </h3>
                <p className="text-muted-foreground text-xs line-clamp-2 mb-3">
                  {project.description}
                </p>

                {/* Tech Stack */}
                <div className="flex flex-wrap gap-1.5">
                  {project.technologies?.slice(0, 3).map((tech) => (
                    <span
                      key={tech}
                      className="px-2 py-0.5 text-[10px] bg-secondary text-secondary-foreground rounded"
                    >
                      {tech}
                    </span>
                  ))}
                  {(project.technologies?.length || 0) > 3 && (
                    <span className="px-2 py-0.5 text-[10px] bg-secondary text-muted-foreground rounded">
                      +{(project.technologies?.length || 0) - 3}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Project Detail Modal */}
        <Dialog open={!!selectedProject} onOpenChange={() => setSelectedProject(null)}>
          <DialogContent className="max-w-2xl glass-card border-primary/30 p-0 overflow-hidden">
            {selectedProject && (
              <>
                {/* Modal Image */}
                <div className="relative h-64">
                  {selectedProject.image ? (
                    <img
                      src={selectedProject.image}
                      alt={selectedProject.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-muted flex items-center justify-center">
                      <span className="text-muted-foreground">No Image</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
                  
                  <DialogClose className="absolute top-4 right-4 p-2 bg-background/50 backdrop-blur-sm rounded-full hover:bg-background/80 transition-colors">
                    <X className="w-4 h-4" />
                  </DialogClose>
                </div>

                {/* Modal Content */}
                <div className="p-6 -mt-12 relative">
                  <span className="inline-block px-2 py-1 text-[10px] font-medium bg-primary/20 text-primary border border-primary/30 rounded-full mb-3">
                    {selectedProject.category}
                  </span>
                  
                  <h3 className="text-xl font-bold text-foreground mb-2">
                    {selectedProject.title}
                  </h3>
                  
                  <p className="text-muted-foreground text-sm mb-4">
                    {selectedProject.description}
                  </p>

                  {/* Technologies */}
                  <div className="mb-4">
                    <h4 className="text-xs font-semibold text-foreground mb-2">Teknologi:</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedProject.technologies?.map((tech) => (
                        <span
                          key={tech}
                          className="px-2 py-1 text-xs bg-secondary text-secondary-foreground rounded"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Links */}
                  <div className="flex gap-3">
                    {selectedProject.live_url && (
                      <a
                        href={selectedProject.live_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 text-xs btn-neon rounded-lg"
                      >
                        <ExternalLink className="w-3 h-3" />
                        Live Demo
                      </a>
                    )}
                    {selectedProject.github_url && (
                      <a
                        href={selectedProject.github_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 text-xs bg-secondary text-secondary-foreground hover:bg-secondary/80 rounded-lg transition-colors"
                      >
                        <Github className="w-3 h-3" />
                        GitHub
                      </a>
                    )}
                  </div>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
};

export default ProjectsSection;

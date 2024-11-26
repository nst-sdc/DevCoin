import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { Loader2 } from 'lucide-react';
import ProjectCard from './ProjectCard';
import { fetchRepositories } from '../../services/github';
import type { Repository } from '../../services/github';
import { useAuth } from '../../contexts/AuthContext';
import { assignProject } from '../../services/admin';

export default function ProjectList() {
  const [projects, setProjects] = useState<Repository[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const repos = await fetchRepositories();
        setProjects(repos);
      } catch (error) {
        toast.error('Failed to load projects');
      } finally {
        setLoading(false);
      }
    };

    loadProjects();
    // Refresh every 5 minutes
    const interval = setInterval(loadProjects, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const handleAssign = async (projectId: number) => {
    if (!user) {
      toast.error('Please sign in to get assigned to a project');
      return;
    }

    try {
      await assignProject(projectId.toString(), user.id);
      toast.success('Successfully assigned to project');
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {projects.map(project => (
        <ProjectCard
          key={project.id}
          project={project}
          onAssign={() => handleAssign(project.id)}
        />
      ))}
    </div>
  );
}
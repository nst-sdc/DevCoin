import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import ProjectList from '../components/projects/ProjectList';

export default function ProjectPage() {
  return (
      <div className="relative z-10 mb-16 pt-20 max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-white">Active Projects</h2>
          <Link to="/coins" className="flex items-center text-indigo-400 hover:text-indigo-300">View All Projects 
            <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </div>
        <ProjectList />
      </div>
  );
}
import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import ProjectList from '../components/projects/ProjectList';

export default function HomePage() {
  return (
    <div className="py-12">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Welcome to Dev Club
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Join our community of passionate developers, earn Dev Coins, and showcase your contributions.
        </p>
      </div>

      <div className="mb-16">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Active Projects</h2>
          <Link
            to="/coins"
            className="flex items-center text-indigo-600 hover:text-indigo-700"
          >
            View All Projects <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </div>
        <ProjectList />
      </div>
    </div>
  );
}
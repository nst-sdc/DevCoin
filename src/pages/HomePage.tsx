import React from 'react';
import { Code2, Github, Terminal } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function HomePage() {
  return (
      <div className="relative z-10 pt-20 text-center">
        <div className="flex justify-center items-center mb-6">
          <Code2 className="h-16 w-16 text-indigo-400 mr-4" />
          <h1 className="text-5xl font-bold text-white">Dev Club</h1>
        </div>
        <p className="text-xl text-indigo-200 max-w-2xl mx-auto px-4 mb-8">
          Join our community of passionate developers, earn Dev Coins, and showcase your contributions.
        </p>

        <div className="flex justify-center space-x-4 mb-12">
          <Link to="/signup"
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center">
            <Terminal className="w-5 h-5 mr-2" />Get Started</Link>
          <Link to="/projects"
            className="px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center">
            <Github className="w-5 h-5 mr-2" />View Projects</Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto px-4">
          <div className="bg-gray-800 bg-opacity-50 rounded-lg p-6">
            <div className="text-3xl font-bold text-indigo-400 mb-2">10+</div>
            <div className="text-gray-300">Active Members</div>
          </div>
          <div className="bg-gray-800 bg-opacity-50 rounded-lg p-6">
            <div className="text-3xl font-bold text-indigo-400 mb-2">10+</div>
            <div className="text-gray-300">Projects</div>
          </div>
          <div className="bg-gray-800 bg-opacity-50 rounded-lg p-6">
            <div className="text-3xl font-bold text-indigo-400 mb-2">100+</div>
            <div className="text-gray-300">Dev Coins Awarded</div>
          </div>
        </div>
      </div>
  );
}
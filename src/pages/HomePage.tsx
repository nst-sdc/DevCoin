import React from 'react';
import { Code2, FolderKanban, Github, Terminal, UserPlus } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function HomePage() {
  return (
    <>
      <div className="relative z-10 pt-20 text-center">
        <div className="flex justify-center items-center mb-6">
          <Code2 className="h-16 w-16 text-indigo-400 mr-4" />
          <h1 className="text-5xl font-bold text-white">Dev Club</h1>
        </div>
        <p className="text-xl text-indigo-200 max-w-2xl mx-auto px-4 mb-8">
          Join our community of passionate developers, earn Dev Coins, and
          showcase your contributions.
        </p>

        <div className="flex justify-center space-x-4 mb-12">
          <Link
            to="/signup"
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center"
          >
            <Terminal className="w-5 h-5 mr-2" />
            Get Started
          </Link>
          <Link
            to="/projects"
            className="px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center"
          >
            <Github className="w-5 h-5 mr-2" />
            View Projects
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto px-4 mb-12">
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

      <div className='mb-12'>
        <div className="hero-content flex-col lg:flex-row-reverse gap-12 max-w-7xl mx-auto px-4">
          <div className="relative animate__animated animate__fadeInRight lg:w-2/3">
            <div className="relative z-10 bg-[#1E1E1E] p-8 rounded-2xl shadow-2xl border border-gray-700/50">
              <div className="space-y-8">
          <div className="flex items-center gap-4 border-b border-gray-700/50 pb-4">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
          <div className="space-y-6 font-mono text-sm">
            <div className="h-4 bg-indigo-500/10 rounded w-3/4"></div>
            <div className="h-4 bg-indigo-500/10 rounded"></div>
            <div className="h-4 bg-indigo-500/10 rounded w-1/2"></div>
            <div className="text-indigo-400">
              Loading
              <span className="animate-[dots_1.5s_ease-in-out_infinite]">.</span>
              <span className="animate-[dots_1.5s_ease-in-out_0.5s_infinite]">.</span>
              <span className="animate-[dots_1.5s_ease-in-out_1s_infinite]">.</span>
            </div>
          </div>
          <div className="flex gap-6">
            <div className="flex-1 h-24 bg-indigo-500/10 rounded-lg border border-indigo-500/20"></div>
            <div className="flex-1 h-24 bg-indigo-500/10 rounded-lg border border-indigo-500/20"></div>
          </div>
              </div>
            </div>
          </div>

          {/* Left section - Text Content */}
          <div className="lg:w-1/3 lg:text-left text-center px-4">
        <h1 className="text-5xl font-bold text-white mb-3">Build. Learn.</h1>
        <h1 className="text-5xl font-bold bg-gradient-to-r from-indigo-400 to-indigo-600 text-transparent bg-clip-text mb-8">Innovate.</h1>
        <p className="mb-8 text-gray-300 text-lg">
          Join the most active web development community on campus. 
          Learn modern technologies, build amazing projects, and grow your skills with like-minded developers.
        </p>
        <div className="flex gap-6 flex-wrap justify-center lg:justify-start">
        <a 
            href="https://recruitment.nstsdc.org/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="btn btn-primary"
          >
            <UserPlus className="w-5 h-5 mr-2" />
            Join
          </a>

          <a 
            href="https://github.com/nst-sdc" 
            target="_blank" 
            rel="noopener noreferrer"
            className="btn btn-ghost border-indigo-500/20 hover:bg-indigo-500/10"
          >
            <FolderKanban className="w-5 h-5 mr-2" />
            View Projects
          </a>
        </div>
          </div>
        </div>
      </div>
    </>
  );
}
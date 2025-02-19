import React from 'react';
import { Code2, GithubIcon, Heart, Linkedin, TwitterIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer p-6 bg-[#02191C]/80 backdrop-blur-md text-base-content border-t border-indigo-500/10">
      
      <div className="max-w-7xl w-full mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="flex flex-col gap-2">
          <Link to="/" className="flex items-center gap-2">
            <Code2 className="h-6 w-6 text-indigo-400" />
            <span className="font-bold text-lg text-gray-200">Dev Club</span>
          </Link>
          <p className="text-sm text-gray-400">Building Developer Community</p>
        </div>

        <div className="flex flex-col gap-2">
          <h3 className="text-gray-200 font-semibold mb-2">Quick Links</h3>
          <Link to="/projects" className="text-sm text-zinc-300 hover:text-indigo-400 transition-colors">Projects</Link>
          <Link to="/coins" className="text-sm text-zinc-300 hover:text-indigo-400 transition-colors">Dev Coins</Link>
          <Link to="/members" className="text-sm text-zinc-300 hover:text-indigo-400 transition-colors">Members</Link>
          <Link to="/leaderboard" className="text-sm text-zinc-300 hover:text-indigo-400 transition-colors">Leaderboard</Link>
        </div>

        <div className="flex flex-col gap-2">
          <h3 className="text-gray-200 font-semibold mb-2">Resources</h3>
          {/* <Link to="/docs" className="text-sm text-zinc-300 hover:text-indigo-400 transition-colors">Documentation</Link> */}
          <a href="https://github.com/nst-sdc" target="_blank" rel="noopener noreferrer" 
            className="text-sm text-zinc-300 hover:text-indigo-400 transition-colors">GitHub</a>
          {/* <Link to="/faq" className="text-sm text-zinc-300 hover:text-indigo-400 transition-colors">FAQ</Link> */}
        </div>

        <div className="flex flex-col gap-4">
          <h3 className="text-gray-200 font-semibold">Connect With Us</h3>
            <div className="flex gap-4">
            <a href="https://github.com/nst-sdc" target="_blank" rel="noopener noreferrer">
              <GithubIcon className="h-6 w-6 text-gray-300 hover:text-indigo-400 transition-colors" />
            </a>
            <a href="https://www.linkedin.com/company/nst-sdc/" target="_blank" rel="noopener noreferrer">
              <Linkedin className="h-6 w-6 text-gray-300 hover:text-indigo-400 transition-colors" />
            </a>
            <a href="https://x.com/NSTSDC_" target="_blank" rel="noopener noreferrer">
              <TwitterIcon className="h-6 w-6 text-gray-300 hover:text-indigo-400 transition-colors" />
            </a>
            </div>
          <div className="text-sm text-zinc-300 flex items-center gap-1">
            <span>Made with</span>
            <Heart className="h-3 w-3 text-red-500 fill-current animate-pulse" />
            <span>by</span>
            <a href="https://github.com/nst-sdc" target="_blank" rel="noopener noreferrer"
              className="text-indigo-400 hover:text-indigo-300 transition-colors">
              NST-SDC
            </a>
          </div>

          <p className="text-sm text-zinc-300">© {currentYear} NST-SDC</p>

        </div>
      </div>
    </footer>
  );
}
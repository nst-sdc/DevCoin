import React from 'react';
import { Code2, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center space-y-4">
          <Link to="/" className="flex items-center space-x-2">
            <Code2 className="h-8 w-8 text-indigo-600" />
            <span className="font-bold text-xl">Dev Club</span>
          </Link>
          
          <div className="flex items-center space-x-1 text-gray-500 text-sm">
            <span>Made with</span>
            <Heart className="h-4 w-4 text-red-500 fill-current" />
            <span>by</span>
            <a 
              href="https://github.com/vivek-w"
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-600 hover:text-indigo-500"
            >
              Vivek W
            </a>
          </div>

          <div className="text-sm text-gray-500">
            © {currentYear} Dev Club. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}
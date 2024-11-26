import React from 'react';
import { Code2, Users, Trophy, ArrowRight } from 'lucide-react';
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

      <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        <FeatureCard
          to="/coins"
          icon={<Code2 className="h-8 w-8 text-indigo-600" />}
          title="Dev Coins"
          description="Track your contributions and earn rewards through our Dev Coin system."
        />
        <FeatureCard
          to="/members"
          icon={<Users className="h-8 w-8 text-indigo-600" />}
          title="Members"
          description="Connect with fellow developers and explore member profiles."
        />
        <FeatureCard
          to="/leaderboard"
          icon={<Trophy className="h-8 w-8 text-indigo-600" />}
          title="Leaderboard"
          description="Compete with others and climb the ranks in our Dev Coin leaderboard."
        />
      </div>
    </div>
  );
}

function FeatureCard({ 
  to, 
  icon, 
  title, 
  description 
}: { 
  to: string; 
  icon: React.ReactNode; 
  title: string; 
  description: string;
}) {
  return (
    <Link
      to={to}
      className="bg-white rounded-xl shadow-md p-6 transition-all hover:shadow-lg hover:-translate-y-1"
    >
      <div className="flex flex-col items-center text-center">
        <div className="mb-4 p-3 bg-indigo-50 rounded-full">
          {icon}
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 mb-4">{description}</p>
        <div className="flex items-center text-indigo-600 font-medium">
          Learn More <ArrowRight className="ml-1 h-4 w-4" />
        </div>
      </div>
    </Link>
  );
}
import React from 'react';
import { Code2, Users, Trophy, Coins, Github } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen pt-20 px-4">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            About Dev Club
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Building a community of passionate developers, fostering collaboration,
            and rewarding contributions.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <FeatureCard
            icon={<Users className="h-8 w-8 text-indigo-400" />}
            title="Community"
            description="Join a vibrant community of developers, share knowledge, and grow together."
          />
          <FeatureCard
            icon={<Coins className="h-8 w-8 text-indigo-400" />}
            title="Dev Coins"
            description="Earn Dev Coins for your contributions and showcase your achievements."
          />
          <FeatureCard
            icon={<Github className="h-8 w-8 text-indigo-400" />}
            title="Open Source"
            description="Contribute to projects, learn from others, and build your portfolio."
          />
        </div>

        {/* Mission Section */}
        <div className="bg-gray-400 bg-opacity-15 rounded-lg p-8 mb-16 backdrop-blur-sm border border-indigo-500/10">
          <h2 className="text-2xl font-bold text-white mb-4">Our Mission</h2>
          <p className="text-gray-400 mb-6">
            Dev Club aims to create an inclusive environment where developers can learn,
            collaborate, and grow together. We believe in:
          </p>
          <ul className="list-disc list-inside text-gray-400 space-y-2">
            <li>Fostering a supportive community for developers of all levels</li>
            <li>Encouraging open source contributions and collaboration</li>
            <li>Recognizing and rewarding valuable contributions</li>
            <li>Providing opportunities for learning and growth</li>
          </ul>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-4">
          <StatCard number="10+" label="Active Members" />
          <StatCard number="10+" label="Projects Completed" />
          <StatCard number="100+" label="Dev Coins Awarded" />
        </div>
      </div>
    </div>
  );
}

// Helper Components
interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="bg-gray-400 bg-opacity-15 rounded-lg p-6 backdrop-blur-sm border border-indigo-500/10">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
      <p className="text-gray-400">{description}</p>
    </div>
  );
}

function StatCard({ number, label }: { number: string; label: string }) {
  return (
    <div className="bg-gray-400 bg-opacity-15 rounded-lg p-6 text-center backdrop-blur-sm border border-indigo-500/10">
      <div className="text-3xl font-bold text-indigo-400 mb-2">{number}</div>
      <div className="text-gray-400">{label}</div>
    </div>
  );
}
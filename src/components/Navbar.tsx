import React from 'react';
import { Code2, Users, Trophy, Home, LogIn, LogOut, UserPlus, User, FolderGit2 } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  
  const isActive = (path: string) => location.pathname === path;

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success('Successfully signed out');
      navigate('/');
    } catch (error) {
      toast.error('Failed to sign out');
    }
  };
  
  return (
    <div className="navbar fixed top-0 z-50 px-4 backdrop-blur-sm border-b border-indigo-500/10"
      style={{
        background: 'linear-gradient(to right, rgba(2, 25, 28, 0.9), rgba(3, 35, 41, 0.9), rgba(2, 25, 28, 0.9))'
      }}>
      <div className="navbar-start">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost btn-circle lg:hidden">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </div>
          <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow-lg bg-base-200/95 backdrop-blur-md rounded-box w-52 gap-1">
            <NavLinkMobile to="/" icon={<Home className="w-4 h-4" />} text="Home" active={isActive('/')} />
            <NavLinkMobile to="/projects" icon={<FolderGit2 className="w-4 h-4" />} text="Projects" active={isActive('/projects')} />
            <NavLinkMobile to="/coins" icon={<Code2 className="w-4 h-4" />} text="Dev Coins" active={isActive('/coins')} />
            <NavLinkMobile to="/members" icon={<Users className="w-4 h-4" />} text="Members" active={isActive('/members')} />
            <NavLinkMobile to="/leaderboard" icon={<Trophy className="w-4 h-4" />} text="Leaderboard" active={isActive('/leaderboard')} />
            <NavLinkMobile to="https://recruitment.nstsdc.org/" icon={<UserPlus className="w-4 h-4" />} text="Recruitment" active={isActive('/recruitment')} />
          </ul>
        </div>
        <Link to="/" className="btn btn-ghost normal-case text-xl gap-2 ml-2">
          <Code2 className="h-6 w-6 text-primary animate-pulse" />
          <span className="font-bold bg-gradient-to-r from-white to-indigo-300 text-transparent bg-clip-text">Dev Club</span>
        </Link>
      </div>
      
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal gap-1">
          <NavLink to="/" icon={<Home className="w-4 h-4" />} text="Home" active={isActive('/')} />
          <NavLink to="/projects" icon={<FolderGit2 className="w-4 h-4" />} text="Projects" active={isActive('/projects')} />
          <NavLink to="/coins" icon={<Code2 className="w-4 h-4" />} text="Dev Coins" active={isActive('/coins')} />
          <NavLink to="/members" icon={<Users className="w-4 h-4" />} text="Members" active={isActive('/members')} />
          <NavLink to="/leaderboard" icon={<Trophy className="w-4 h-4" />} text="Leaderboard" active={isActive('/leaderboard')} />
          <NavLink to="https://recruitment.nstsdc.org/" icon={<UserPlus className="w-4 h-4" />} text="Recruitment" active={isActive('recruitment')} />
        </ul>
      </div>
      
      <div className="navbar-end gap-2">
        {user ? (
          <>
            {user.role === 'admin' || user.role === 'super_admin' ? (
              <Link to="/admin" className="btn btn-ghost btn-sm bg-indigo-500/10 hover:bg-indigo-500/20">
                <Code2 className="h-4 w-4" />
                Admin
              </Link>
            ) : null}
            <div className="dropdown dropdown-end">
              <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar ring-2 ring-primary ring-offset-base-100 ring-offset-2">
                <div className="w-10 rounded-full">
                  <img src={user.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"} alt="avatar" />
                </div>
              </div>
              <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow-lg bg-base-200/95 backdrop-blur-md rounded-box w-52">
                <li><Link to="/profile" className="flex items-center gap-2"><Users className="w-4 h-4" />Profile</Link></li>
                <li><button onClick={handleSignOut} className="flex items-center gap-2"><LogOut className="w-4 h-4" />Sign Out</button></li>
              </ul>
            </div>
          </>
        ) : (
          <>
            <Link to="/signin" className="btn btn-ghost btn-sm">
              <LogIn className="h-4 w-4 mr-2" />
              Sign In
            </Link>
            <Link to="/signup" className="btn btn-primary btn-sm">
              <UserPlus className="h-4 w-4 mr-2" />
              Sign Up
            </Link>
          </>
        )}
      </div>
    </div>
  );
}

function NavLink({ to, icon, text, active }: { to: string; icon: React.ReactNode; text: string; active: boolean }) {
  return (
    <li>
      <Link
        to={to}
        className={`hover:bg-indigo-500/5 ${active ? 'bg-indigo-500/10 text-indigo-400' : 'text-gray-300'}`}
      >
        {icon}
        <span>{text}</span>
      </Link>
    </li>
  );
}

function NavLinkMobile({ to, icon, text, active }: { to: string; icon: React.ReactNode; text: string; active: boolean }) {
  return (
    <li>
      <Link
        to={to}
        className={`hover:bg-indigo-500/5 ${active ? 'bg-indigo-500/10 text-indigo-400' : 'text-gray-300'}`}
      >
        {icon}
        <span>{text}</span>
      </Link>
    </li>
  );
}
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { GraduationCap, BookOpen, Clock } from 'lucide-react';

export default function Header() {
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <header id="app-header" className="bg-[#0f2d59] text-white shadow-md border-b-4 border-amber-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand/Logo Area */}
          <Link id="logo-link" to="/" className="flex items-center space-x-3.5 group">
            <div className="relative flex items-center justify-center">
              {/* Outer glowing ring */}
              <div className="absolute inset-0 bg-gradient-to-tr from-amber-400 to-amber-600 rounded-full opacity-30 blur-[3px] group-hover:scale-110 transition-transform duration-300" />
              {/* Inner container */}
              <div className="relative p-2.5 bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 rounded-full text-[#0f2d59] shadow-inner transform group-hover:rotate-6 transition-all duration-300">
                <div className="absolute -top-1 -right-1 bg-[#0f2d59] text-amber-400 text-[9px] font-black font-mono px-1 rounded-full border border-amber-400 shadow-sm scale-90">
                  2.0
                </div>
                <GraduationCap className="h-6 w-6 filter drop-shadow-[0_1.5px_1.5px_rgba(15,45,89,0.2)]" />
              </div>
            </div>
            <div>
              <h1 className="font-sans font-black tracking-tight text-lg sm:text-xl leading-none flex items-center gap-1.5">
                <span>KCET CGPA Calculator</span>
                <span className="bg-gradient-to-r from-amber-400 to-amber-300 text-[#0f2d59] text-[10px] font-mono font-black px-1.5 py-0.5 rounded-md shadow-sm border border-amber-500 uppercase tracking-wider">
                  v2.0
                </span>
              </h1>
              <p className="text-[11px] sm:text-xs text-slate-300 font-mono mt-0.5">
                Kamaraj College of Engg. & Tech. (Autonomous)
              </p>
            </div>
          </Link>

          {/* Quick Info Alerts */}
          <div className="hidden md:flex items-center space-x-6 text-sm text-slate-300 font-mono">
            <div className="flex items-center space-x-2">
              <BookOpen className="h-4 w-4 text-amber-500" />
              <span>Regulation: R2021</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-amber-500" />
              <span>Mark-Based System</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

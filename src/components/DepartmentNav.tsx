import React, { useRef } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Home, Percent, Shield } from 'lucide-react';
import { KCET_DEPARTMENTS } from '../config/calculationConfig';

export default function DepartmentNav() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const navigate = useNavigate();

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 250;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div id="department-navigation-bar" className="bg-[#143e75] text-white border-b border-[#0f2d59] sticky top-0 z-30 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative flex items-center">
        {/* Scroll Left Button (Mobile/Horizontal indicator) */}
        <button
          id="nav-scroll-left"
          onClick={() => handleScroll('left')}
          className="md:hidden p-1.5 bg-[#0f2d59] text-amber-500 rounded-full hover:bg-amber-500 hover:text-[#0f2d59] transition-colors mr-1"
          aria-label="Scroll navigation left"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        {/* Navigation Tabs Area */}
        <div
          ref={scrollContainerRef}
          className="flex items-center space-x-1 overflow-x-auto scrollbar-none py-3 w-full scroll-smooth select-none"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {/* Home Tab */}
          <NavLink
            to="/"
            className={({ isActive }) =>
              `flex items-center space-x-1.5 px-4 py-2 rounded-md font-sans text-sm font-medium transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-amber-500 text-[#0f2d59] font-bold shadow-sm'
                  : 'text-slate-200 hover:bg-[#1c5396] hover:text-white'
              }`
            }
          >
            <Home className="h-4 w-4" />
            <span>Home</span>
          </NavLink>

          {/* CGPA Tab */}
          <NavLink
            to="/cgpa"
            className={({ isActive }) =>
              `flex items-center space-x-1.5 px-4 py-2 rounded-md font-sans text-sm font-medium transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-amber-500 text-[#0f2d59] font-bold shadow-sm'
                  : 'text-slate-200 hover:bg-[#1c5396] hover:text-white'
              }`
            }
          >
            <Percent className="h-4 w-4" />
            <span>CGPA</span>
          </NavLink>

          {/* Departments */}
          <span className="h-6 w-[1px] bg-slate-500 opacity-50 mx-1 flex-shrink-0" />

          {KCET_DEPARTMENTS.map((dept) => (
            <NavLink
              key={dept.id}
              to={`/gpa/${dept.id}`}
              className={({ isActive }) =>
                `px-4 py-2 rounded-md font-sans text-sm font-medium transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-amber-500 text-[#0f2d59] font-bold shadow-sm'
                    : 'text-slate-200 hover:bg-[#1c5396] hover:text-white'
                }`
              }
            >
              {dept.department_code}
            </NavLink>
          ))}

          {/* Divider & Admin Tab */}
          <span className="h-6 w-[1px] bg-slate-500 opacity-50 mx-1 flex-shrink-0" />

          <NavLink
            to="/admin"
            className={({ isActive }) =>
              `flex items-center space-x-1.5 px-4 py-2 rounded-md font-sans text-sm font-medium transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-amber-600 text-white font-bold shadow-sm'
                  : 'text-slate-300 hover:bg-[#1c5396] hover:text-white'
              }`
            }
          >
            <Shield className="h-4 w-4 text-amber-500" />
            <span>Admin</span>
          </NavLink>
        </div>

        {/* Scroll Right Button */}
        <button
          id="nav-scroll-right"
          onClick={() => handleScroll('right')}
          className="md:hidden p-1.5 bg-[#0f2d59] text-amber-500 rounded-full hover:bg-amber-500 hover:text-[#0f2d59] transition-colors ml-1"
          aria-label="Scroll navigation right"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import DepartmentNav from './components/DepartmentNav';
import Home from './pages/Home';
import GPACalculator from './pages/GPACalculator';
import CGPACalculator from './pages/CGPACalculator';
import Admin from './pages/Admin';

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-100 flex flex-col font-sans antialiased text-slate-800">
        {/* Global Brand Header */}
        <Header />

        {/* Global Horizontal Swipeable Navigation Tabs */}
        <DepartmentNav />

        {/* Main Routed Area */}
        <main className="flex-grow pb-12">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/gpa/:deptId" element={<GPACalculator />} />
            <Route path="/cgpa" element={<CGPACalculator />} />
            <Route path="/manage" element={<Admin />} />
            <Route path="/admin" element={<Navigate to="/" replace />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        {/* Humble, Professional Footer */}
        <footer id="app-footer" className="bg-slate-900 text-slate-400 py-8 text-center text-xs font-mono border-t border-slate-800">
          <div className="max-w-7xl mx-auto px-4 space-y-2">
            <p className="text-slate-200">
              Kamaraj College of Engineering & Technology (Autonomous)
            </p>
            <p className="text-slate-500">
              S.P.G.Chidambara Nadar - C.Nagammal Campus, S.P.G.C.Nagar, K.Vellakulam Near Virudhunagar, Madurai, Tamil Nadu.
            </p>
            <div className="py-2">
              <a
                href="https://www.linkedin.com/in/santhosh-ssk"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-400 hover:text-amber-400 hover:underline active:underline focus:underline active:text-amber-400 transition-all font-sans text-xs cursor-pointer inline-block"
              >
                Developed & Built by ssk
              </a>
            </div>
            <p className="pt-2 text-[10px] text-slate-600 border-t border-slate-800/60 max-w-md mx-auto">
              This application is an independent full-stack rebuild. All grading regulations are configured dynamically and stored securely.
            </p>
          </div>
        </footer>
      </div>
    </BrowserRouter>
  );
}

'use client';
import { useState } from 'react';
import { Film, Menu } from 'lucide-react';

export default function AdminLayout({ sidebarNav, children, main }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const content = main ?? children;

  // If used as a Next.js route layout (no sidebar provided), render children only to avoid double layout
  if (!sidebarNav) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="bg-slate-900/80 backdrop-blur-md border-b border-purple-500/20 sticky top-0 z-40">
        <div className="flex items-center justify-between px-4 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-white lg:hidden"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="flex items-center gap-3">
              <Film className="w-8 h-8 text-purple-400" />
              <div>
                <h1 className="text-xl font-bold text-white">Doc à Tunis</h1>
                <p className="text-xs text-gray-400">Dashboard Admin</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
            lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-30
            w-64 bg-slate-900/50 backdrop-blur-md border-r border-purple-500/20
            transition-transform duration-300 ease-in-out mt-[73px] lg:mt-0
          `}
        >
          {sidebarNav}
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4 lg:p-8">{content}</main>
      </div>
    </div>
  );
}

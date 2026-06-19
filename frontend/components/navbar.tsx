"use client";

import Link from 'next/link';
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function Navbar() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Selyado laban sa hydration mismatch checks
  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <>
      {/* MOBILE TOP NAVIGATION BAR */}
      <header className="md:hidden w-full bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 p-4 sticky top-0 z-50 flex justify-between items-center transition-colors">
        <div>
          <Link href="/" className="text-sm font-bold text-zinc-900 dark:text-white tracking-wide">
            Lost Item Finder
          </Link>
        </div>
        <div className="flex items-center gap-4 text-xs font-mono">
          <Link href="/lost" className="text-zinc-600 dark:text-zinc-400">Report</Link>
          <Link href="/browse" className="text-zinc-600 dark:text-zinc-400">Browse</Link>
          <button 
            onClick={toggleTheme}
            className="p-1 rounded bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-[10px]"
          >
            {mounted && theme === "dark" ? "☀️ Light" : "🌙 Dark"}
          </button>
        </div>
      </header>

      {/* DESKTOP SIDEBAR NAVIGATION */}
      <aside className="hidden md:flex w-64 h-screen bg-zinc-100 dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800 p-6 flex-col justify-between fixed left-0 top-0 z-50 transition-colors">
        <div>
          <div className="mb-8 pb-4 border-b border-zinc-200 dark:border-zinc-800 flex justify-between items-start">
            <div>
              <Link href="/" className="text-sm font-bold tracking-wide text-zinc-900 dark:text-white block">
                Lost Item Finder
              </Link>
              <span className="text-[10px] font-mono text-zinc-500 block mt-0.5">
                Japan & Philippines Network
              </span>
            </div>
            
            {/* Desktop Theme Control Toggle */}
            <button 
              onClick={toggleTheme}
              className="p-1.5 rounded bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs shadow-sm hover:bg-zinc-50 dark:hover:bg-zinc-700 transition"
              title="Toggle theme mode"
            >
              {mounted && theme === "dark" ? "☀️" : "🌙"}
            </button>
          </div>

          <nav className="flex flex-col gap-1 text-sm">
            <Link href="/browse" className="px-3 py-2 rounded text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 hover:dark:text-white hover:bg-zinc-200/60 dark:hover:bg-zinc-800 transition-colors">
              Browse All Records
            </Link>
            <Link href="/explore" className="px-3 py-2 rounded text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 hover:dark:text-white hover:bg-zinc-200/60 dark:hover:bg-zinc-800 transition-colors">
              Similarity Verification
            </Link>
            <Link href="/lost" className="px-3 py-2 rounded text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 hover:dark:text-white hover:bg-zinc-200/60 dark:hover:bg-zinc-800 transition-colors">
              File Loss Report
            </Link>
            <Link href="/found" className="px-3 py-2 rounded text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 hover:dark:text-white hover:bg-zinc-200/60 dark:hover:bg-zinc-800 transition-colors">
              Register Found Property
            </Link>
          </nav>
        </div>

        <div className="text-[11px] font-mono text-zinc-500">
          Status: Operational
        </div>
      </aside>
    </>
  );
}
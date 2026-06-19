export default function Home() {
  return (
    <main className="flex min-h-screen flex-col bg-zinc-50 dark:bg-zinc-950 text-zinc-800 dark:text-zinc-200 p-6 md:p-12 transition-colors duration-200">
      
      {/* Page Title */}
      <div className="mb-8 md:mb-10">
        <h1 className="text-xl md:text-2xl font-bold text-zinc-900 dark:text-white tracking-wide">System Overview</h1>
      </div>

      {/* Clean User-Friendly Status Blocks */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 w-full max-w-4xl">
        
        {/* Network Infrastructure */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-5 shadow-sm dark:shadow-none">
          <div className="text-[10px] font-mono text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-2">Covered Regions</div>
          <div className="text-xl font-medium text-zinc-900 dark:text-white">2 Active Countries</div>
          <div className="text-[11px] text-zinc-500 mt-3 font-mono border-t border-zinc-100 dark:border-zinc-800 pt-2 flex justify-between">
            <span>Region 01:</span>
            <span className="text-zinc-600 dark:text-zinc-400">Tokyo, Japan</span>
          </div>
          <div className="text-[11px] text-zinc-500 mt-1 font-mono flex justify-between">
            <span>Region 02:</span>
            <span className="text-zinc-600 dark:text-zinc-400">Manila, Philippines</span>
          </div>
        </div>

        {/* Data Sync Metrics */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-5 shadow-sm dark:shadow-none">
          <div className="text-[10px] font-mono text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-2">Database Connection</div>
          <div className="text-xl font-medium text-zinc-800 dark:text-zinc-300">Live Sync</div>
          <div className="text-[11px] text-zinc-500 mt-3 font-mono border-t border-zinc-100 dark:border-zinc-800 pt-2 flex justify-between">
            <span>System Status:</span>
            <span className="text-emerald-600 dark:text-emerald-500 font-medium">Operational</span>
          </div>
          <div className="text-[11px] text-zinc-500 mt-1 font-mono flex justify-between">
            <span>Data Format:</span>
            <span className="text-zinc-600 dark:text-zinc-400">Real-Time</span>
          </div>
        </div>

        {/* Ingestion Security Status */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-5 shadow-sm dark:shadow-none">
          <div className="text-[10px] font-mono text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-2">Privacy & Security</div>
          <div className="text-xl font-medium text-zinc-800 dark:text-zinc-300">Data Protection</div>
          <div className="text-[11px] text-zinc-500 mt-3 font-mono border-t border-zinc-100 dark:border-zinc-800 pt-2 flex justify-between">
            <span>User Sessions:</span>
            <span className="text-zinc-600 dark:text-zinc-400">Encrypted</span>
          </div>
          <div className="text-[11px] text-zinc-500 mt-1 font-mono flex justify-between">
            <span>Image Storage:</span>
            <span className="text-zinc-600 dark:text-zinc-400">Secure</span>
          </div>
        </div>

      </div>

    </main>
  );
}
"use client";

import { useState } from "react";

export default function SimilarityExplore() {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const executeVectorSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!imagePreview) return;
    
    setIsProcessing(true);
    // TODO: I-integrate ang actual fetch post body request papunta sa FastAPI endpoint mo rito
    setTimeout(() => {
      setIsProcessing(false);
    }, 2000);
  };

  return (
    <main className="flex min-h-screen flex-col bg-zinc-50 dark:bg-zinc-950 text-zinc-800 dark:text-zinc-200 p-6 md:p-12 transition-colors duration-200">
      
      {/* Structural Page Header */}
      <div className="mb-8 md:mb-10">
        <h1 className="text-xl md:text-2xl font-bold text-zinc-900 dark:text-white tracking-wide">
          Similarity Verification
        </h1>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
          Upload an image to scan and search for matching items across Japan and the Philippines.
        </p>
      </div>

      <div className="w-full max-w-xl">
        <form onSubmit={executeVectorSearch} className="space-y-6">
          
          {/* Industrial Upload Canvas Target Zone */}
          <div className="relative group flex flex-col items-center justify-center w-full h-64 bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800 rounded-lg overflow-hidden transition-all">
            {imagePreview ? (
              <div className="absolute inset-0 w-full h-full bg-zinc-950 flex items-center justify-center">
                <img 
                  src={imagePreview} 
                  alt="Upload preview" 
                  className={`w-full h-full object-contain ${isProcessing ? "opacity-40 animate-pulse" : ""}`}
                />
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center w-full h-full cursor-pointer hover:bg-zinc-100/50 dark:hover:bg-zinc-800/30 transition-colors p-6 text-center">
                <div className="text-xs font-mono text-zinc-400 dark:text-zinc-500 tracking-wide uppercase">
                  [ Click to Upload Image ]
                </div>
                <div className="text-[10px] text-zinc-400 dark:text-zinc-600 font-mono mt-2">
                  Supported formats: JPEG, PNG
                </div>
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleImageChange} 
                  className="hidden" 
                />
              </label>
            )}
          </div>

          {/* Action Call Controls */}
          {imagePreview && (
            <div className="flex gap-3 justify-end">
              <button
                type="button"
                onClick={() => setImagePreview(null)}
                disabled={isProcessing}
                className="px-4 py-2 rounded text-xs font-mono border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-900 text-zinc-500 dark:text-zinc-400 transition-colors disabled:opacity-50"
              >
                Clear Image
              </button>
              <button
                type="submit"
                disabled={isProcessing}
                className="px-4 py-2 rounded text-xs font-mono font-medium bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-950 hover:bg-zinc-800 dark:hover:bg-white transition-colors shadow-sm disabled:opacity-50"
              >
                {isProcessing ? "Scanning Image..." : "Search for Matches"}
              </button>
            </div>
          )}

        </form>

        {/* Empty State Vector Results Logs Trace */}
        <div className="mt-8 pt-6 border-t border-zinc-200 dark:border-zinc-800">
          <div className="text-[10px] font-mono text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-3">
            Search Results
          </div>
          <div className="p-4 rounded border border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/40 text-center text-xs font-mono text-zinc-400 dark:text-zinc-600">
            {isProcessing ? "Comparing image patterns..." : "Awaiting image upload to start search."}
          </div>
        </div>

      </div>

    </main>
  );
}
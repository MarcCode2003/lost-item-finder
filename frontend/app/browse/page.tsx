import { supabase } from "../../lib/supabase";

export const dynamic = "force-dynamic";

export default async function BrowseItems() {
  // Concurrent asynchronous database tracking queries
  const [lostRes, foundRes] = await Promise.all([
    supabase.from("lost_items").select("*").order("created_at", { ascending: false }),
    supabase.from("found_items").select("*").order("created_at", { ascending: false })
  ]);

  const lost = lostRes.data || [];
  const found = foundRes.data || [];

  // Map elements into a unified clean array structure
  const unifiedRecords = [
    ...lost.map(item => ({
      id: item.id,
      name: item.item_name,
      description: item.description,
      location: item.location_lost,
      date: item.date_lost,
      image: item.image_url,
      status: "Lost"
    })),
    ...found.map(item => ({
      id: item.id,
      name: item.item_name,
      description: item.description,
      location: item.location_found,
      date: item.date_found,
      image: item.image_url,
      status: "Found"
    }))
  ];

  return (
    <main className="flex min-h-screen flex-col bg-zinc-50 dark:bg-zinc-950 text-zinc-800 dark:text-zinc-200 p-6 md:p-12 transition-colors duration-200">
      
      {/* Structural Page Header */}
      <div className="mb-8 md:mb-10">
        <h1 className="text-xl md:text-2xl font-bold text-zinc-900 dark:text-white tracking-wide">System Records</h1>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
          Active list of items reported across Japan and the Philippines.
        </p>
      </div>

      {/* No Data Fallback Check */}
      {unifiedRecords.length === 0 ? (
        <div className="w-full max-w-4xl border border-dashed border-zinc-200 dark:border-zinc-800 rounded-lg p-12 text-center text-xs font-mono text-zinc-400">
          No items have been recorded yet.
        </div>
      ) : (
        /* Unified System Grid System (Optimized for both desktop and small viewports) */
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 w-full max-w-6xl">
          {unifiedRecords.map((item) => (
            <div 
              key={`${item.status}-${item.id}`} 
              className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg overflow-hidden flex flex-col justify-between shadow-sm dark:shadow-none transition-all"
            >
              
              {/* Telemetry Asset Preview Canvas */}
              <div className="relative w-full h-40 bg-zinc-100 dark:bg-zinc-950 flex items-center justify-center border-b border-zinc-100 dark:border-zinc-800/60">
                {item.image ? (
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <span className="text-[10px] font-mono text-zinc-400 dark:text-zinc-600 uppercase tracking-widest">
                    No Telemetry Image
                  </span>
                )}
                
                {/* Dynamic Infrastructure Status Pill Badge */}
                <div className="absolute top-2 right-2">
                  <span className={`px-2 py-0.5 rounded text-[9px] font-bold font-mono uppercase tracking-wider shadow-sm ${
                    item.status === "Lost"
                      ? "bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20"
                      : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                  }`}>
                    {item.status}
                  </span>
                </div>
              </div>

              {/* Data Specifications Packet Area */}
              <div className="p-4 flex flex-col flex-grow">
                <h3 className="font-semibold text-sm text-zinc-900 dark:text-white truncate">
                  {item.name}
                </h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 line-clamp-2 min-h-[32px] leading-relaxed">
                  {item.description || "No further physical metrics documented."}
                </p>

                {/* Relational Mapping Coordinates */}
                <div className="mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800/60 flex flex-col gap-1 text-[11px] font-mono text-zinc-500 dark:text-zinc-400">
                  <div className="truncate">
                    <span className="text-zinc-400 dark:text-zinc-600">LOC:</span> {item.location}
                  </div>
                  <div>
                    <span className="text-zinc-400 dark:text-zinc-600">DATE:</span> {item.date}
                  </div>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}

    </main>
  );
}
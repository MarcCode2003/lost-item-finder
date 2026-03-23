import { supabase } from "../../lib/supabase";

// This tells Next.js not to cache the page, so it always fetches the newest items
export const dynamic = "force-dynamic"; 

export default async function BrowseItems() {
  // Fetch both tables from Supabase at the same time
  const { data: lostItems } = await supabase
    .from("lost_items")
    .select("*")
    .order("created_at", { ascending: false });

  const { data: foundItems } = await supabase
    .from("found_items")
    .select("*")
    .order("created_at", { ascending: false });

  // Safe fallbacks in case the database is empty
  const lost = lostItems || [];
  const found = foundItems || [];

  return (
    <main className="min-h-screen w-full bg-gray-50 max-w-6xl mx-auto p-6 pt-10">
      <h1 className="text-4xl font-bold text-gray-900 mb-2 text-center">Browse Items</h1>
      <p className="text-gray-600 mb-12 text-center">
        Help us match lost items with their owners.
      </p>

      {/* LOST ITEMS SECTION */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-red-600 mb-6 border-b pb-2">Recently Lost</h2>
        {lost.length === 0 ? (
          <p className="text-gray-500">No lost items reported yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {lost.map((item) => (
              <div key={item.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition">
                {item.image_url ? (
                  <img src={item.image_url} alt={item.item_name} className="w-full h-48 object-cover" />
                ) : (
                  <div className="w-full h-48 bg-gray-100 flex items-center justify-center text-gray-400">No Image</div>
                )}
                <div className="p-4">
                  <h3 className="font-bold text-lg text-gray-900 truncate">{item.item_name}</h3>
                  <p className="text-sm text-gray-500 mt-1 truncate">{item.description}</p>
                  <div className="mt-4 text-xs text-gray-500 flex flex-col gap-1">
                    <span>📍 {item.location_lost}</span>
                    <span>📅 {item.date_lost}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* FOUND ITEMS SECTION */}
      <div>
        <h2 className="text-2xl font-bold text-green-600 mb-6 border-b pb-2">Recently Found</h2>
        {found.length === 0 ? (
          <p className="text-gray-500">No found items reported yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {found.map((item) => (
              <div key={item.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition">
                {item.image_url ? (
                  <img src={item.image_url} alt={item.item_name} className="w-full h-48 object-cover" />
                ) : (
                  <div className="w-full h-48 bg-gray-100 flex items-center justify-center text-gray-400">No Image</div>
                )}
                <div className="p-4">
                  <h3 className="font-bold text-lg text-gray-900 truncate">{item.item_name}</h3>
                  <p className="text-sm text-gray-500 mt-1 truncate">{item.description}</p>
                  <div className="mt-4 text-xs text-gray-500 flex flex-col gap-1">
                    <span>📍 {item.location_found}</span>
                    <span>📅 {item.date_found}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
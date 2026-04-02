"use client";

import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";

// Define our data type so TypeScript is happy
type Item = {
  id: string;
  item_name: string;
  description: string;
  location: string;
  date: string;
  image_url: string;
  type: "LOST" | "FOUND";
  created_at: string;
};

export default function ExploreFeed() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAllItems() {
      try {
        // 1. Fetch all Lost Items
        const { data: lostData, error: lostError } = await supabase
          .from("lost_items")
          .select("*");
        if (lostError) throw lostError;

        // 2. Fetch all Found Items
        const { data: foundData, error: foundError } = await supabase
          .from("found_items")
          .select("*");
        if (foundError) throw foundError;

        // 3. Format and tag the Lost Items
        const formattedLost = (lostData || []).map((item) => ({
          id: `lost-${item.id}`,
          item_name: item.item_name,
          description: item.description,
          location: item.location_lost,
          date: item.date_lost,
          image_url: item.image_url,
          type: "LOST" as const,
          created_at: item.created_at || item.date_lost,
        }));

        // 4. Format and tag the Found Items
        const formattedFound = (foundData || []).map((item) => ({
          id: `found-${item.id}`,
          item_name: item.item_name,
          description: item.description,
          location: item.location_found,
          date: item.date_found,
          image_url: item.image_url,
          type: "FOUND" as const,
          created_at: item.created_at || item.date_found,
        }));

        // 5. Merge them together and sort by newest first!
        const allItems = [...formattedLost, ...formattedFound].sort(
          (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );

        setItems(allItems);
      } catch (error) {
        console.error("Error fetching items:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchAllItems();
  }, []);

  return (
    <main className="max-w-6xl mx-auto p-6 mt-10">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Global Feed</h1>
          <p className="text-gray-600">Browse all recently lost and found items in the database.</p>
        </div>
        <div className="flex gap-4">
          <a href="/lost" className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition">
            + Report Lost
          </a>
          <a href="/found" className="bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 transition">
            + Report Found
          </a>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
      ) : items.length === 0 ? (
        <div className="bg-gray-50 p-10 rounded-xl text-center border border-gray-200">
          <p className="text-gray-500 text-lg">No items have been reported yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {items.map((item) => (
            <div key={item.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition group">
              <div className="relative">
                <img 
                  src={item.image_url} 
                  alt={item.item_name} 
                  className="w-full h-48 object-cover group-hover:scale-105 transition duration-300" 
                />
                <div className="absolute top-3 left-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm ${
                    item.type === "LOST" ? "bg-red-500 text-white" : "bg-green-500 text-white"
                  }`}>
                    {item.type}
                  </span>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-bold text-lg text-gray-900 truncate">{item.item_name}</h3>
                <p className="text-sm text-gray-500 mb-3">{item.date} • {item.location}</p>
                <p className="text-gray-600 text-sm line-clamp-2">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
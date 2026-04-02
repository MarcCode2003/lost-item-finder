"use client";

import { useState } from "react";
import { supabase } from "../../lib/supabase";

// Define what a "Match" looks like based on our SQL function
type Match = {
  id: string;
  item_name: string;
  description: string;
  image_url: string;
  similarity: number;
};

export default function ReportFoundItem() {
  const [loading, setLoading] = useState(false);
  const [matches, setMatches] = useState<Match[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMatches([]); // Clear out any old searches
    setHasSearched(false);

    const form = event.currentTarget;
    const formData = new FormData(form);
    const imageFile = formData.get('image') as File;

    let imageUrl = null;

    if (!imageFile || imageFile.size === 0) {
      alert("Please upload an image so the AI can scan it!");
      setLoading(false);
      return;
    }

    // --- 1. CLOUDINARY UPLOAD (Your Code!) ---
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

    const cloudinaryData = new FormData();
    cloudinaryData.append("file", imageFile);
    cloudinaryData.append("upload_preset", uploadPreset as string);

    try {
      const uploadRes = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: "POST",
        body: cloudinaryData,
      });
      const uploadJson = await uploadRes.json();
      imageUrl = uploadJson.secure_url; 
    } catch (error) {
      console.error("Image upload failed", error);
      alert("Failed to upload image. Please try again.");
      setLoading(false);
      return;
    }
    
    try {
      // --- 2. GET AI NUMBERS FROM PYTHON ---
      const aiResponse = await fetch("http://localhost:8000/extract-features", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image_url: imageUrl })
      });
      const aiData = await aiResponse.json();
      const features = aiData.features;

      // --- 3. SAVE TO FOUND_ITEMS (Your Code + Features!) ---
      const { error: insertError } = await supabase
        .from('found_items')
        .insert([
          {
            item_name: formData.get('itemName'),
            description: formData.get('description'),
            location_found: formData.get('location'),
            date_found: formData.get('date'),
            image_url: imageUrl,
            image_features: features // <-- Saving the AI numbers here!
          }
        ]);

      if (insertError) throw insertError;

      // --- 4. THE MAGIC: ASK SUPABASE FOR MATCHES ---
      const { data: matchData, error: matchError } = await supabase.rpc('match_lost_items', {
        query_embedding: features,
        match_threshold: 0.80, // <-- CHANGE THIS FROM 0.60 to 0.80 (or even 0.85!) currently at 80% or higher
        match_count: 3         
      });

      if (matchError) throw matchError;

      setMatches(matchData || []);
      setHasSearched(true);
      
      alert("Success! The found item has been logged and scanned for matches.");
      form.reset();

    } catch (error: any) {
      console.error("Error processing data:", error);
      alert("Something went wrong: " + error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="max-w-4xl mx-auto p-6 mt-10">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Report a Found Item</h1>
        <p className="text-gray-600 mb-6">
          Thank you for helping! Upload a clear photo so our AI can match it with lost reports.
        </p>

        {/* YOUR EXACT FORM CODE */}
        <form onSubmit={handleSubmit} className="space-y-6 flex flex-col">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Item Name</label>
            <input 
              type="text" 
              name="itemName"
              required
              placeholder="e.g., Black Leather Wallet" 
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description & Distinguishing Features</label>
            <textarea 
              rows={4}
              name="description"
              required
              placeholder="e.g., Found near the ticket booth. Has a blue keychain." 
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Location Found</label>
              <input 
                type="text" 
                name="location"
                required
                placeholder="e.g., LRT Line 1, Recto Station" 
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Date Found</label>
              <input 
                type="date" 
                name="date"
                required
                className="w-full border border-gray-300 rounded-lg p-3 text-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Upload Photo</label>
            <input 
              type="file" 
              name="image"
              accept="image/*"
              required
              className="w-full border border-gray-300 rounded-lg p-2 text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100 cursor-pointer"
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-green-600 text-white font-bold py-3 rounded-lg shadow-md hover:bg-green-700 transition mt-4 disabled:bg-green-300 cursor-pointer"
          >
            {loading ? "Scanning & Saving..." : "Submit Found Item Report"}
          </button>
        </form>
      </div>

      {/* --- AI MATCH RESULTS UI --- */}
      {hasSearched && (
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">AI Match Results</h2>
          
          {matches.length === 0 ? (
            <div className="bg-gray-50 p-6 rounded-lg text-center border border-gray-200">
              <p className="text-gray-600">No close matches found in the lost database right now. We've logged it in case the owner searches later!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {matches.map((match) => (
                <div key={match.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                  <img src={match.image_url} alt="Lost item match" className="w-full h-48 object-cover" />
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-lg text-gray-900">{match.item_name}</h3>
                      <span className="bg-green-100 text-green-800 text-xs font-bold px-2 py-1 rounded-full border border-green-200">
                        {Math.round(match.similarity * 100)}% Match
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm">{match.description}</p>
                    <a 
                      href={`mailto:demo-owner@example.com?subject=I found your ${match.item_name}!&body=Hi, I matched with your ${match.item_name} on the Lost Item Finder app. Let's coordinate how to get it back to you!`}
                      className="w-full mt-4 bg-blue-50 text-blue-600 font-semibold py-2 rounded-md hover:bg-blue-100 transition block text-center"
                    >
                      Contact Owner
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </main>
  );
}
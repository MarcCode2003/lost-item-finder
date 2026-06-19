"use client";

import { useState } from "react";
import { supabase } from "../../lib/supabase";

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
    setMatches([]);
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
      const aiResponse = await fetch("https://lost-item-finder-ch8j.onrender.com/extract-features", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image_url: imageUrl })
      });
      const aiData = await aiResponse.json();
      const features = aiData.features;

      const { error: insertError } = await supabase
        .from('found_items')
        .insert([
          {
            item_name: formData.get('itemName'),
            description: formData.get('description'),
            location_found: formData.get('location'),
            date_found: formData.get('date'),
            image_url: imageUrl,
            image_features: features
          }
        ]);

      if (insertError) throw insertError;

      const { data: matchData, error: matchError } = await supabase.rpc('match_lost_items', {
        query_embedding: features,
        match_threshold: 0.80,
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
      loading(false);
    }
  }

  return (
    <main className="flex min-h-screen flex-col bg-zinc-950 text-zinc-200 p-6 md:p-12">
      
      <div className="mb-8 md:mb-10">
        <h1 className="text-xl md:text-2xl font-bold text-white tracking-wide">Register Found Property</h1>
        <p className="text-xs text-zinc-400 mt-1">Ingest retrieved item coordinates into the central system to scan for active loss matches.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 w-full max-w-6xl items-start">
        
        <div className="lg:col-span-2 bg-zinc-900 border border-zinc-800 rounded-lg p-6 shadow-none">
          <form onSubmit={handleSubmit} className="space-y-5">
            
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-zinc-500 mb-1.5">Item Name</label>
              <input 
                type="text" 
                name="itemName"
                required
                placeholder="e.g., ThinkPad Carbon X1 Laptop" 
                className="w-full text-sm px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-700 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-zinc-500 mb-1.5">Description & Key Features</label>
              <textarea 
                rows={3}
                name="description"
                required
                placeholder="Document distinct tags, wear marks, or specific identifiers..." 
                className="w-full text-sm px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-700 transition-all resize-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-zinc-500 mb-1.5">Location Found</label>
                <input 
                  type="text" 
                  name="location"
                  required
                  placeholder="e.g., LRT Recto Station, Manila" 
                  className="w-full text-sm px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-700 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-zinc-500 mb-1.5">Date Found</label>
                <input 
                  type="date" 
                  name="date"
                  required
                  className="w-full text-sm px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded text-zinc-300 focus:outline-none focus:border-zinc-700 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-zinc-500 mb-1.5">Reference Image</label>
              <input 
                type="file" 
                name="image"
                accept="image/*"
                required
                className="w-full text-xs font-mono border border-zinc-800 rounded p-2 bg-zinc-950 text-zinc-400 file:mr-4 file:py-1 file:px-3 file:rounded file:border-0 file:text-[11px] file:font-mono file:bg-zinc-800 file:text-zinc-300 cursor-pointer"
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-zinc-100 hover:bg-white text-zinc-950 font-mono text-xs uppercase tracking-widest py-3 rounded transition-colors disabled:opacity-40 cursor-pointer shadow-sm"
            >
              {loading ? "Processing Submission..." : "Submit Report"}
            </button>
          </form>
        </div>

        <div className="lg:col-span-1 space-y-4">
          <div className="text-xs font-mono text-zinc-500 uppercase tracking-wider">
            Search Results
          </div>
          
          {!hasSearched ? (
            <div className="p-6 rounded-lg border border-zinc-800 bg-zinc-900/40 text-center text-xs font-mono text-zinc-600">
              Awaiting a report submission to show potential matches.
            </div>
          ) : matches.length === 0 ? (
            <div className="p-6 rounded-lg border border-zinc-800 bg-zinc-900/40 text-center text-xs font-mono text-zinc-400 leading-relaxed">
              No matching records found. The item has been logged for future searches.
            </div>
          ) : (
            <div className="space-y-4">
              {matches.map((match) => (
                <div key={match.id} className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden flex flex-col shadow-none">
                  <div className="h-32 bg-zinc-950 relative border-b border-zinc-800/60">
                    <img src={match.image_url} alt="Lost link match" className="w-full h-full object-cover" />
                    <span className="absolute top-2 right-2 bg-emerald-500/10 text-emerald-400 text-[10px] font-bold font-mono px-2 py-0.5 rounded border border-emerald-500/20">
                      {Math.round(match.similarity * 100)}% Match
                    </span>
                  </div>
                  <div className="p-4 flex flex-col justify-between flex-grow">
                    <div>
                      <h4 className="font-semibold text-xs text-white truncate">{match.item_name}</h4>
                      <p className="text-[11px] text-zinc-400 line-clamp-2 mt-1 leading-relaxed">{match.description}</p>
                    </div>
                    <a 
                      href={`mailto:owner-relay@node.local?subject=Platform Match Resolution: ${match.item_name}&body=System identified matching vectors for your missing asset reference ID: ${match.id}. Please verify metadata to settle coordinates.`}
                      className="w-full mt-3 block text-center bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-mono py-2 rounded transition-colors"
                    >
                      Contact Owner
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

    </main>
  );
}
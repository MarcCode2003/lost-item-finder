"use client";

import { useState } from "react";
import { supabase } from "../../lib/supabase";

export default function ReportLostItem() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const form = e.currentTarget;

    try {
      const formData = new FormData(e.currentTarget);
      const itemName = formData.get("itemName") as string;
      const description = formData.get("description") as string;
      const location = formData.get("location") as string;
      const date = formData.get("date") as string;
      const file = formData.get("image") as File;

      if (!file || file.size === 0) {
        alert("Please upload an image so the AI can scan it!");
        setIsSubmitting(false);
        return;
      }

      const cloudinaryData = new FormData();
      cloudinaryData.append("file", file);
      cloudinaryData.append("upload_preset", "lost_items_preset"); 
      
      const cloudRes = await fetch("https://api.cloudinary.com/v1_1/dnkxdaggs/image/upload", {
        method: "POST",
        body: cloudinaryData,
      });
      const cloudJson = await cloudRes.json();
      const imageUrl = cloudJson.secure_url;

      const aiResponse = await fetch("https://lost-item-finder-ch8j.onrender.com/extract-features", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image_url: imageUrl })
      });
      
      const aiData = await aiResponse.json();
      const features = aiData.features; 

      const { error } = await supabase
        .from('lost_items')
        .insert([
          {
            item_name: itemName,
            description: description,
            location_lost: location,
            date_lost: date,
            image_url: imageUrl,
            image_features: features 
          }
        ]);

      if (error) throw error;
      
      alert("Item reported successfully!");
      form.reset();

    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col bg-zinc-950 text-zinc-200 p-6 md:p-12">
      
      <div className="mb-8 md:mb-10">
        <h1 className="text-xl md:text-2xl font-bold text-white tracking-wide">Report Lost Item</h1>
        <p className="text-xs text-zinc-400 mt-1">
          Provide detailed metadata and an image reference to search across records.
        </p>
      </div>

      <div className="w-full max-w-2xl bg-zinc-900 border border-zinc-800 rounded-lg p-6 shadow-none">
        <form onSubmit={handleSubmit} className="space-y-5">
          
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-zinc-500 mb-1.5">Item Name</label>
            <input 
              type="text" 
              name="itemName"
              required
              placeholder="e.g., Black Leather Cardholder" 
              className="w-full text-sm px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-700 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-zinc-500 mb-1.5">Description & Key Features</label>
            <textarea 
              rows={4}
              name="description"
              required
              placeholder="Detail specific markings, color tones, or noticeable distinct qualities..." 
              className="w-full text-sm px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-700 transition-all resize-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-zinc-500 mb-1.5">Last Known Location</label>
              <input 
                type="text" 
                name="location"
                required
                placeholder="e.g., Shinjuku Station, Tokyo" 
                className="w-full text-sm px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-700 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-zinc-500 mb-1.5">Approximate Date Lost</label>
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
            disabled={isSubmitting}
            className="w-full bg-zinc-100 hover:bg-white text-zinc-950 font-mono text-xs uppercase tracking-widest py-3 rounded transition-colors disabled:opacity-40 cursor-pointer shadow-sm"
          >
            {isSubmitting ? "Processing Submission..." : "Submit Report"}
          </button>
        </form>
      </div>

    </main>
  );
}
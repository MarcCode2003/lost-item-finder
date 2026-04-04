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
      // --- 1. GRAB ALL THE DATA FROM THE FORM ---
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

      // --- 2. UPLOAD TO CLOUDINARY ---
      const cloudinaryData = new FormData();
      cloudinaryData.append("file", file);
      cloudinaryData.append("upload_preset", "lost_items_preset"); 
      
      const cloudRes = await fetch("https://api.cloudinary.com/v1_1/dnkxdaggs/image/upload", {
        method: "POST",
        body: cloudinaryData,
      });
      const cloudJson = await cloudRes.json();
      const imageUrl = cloudJson.secure_url;

      // --- 3. THE AI INTERCEPT: SEND TO PYTHON ---
      const aiResponse = await fetch("https://lost-item-finder-ch8j.onrender.com/extract-features", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image_url: imageUrl })
      });
      
      const aiData = await aiResponse.json();
      const features = aiData.features; 

      // --- 4. SAVE TO SUPABASE ---
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
      form.reset(); // This clears the form boxes after a success!

    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="max-w-2xl mx-auto p-6 mt-10 bg-white rounded-xl shadow-sm border border-gray-200">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Report a Lost Item</h1>
      <p className="text-gray-600 mb-8">
        Please provide as much detail as possible to help the AI match your item.
      </p>

      <form onSubmit={handleSubmit} className="space-y-6 flex flex-col">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Item Name</label>
          <input 
            type="text" 
            name="itemName"
            required
            placeholder="e.g., Black Leather Wallet" 
            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description & Distinguishing Features</label>
          <textarea 
            rows={4}
            name="description"
            required
            placeholder="e.g., It has a small scratch on the bottom right corner." 
            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Last Known Location</label>
            <input 
              type="text" 
              name="location"
              required
              placeholder="e.g., LRT Line 1, Recto Station" 
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Date Lost</label>
            <input 
              type="date" 
              name="date"
              required
              className="w-full border border-gray-300 rounded-lg p-3 text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            className="w-full border border-gray-300 rounded-lg p-2 text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
          />
        </div>

        <button 
          type="submit" 
          disabled={isSubmitting}
          className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg shadow-md hover:bg-blue-700 transition mt-4 disabled:bg-blue-300 disabled:cursor-not-allowed cursor-pointer"
        >
          {isSubmitting ? "Processing AI & Saving..." : "Submit Lost Item Report"}
        </button>
      </form>
    </main>
  );
}
"use client";

import { useState } from "react";
import { supabase } from "../../lib/supabase";

export default function ReportFoundItem() {
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);

    const form = event.currentTarget;
    const formData = new FormData(form);
    const imageFile = formData.get('image') as File;

    let imageUrl = null;

    if (imageFile && imageFile.size > 0) {
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
    }
    
    const { error } = await supabase
      .from('found_items')
      .insert([
        {
          item_name: formData.get('itemName'),
          description: formData.get('description'),
          location_found: formData.get('location'),
          date_found: formData.get('date'),
          image_url: imageUrl, 
        }
      ]);

    setLoading(false);

    if (error) {
      alert("Error saving data: " + error.message);
    } else {
      alert("Success! The found item (and photo) has been logged.");
      form.reset();
    }
  }

  return (
    <main className="max-w-2xl mx-auto p-6 mt-10 bg-white rounded-xl shadow-sm border border-gray-200">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Report a Found Item</h1>
      <p className="text-gray-600 mb-8">
        Thank you for helping! Upload a clear photo so our AI can match it with lost reports.
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
            placeholder="e.g., Found near the ticket booth. Has a blue keychain." 
            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Date Found</label>
            <input 
              type="date" 
              name="date"
              required
              className="w-full border border-gray-300 rounded-lg p-3 text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* IMAGE UPLOAD UNLOCKED */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Upload Photo</label>
          <input 
            type="file" 
            name="image"
            accept="image/*"
            className="w-full border border-gray-300 rounded-lg p-2 text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100 cursor-pointer"
          />
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="w-full bg-green-600 text-white font-bold py-3 rounded-lg shadow-md hover:bg-green-700 transition mt-4 disabled:bg-green-300 cursor-pointer"
        >
          {loading ? "Uploading & Saving..." : "Submit Found Item Report"}
        </button>
      </form>
    </main>
  );
}
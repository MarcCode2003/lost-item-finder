export default function ReportLostItem() {
  return (
    <main className="max-w-2xl mx-auto p-6 mt-10 bg-white rounded-xl shadow-sm border border-gray-200">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Report a Lost Item</h1>
      <p className="text-gray-600 mb-8">
        Please provide as much detail as possible to help the AI match your item.
      </p>

      <form className="space-y-6 flex flex-col">
        {/* Item Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Item Name</label>
          <input 
            type="text" 
            placeholder="e.g., Black Leather Wallet" 
            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description & Distinguishing Features</label>
          <textarea 
            rows={4}
            placeholder="e.g., It has a small scratch on the bottom right corner." 
            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex gap-4">
          {/* Location */}
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Last Known Location</label>
            <input 
              type="text" 
              placeholder="e.g., LRT Line 1, Recto Station" 
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Date */}
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Date Lost</label>
            <input 
              type="date" 
              className="w-full border border-gray-300 rounded-lg p-3 text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Image Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Upload Photo (Crucial for AI Matching)</label>
          <input 
            type="file" 
            accept="image/*"
            className="w-full border border-gray-300 rounded-lg p-2 text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
          />
        </div>

        {/* Submit Button */}
        <button 
          type="button" 
          className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg shadow-md hover:bg-blue-700 transition mt-4 cursor-pointer"
        >
          Submit Lost Item Report
        </button>
      </form>
    </main>
  );
}
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-50 text-gray-900 p-10">
      <h1 className="text-4xl font-bold text-blue-600 mb-4">
        Lost & Found Hub
      </h1>
      <p className="text-lg text-gray-600 mb-8 text-center max-w-md">
        A community platform to report, match, and return lost items.
      </p>
      
      <div className="flex gap-4">
        {/* Changed from <button> to <Link> */}
        <Link href="/lost" className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition">
          I Lost an Item
        </Link>
        <Link href="/found" className="px-6 py-3 bg-white text-blue-600 border border-blue-600 font-semibold rounded-lg shadow-sm hover:bg-gray-100 transition">
          I Found an Item
        </Link>
      </div>
    </main>
  );
}
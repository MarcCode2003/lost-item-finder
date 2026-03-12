import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="w-full bg-white shadow-sm border-b p-4">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold text-blue-600">
          🔍 Lost & Found Hub
        </Link>
        <div className="flex gap-6">
          <Link href="/lost" className="text-gray-600 hover:text-blue-600 font-medium transition">
            Report Lost
          </Link>
          <Link href="/found" className="text-gray-600 hover:text-blue-600 font-medium transition">
            Report Found
          </Link>
        </div>
      </div>
    </nav>
  );
}
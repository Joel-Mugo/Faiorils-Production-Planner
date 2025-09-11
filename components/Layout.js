import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { BarChart3, Truck, Plus } from 'lucide-react';

const Layout = ({ children }) => {
  const router = useRouter();

  const isActive = (path) => router.pathname === path;

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50"
      style={{ minWidth: '1200px' }}
    >
      {/* Header */}
      <header className="bg-white shadow-lg border-b-4 border-green-500">
        <div className="max-w-full px-8 py-4">
          <div className="flex items-center justify-between">
            {/* Logo Section */}
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-4">
                <img
                  src="/Fairoils.svg"
                  alt="Fairoils Logo"
                  className="w-16 h-16 object-contain shrink-0"
                />
                <img
                  src="/Kutoka.svg"
                  alt="Kutoka Logo"
                  className="w-16 h-16 object-contain shrink-0"
                />
              </div>

              {/* App Description */}
              <div className="border-l-4 border-green-500 pl-6">
                <h1 className="text-2xl font-bold text-gray-800">
                  Fairoils Manufacturing Intelligence Platform
                </h1>
                <p className="text-gray-600 text-sm">
                  A Comprehensive production planning, Capacity Management & PO tracking
                  system for optimized manufacturing operations
                </p>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex space-x-2">
              <Link
                href="/data-entry"
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  isActive('/data-entry')
                    ? 'bg-green-100 text-green-700 border-2 border-green-300'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Plus className="w-4 h-4" />
                <span>Data Entry</span>
              </Link>

              <Link
                href="/"
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  isActive('/')
                    ? 'bg-blue-100 text-blue-700 border-2 border-blue-300'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <BarChart3 className="w-4 h-4" />
                <span>Production Dashboard</span>
              </Link>

              <Link
                href="/po-tracking"
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  isActive('/po-tracking')
                    ? 'bg-purple-100 text-purple-700 border-2 border-purple-300'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Truck className="w-4 h-4" />
                <span>PO Tracking</span>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-8 py-6">{children}</main>
    </div>
  );
};

export default Layout;

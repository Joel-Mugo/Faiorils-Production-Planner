import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { BarChart3, Truck, Plus } from "lucide-react";

const Layout = ({ children }) => {
  const router = useRouter();

  const isActive = (path) => router.pathname === path;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-green-600 via-blue-600 to-purple-700 shadow-xl">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Logo + Title */}
          <div className="flex items-center space-x-6">
            {/* Logos */}
            <div className="flex items-center space-x-4">
              <img
                src="/Fairoils.svg"
                alt="Fairoils Logo"
                className="w-14 h-14 object-contain shrink-0 bg-white rounded-lg p-1 shadow-md"
              />
              <img
                src="/Kutoka.svg"
                alt="Kutoka Logo"
                className="w-14 h-14 object-contain shrink-0 bg-white rounded-lg p-1 shadow-md"
              />
            </div>

            {/* App Title */}
            <div className="pl-6 border-l-4 border-white/40">
              <h1 className="text-2xl font-bold text-white drop-shadow">
                Fairoils Manufacturing Intelligence
              </h1>
              <p className="text-sm text-white/80">
                Production Planning • Capacity Management • PO Tracking
              </p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex items-center space-x-3">
            <Link
              href="/data-entry"
              className={`flex items-center space-x-2 px-5 py-2.5 rounded-lg font-medium transition-all shadow-sm ${
                isActive("/data-entry")
                  ? "bg-white text-green-700 shadow-md"
                  : "text-white/90 hover:bg-white/10"
              }`}
            >
              <Plus className="w-4 h-4" />
              <span>Data Entry</span>
            </Link>

            <Link
              href="/"
              className={`flex items-center space-x-2 px-5 py-2.5 rounded-lg font-medium transition-all shadow-sm ${
                isActive("/")
                  ? "bg-white text-blue-700 shadow-md"
                  : "text-white/90 hover:bg-white/10"
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>Dashboard</span>
            </Link>

            <Link
              href="/po-tracking"
              className={`flex items-center space-x-2 px-5 py-2.5 rounded-lg font-medium transition-all shadow-sm ${
                isActive("/po-tracking")
                  ? "bg-white text-purple-700 shadow-md"
                  : "text-white/90 hover:bg-white/10"
              }`}
            >
              <Truck className="w-4 h-4" />
              <span>PO Tracking</span>
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto px-6 py-8 w-full">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-gray-100 border-t py-4 text-center text-sm text-gray-600">
        © {new Date().getFullYear()} Fairoils & Kutoka Ardhini — All rights reserved.
      </footer>
    </div>
  );
};

export default Layout;

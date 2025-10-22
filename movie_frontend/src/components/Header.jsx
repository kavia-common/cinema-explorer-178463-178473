import React from "react";

/**
 * PUBLIC_INTERFACE
 * Header component with brand title.
 * Renders a top navigation bar styled with the Royal Purple palette.
 */
export default function Header() {
  return (
    <header className="bg-primary text-white shadow-soft">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight">MovieAI</h1>
        <nav className="hidden sm:flex gap-4">
          <a href="#/" className="opacity-90 hover:opacity-100 transition">Home</a>
          <a href="#/search" className="opacity-90 hover:opacity-100 transition">Search</a>
          <a href="#/" className="opacity-90 hover:opacity-100 transition">Trending</a>
        </nav>
      </div>
    </header>
  );
}

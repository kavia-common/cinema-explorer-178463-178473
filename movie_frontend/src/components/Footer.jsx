import React from "react";

/**
 * PUBLIC_INTERFACE
 * Footer component with subtle styling.
 * Displays a small copyright notice.
 */
export default function Footer() {
  return (
    <footer className="border-t border-purple-100">
      <div className="max-w-6xl mx-auto px-4 py-6 text-secondary text-sm">
        <p>© {new Date().getFullYear()} MovieAI. All rights reserved.</p>
      </div>
    </footer>
  );
}

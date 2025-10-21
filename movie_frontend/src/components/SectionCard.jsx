import React from "react";

/**
 * PUBLIC_INTERFACE
 * SectionCard - reusable surface card with action button.
 * Props:
 * - title: string - card title
 * - description: string - small description
 * - actionText: string - text for the call-to-action button
 * - onAction: function - click handler for the button
 */
export default function SectionCard({ title, description, actionText = "Explore", onAction = () => {} }) {
  return (
    <div className="card-surface p-5">
      <h3 className="text-lg font-semibold text-text">{title}</h3>
      {description && <p className="mt-2 text-secondary text-sm">{description}</p>}
      <div className="mt-4">
        <button type="button" className="btn-primary" onClick={onAction}>
          {actionText}
        </button>
      </div>
    </div>
  );
}

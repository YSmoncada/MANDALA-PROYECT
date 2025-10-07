import React from "react";

export function Input({ className, ...props }) {
  return (
    <input
      {...props}
      className={`px-3 py-2 rounded-lg border border-gray-600 bg-purple-900 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 ${className}`}
    />
  );
}

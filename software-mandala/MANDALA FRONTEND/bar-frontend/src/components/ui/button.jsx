import React from "react";
import clsx from "clsx";

export function Button({ children, className, variant = "default", ...props }) {
  const base =
    "px-4 py-2 rounded-xl font-medium transition-colors focus:outline-none";
  const variants = {
    default: "bg-purple-700 hover:bg-purple-600 text-white",
    secondary: "bg-pink-600 hover:bg-pink-500 text-white",
    ghost: "bg-transparent hover:bg-purple-800 text-white",
  };

  return (
    <button className={clsx(base, variants[variant], className)} {...props}>
      {children}
    </button>
  );
}

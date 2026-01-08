import * as React from "react";

export function Button({
  className = "",
  variant = "default",
  ...props
}) {
  const base =
    "px-4 py-2 rounded-xl font-semibold transition-all";

  const variants = {
    default: "bg-indigo-600 text-white hover:bg-indigo-700",
    outline:
      "border border-indigo-600 text-indigo-600 hover:bg-indigo-50",
  };

  return (
    <button
      className={`${base} ${variants[variant]} ${className}`}
      {...props}
    />
  );
}

import React from "react";
import { Github, Chrome } from "lucide-react";

export default function OAuthButton({ provider = "google", onClick, children }) {
  const Icon = provider === "github" ? Github : Chrome;
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 px-3 py-2.5 text-sm text-gray-100 hover:bg-white/5 active:scale-[.99] transition"
    >
      <Icon className="w-4 h-4" /> {children}
    </button>
  );
}

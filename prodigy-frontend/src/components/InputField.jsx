import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle } from "lucide-react";
import { THEME } from "../config/theme";

export default function InputField({
  label,
  type = "text",
  icon: Icon,
  value,
  onChange,
  name,
  placeholder,
  error,
  autoComplete,
  inputRef,
  onKeyDown,
}) {
  return (
    <div className="space-y-1">
      <label htmlFor={name} className="text-sm text-gray-300">{label}</label>
      <div
        className={`flex items-center gap-2 rounded-2xl border px-3 py-2 transition-all focus-within:ring-4 ${
          error ? "border-red-400/60 ring-red-400/20" : "border-white/10"
        }`}
        style={{ background: THEME.inputBg, ["--accent-ring"]: THEME.accentRing }}
      >
        {Icon && <Icon className="w-4 h-4 opacity-70" aria-hidden="true" />}
        <input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          onKeyDown={onKeyDown}
          placeholder={placeholder}
          autoComplete={autoComplete}
          aria-invalid={!!error}
          aria-describedby={error ? `${name}-error` : undefined}
          ref={inputRef}
          className="w-full bg-transparent outline-none text-[15px] text-gray-100 placeholder-gray-400"
        />
      </div>

      <AnimatePresence>
        {error && (
          <motion.p
            id={`${name}-error`}
            className="text-xs text-red-300 flex items-center gap-1"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
          >
            <AlertTriangle className="w-3.5 h-3.5" /> {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

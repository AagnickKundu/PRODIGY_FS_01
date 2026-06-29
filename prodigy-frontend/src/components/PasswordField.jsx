import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Eye, EyeOff, AlertTriangle } from "lucide-react";
import { THEME } from "../config/theme";
import { passwordStrength } from "../utils/validators";

export default function PasswordField({
  label = "Password",
  name = "password",
  value,
  onChange,
  error,
  inputRef,
  onKeyDown,
}) {
  const [show, setShow] = useState(false);
  const strength = useMemo(() => passwordStrength(value || ""), [value]);
  const strengthLabel = ["Too short", "Weak", "Fair", "Good", "Strong", "Excellent"][strength];

  const strengthColor = strength >= 4 ? THEME.success : strength >= 2 ? "#f3b94b" : THEME.danger;

  return (
    <div className="space-y-1">
      <label htmlFor={name} className="text-sm text-gray-300">{label}</label>
      <div
        className={`flex items-center gap-2 rounded-2xl border px-3 py-2 transition-all focus-within:ring-4 ${
          error ? "border-red-400/60 ring-red-400/20" : "border-white/10"
        }`}
        style={{ background: THEME.inputBg, ["--accent-ring"]: THEME.accentRing }}
      >
        <Lock className="w-4 h-4 opacity-70" aria-hidden="true" />
        <input
          id={name}
          name={name}
          type={show ? "text" : "password"}
          value={value}
          onChange={onChange}
          onKeyDown={onKeyDown}
          placeholder="••••••••"
          autoComplete={name === "password" ? "current-password" : "new-password"}
          aria-invalid={!!error}
          aria-describedby={error ? `${name}-error` : `${name}-help`}
          ref={inputRef}
          className="w-full bg-transparent outline-none text-[15px] text-gray-100 placeholder-gray-400"
        />
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          className="p-1 rounded-md hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-white/20"
          aria-label={show ? "Hide password" : "Show password"}
        >
          {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>

      {/* Strength meter */}
      <div className="flex items-center justify-between">
        <div className="flex gap-1.5" aria-hidden="true">
          {[0, 1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className={`h-1.5 w-10 rounded-full ${i < Math.max(0, strength - 1) ? "" : "bg-white/10"}`}
              style={{
                background: i < Math.max(0, strength - 1) ? strengthColor : undefined,
              }}
            />
          ))}
        </div>
        <span id={`${name}-help`} className="text-xs text-gray-400">{strengthLabel}</span>
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

import React, { useMemo, useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

import { API_ENDPOINTS } from "../api/endpoints";
import { THEME } from "../config/theme";
import { emailRegex, hasUpper, hasLower, hasNumber, hasSpecial } from "../utils/validators";

import InputField from "../components/InputField";
import PasswordField from "../components/PasswordField";
import OAuthButton from "../components/OAuthButton";

export default function AuthPage() {
  const [mode, setMode] = useState("login");
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");
  const [serverSuccess, setServerSuccess] = useState("");

  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "", remember: true });
  const [errors, setErrors] = useState({});
  const firstRef = useRef(null);

  useEffect(() => {
    setServerError("");
    setServerSuccess("");
    setErrors({});
    requestAnimationFrame(() => firstRef.current?.focus?.());
  }, [mode]);

  const validate = () => {
    const e = {};
    if (mode === "signup" && !form.name.trim()) e.name = "Please enter your full name.";
    if (!form.email.trim()) e.email = "Email is required.";
    else if (!emailRegex.test(form.email)) e.email = "Enter a valid email address.";

    if (!form.password) e.password = "Password is required.";
    else {
      if (form.password.length < 8) e.password = "Minimum 8 characters required.";
      else if (!(hasUpper(form.password) && hasLower(form.password))) e.password = "Use both upper & lower case.";
      else if (!hasNumber(form.password)) e.password = "Add a number.";
      else if (!hasSpecial(form.password)) e.password = "Add a special character.";
    }

    if (mode === "signup" && form.confirm !== form.password) e.confirm = "Passwords do not match.";

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
    if (errors[name]) setErrors((prev) => { const next = { ...prev }; delete next[name]; return next; });
  };

  const handleSubmit = async (e) => {
    if (e?.preventDefault) e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setServerError("");
    setServerSuccess("");

    const endpoint = mode === "login" ? API_ENDPOINTS.login : API_ENDPOINTS.signup;
    const payload = mode === "login"
      ? { email: form.email, password: form.password, remember: form.remember }
      : { name: form.name, email: form.email, password: form.password };

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        credentials: "include",
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.message || `Request failed (${res.status})`);
      }

      const data = await res.json().catch(() => ({}));
      setServerSuccess(data?.message || (mode === "login" ? "Logged in successfully." : "Account created successfully."));
      // TODO: redirect to dashboard here
    } catch (err) {
      setServerError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => { if (e.key === "Enter") handleSubmit(e); };

  const gradientStyle = { background: `radial-gradient(1200px 600px at 0% 0%, ${THEME.bgEnd} 0%, transparent 60%), radial-gradient(1200px 600px at 100% 100%, ${THEME.accent} 0%, transparent 60%), linear-gradient(120deg, ${THEME.bgStart}, ${THEME.bgEnd})` };

  const cardVariants = { initial: { opacity: 0, y: 20, scale: 0.98 }, animate: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }, exit: { opacity: 0, y: -10, scale: 0.98, transition: { duration: 0.25 } } };
  const switchVariants = { initial: { y: 10, opacity: 0 }, animate: { y: 0, opacity: 1, transition: { delay: 0.05 } }, exit: { y: -10, opacity: 0 } };

  return (
    <div className="min-h-screen w-full flex items-center justify-center" style={gradientStyle}>
      <motion.div className="absolute -top-16 -left-16 w-80 h-80 rounded-full blur-3xl" style={{ background: THEME.accent, opacity: 0.18 }} animate={{ x: [0, 10, -10, 0], y: [0, -10, 10, 0] }} transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }} />
      <motion.div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full blur-3xl" style={{ background: THEME.bgEnd, opacity: 0.25 }} animate={{ x: [0, -10, 10, 0], y: [0, 12, -12, 0] }} transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }} />

      <motion.div variants={cardVariants} initial="initial" animate="animate" exit="exit" className={`relative z-10 mx-4 w-full max-w-[850px] scale-90 origin-center ${mode === "signup" ? "-mt-5" : ""}`}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left marketing panel */}
          <motion.div className="hidden md:flex flex-col justify-between rounded-3xl p-8 border backdrop-blur-xl" style={{ background: THEME.glass, borderColor: THEME.border }} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0, transition: { delay: 0.2 } }}>
            <div className="space-y-4">
              <motion.h1 className="text-3xl font-semibold tracking-tight" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0, transition: { delay: 0.3 } }} style={{ color: THEME.text }}>
                Welcome
              </motion.h1>
              <p className="text-gray-300/90">A clean authentication experience with animations and accessibility in mind.</p>
            </div>

            <div className="mt-6">
              <ul className="space-y-3 text-gray-300/90">
                {["Secure sessions", "Real-time validation", "Smooth micro-interactions"].map((t,i)=>(
                  <motion.li key={i} className="flex items-start gap-2" initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0, transition: { delay: 0.35 + i*0.05 } }}>
                    <CheckCircle2 className="w-4 h-4 mt-0.5" style={{ color: THEME.accent }} /> {t}
                  </motion.li>
                ))}
              </ul>
            </div>

            <div className="mt-8 text-xs text-gray-400">Pro tip: Press <span className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10">Enter</span> to submit.</div>
          </motion.div>

          {/* Right: form card */}
          <div className="rounded-3xl p-6 md:p-8 border backdrop-blur-xl" style={{ background: THEME.glass, borderColor: THEME.border }}>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-semibold text-gray-100">{mode === "login" ? "Log in" : "Create account"}</h2>
                <p className="text-sm text-gray-400">{mode === "login" ? "Welcome back!" : "Join us in a few seconds."}</p>
              </div>

              <div className="relative inline-flex rounded-full p-1 bg-white/5 border border-white/10">
                <button onClick={()=>setMode("login")} className={`px-3 py-1.5 text-sm rounded-full transition ${mode==="login" ? "bg-[color:var(--accent)] text-white" : "text-gray-300"}`} style={{ ["--accent"]: THEME.accent }}>Login</button>
                <button onClick={()=>setMode("signup")} className={`px-3 py-1.5 text-sm rounded-full transition ${mode==="signup" ? "bg-[color:var(--accent)] text-white" : "text-gray-300"}`} style={{ ["--accent"]: THEME.accent }}>Sign up</button>
              </div>
            </div>

            <AnimatePresence>
              {serverError && <motion.div className="mb-4 rounded-xl border border-red-400/30 bg-red-500/10 px-3 py-2 text-sm text-red-200" initial={{ opacity:0,y:-8 }} animate={{ opacity:1,y:0 }} exit={{ opacity:0,y:-8 }}>{serverError}</motion.div>}
              {serverSuccess && <motion.div className="mb-4 rounded-xl border border-emerald-400/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-200" initial={{ opacity:0,y:-8 }} animate={{ opacity:1,y:0 }} exit={{ opacity:0,y:-8 }}>{serverSuccess}</motion.div>}
            </AnimatePresence>

            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              <AnimatePresence mode="wait">
                {mode === "signup" ? (
                  <motion.div key="signup" variants={switchVariants} initial="initial" animate="animate" exit="exit" className="space-y-4">
                    <InputField label="Full name" name="name" placeholder="Your full name" value={form.name} onChange={handleChange} icon={undefined} error={errors.name} autoComplete="name" inputRef={firstRef} onKeyDown={handleKeyDown} />
                    <InputField label="Email" name="email" type="email" placeholder="you@example.com" value={form.email} onChange={handleChange} icon={undefined} error={errors.email} autoComplete="email" onKeyDown={handleKeyDown} />
                    <PasswordField name="password" value={form.password} onChange={handleChange} error={errors.password} onKeyDown={handleKeyDown} />
                    <PasswordField label="Confirm password" name="confirm" value={form.confirm} onChange={handleChange} error={errors.confirm} onKeyDown={handleKeyDown} />
                  </motion.div>
                ) : (
                  <motion.div key="login" variants={switchVariants} initial="initial" animate="animate" exit="exit" className="space-y-4">
                    <InputField label="Email" name="email" type="email" placeholder="you@example.com" value={form.email} onChange={handleChange} icon={undefined} error={errors.email} autoComplete="email" inputRef={firstRef} onKeyDown={handleKeyDown} />
                    <PasswordField name="password" value={form.password} onChange={handleChange} error={errors.password} onKeyDown={handleKeyDown} />

                    <div className="flex items-center justify-between">
                      <label className="flex items-center gap-2 text-sm text-gray-300">
                        <input type="checkbox" name="remember" checked={form.remember} onChange={handleChange} className="accent-[color:var(--accent)]" style={{ ["--accent"]: THEME.accent }} />
                        Remember me
                      </label>
                      <button type="button" className="text-sm text-gray-300 hover:text-white/90">Forgot password?</button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <button type="submit" disabled={loading} className="w-full rounded-2xl px-4 py-2.5 font-medium text-white shadow-lg shadow-black/30 focus:outline-none focus:ring-4 active:scale-[.99] transition disabled:opacity-60" style={{ background: THEME.accent, boxShadow: "0 10px 28px rgba(0,0,0,.35)" }} aria-busy={loading}>
                {loading ? "Please wait…" : mode === "login" ? "Log in" : "Create account"}
              </button>

              <div className="flex items-center gap-3 text-sm text-gray-400">
                <div className="h-px flex-1 bg-white/10" /> or continue with <div className="h-px flex-1 bg-white/10" />
              </div>

              <div className="flex gap-3">
                <OAuthButton provider="google" onClick={() => (window.location.href = API_ENDPOINTS.oauth.google)}>Google</OAuthButton>
                <OAuthButton provider="github" onClick={() => (window.location.href = API_ENDPOINTS.oauth.github)}>GitHub</OAuthButton>
              </div>

              <p className="text-xs text-gray-400 text-center pt-2">By continuing, you agree to our <a className="underline hover:text-gray-200" href="#">Terms</a> & <a className="underline hover:text-gray-200" href="#">Privacy</a>.</p>
            </form>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

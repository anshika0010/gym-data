"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";

// ── Popup Component ──────────────────────────────────────
function Popup({ type, message, onClose }) {
  if (!message) return null;

  const isSuccess = type === "success";

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl text-center animate-in">

        {/* Icon */}
        <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${isSuccess ? "bg-green-100" : "bg-red-100"}`}>
          {isSuccess ? (
            <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg className="w-8 h-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          )}
        </div>

        <h3 className={`text-lg font-bold mb-1 ${isSuccess ? "text-green-700" : "text-red-700"}`}>
          {isSuccess ? "Login Successful!" : "Login Failed"}
        </h3>

        <p className="text-gray-500 text-sm mb-6 leading-relaxed">{message}</p>

        <button
          onClick={onClose}
          className={`w-full py-3.5 rounded-2xl text-white font-semibold text-sm transition-all active:scale-95 ${
            isSuccess ? "bg-green-600 hover:bg-green-700" : "bg-red-500 hover:bg-red-600"
          }`}
        >
          {isSuccess ? "Continue" : "Try Again"}
        </button>
      </div>
    </div>
  );
}

// ── Main Page ────────────────────────────────────────────
export default function SignInPage() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [popup, setPopup] = useState({ show: false, type: "", message: "" });

  const showPopup = (type, message) => setPopup({ show: true, type, message });

  const handlePopupClose = () => {
    if (popup.type === "success") router.push("/");
    setPopup({ show: false, type: "", message: "" });
  };

  const handleLogin = async () => {
    if (!email || !password) {
      showPopup("error", "Please enter your email and password.");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(
        "https://gym.earthmaafoods.com/api/v1/login",
        { email, password }
      );
      localStorage.setItem("token", response.data.access_token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      showPopup("success", "Welcome back! You are now logged in.");
    } catch (error) {
      showPopup("error", error?.response?.data?.message || "Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {popup.show && (
        <Popup type={popup.type} message={popup.message} onClose={handlePopupClose} />
      )}

      <main className="min-h-screen min-h-dvh bg-gray-100 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-[420px] bg-white rounded-[28px] overflow-hidden shadow-md border border-gray-200">

          {/* Header */}
          <div className="bg-gradient-to-br from-gray-900 to-gray-600 px-6 pt-12 pb-10 text-center">
            {/* Logo / Icon */}
            <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-5 border border-white/20">
              <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
              </svg>
            </div>

            <h1 className="text-white text-2xl font-bold mb-1">Welcome back</h1>
            <p className="text-white/60 text-sm">Sign in to your account</p>
          </div>

          {/* Form */}
          <div className="px-6 pt-7 pb-8">

            {/* Email */}
            <div className="mb-4">
              <label htmlFor="email" className="block text-[11px] font-bold text-gray-700 mb-2 tracking-widest uppercase">
                Email
              </label>
              <div className="flex items-center border-2 border-gray-200 rounded-xl px-4 h-13 bg-gray-50 gap-3 focus-within:border-gray-800 transition-colors">
                <svg className="w-5 h-5 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                </svg>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                  className="bg-transparent text-sm text-gray-900 outline-none flex-1 h-full py-3"
                  placeholder="Enter your email"
                  autoComplete="email"
                  inputMode="email"
                />
              </div>
            </div>

            {/* Password */}
            <div className="mb-7">
              <label htmlFor="password" className="block text-[11px] font-bold text-gray-700 mb-2 tracking-widest uppercase">
                Password
              </label>
              <div className="flex items-center border-2 border-gray-200 rounded-xl  px-2 h-13 bg-gray-50 gap-3 focus-within:border-gray-800 transition-colors">
                <svg className="w-5 h-5 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                </svg>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                  className="bg-transparent text-sm text-gray-900 outline-none flex-1 h-full py-3"
                  placeholder="Enter your password"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-gray-400 hover:text-gray-700 transition-colors p-1 -mr-1"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Login Button */}
            <button
              type="button"
              onClick={handleLogin}
              disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-gray-900 to-gray-700 text-white text-base font-semibold rounded-2xl hover:opacity-90 transition-all disabled:opacity-50 flex items-center justify-center gap-2 active:scale-[0.98]"
            >
              {loading && (
                <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z" />
                </svg>
              )}
              {loading ? "Logging In..." : "Login"}
            </button>

            {/* Bottom handle */}
            <div className="mt-8 flex justify-center">
              <div className="w-10 h-1 bg-gray-200 rounded-full" />
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
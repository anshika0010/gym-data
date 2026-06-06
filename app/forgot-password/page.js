"use client";

import { useState } from "react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(false);

  function handleSubmit() {
    if (!email.trim()) {
      setError(true);
      return;
    }
    setError(false);
    setSubmitted(true);
  }

  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-[380px] bg-white rounded-[32px] overflow-hidden border border-gray-200 shadow-sm">

        {/* Header */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-600 px-8 pt-12 pb-9 text-center">
          <Link
            href="/sign-in"
            className="inline-flex items-center gap-1.5 text-white/75 text-sm mb-6 hover:text-white transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Back to login
          </Link>

          <div className="w-[68px] h-[68px] rounded-[20px] bg-white/20 flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5V6.75a4.5 4.5 0 119 0v3.75M3.75 21.75h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H3.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
            </svg>
          </div>

          <h1 className="text-white text-2xl font-medium mb-1.5">Forgot password?</h1>
          <p className="text-white/70 text-sm leading-relaxed">
            No worries! Enter your email and<br />we'll send you a reset link.
          </p>
        </div>

        {/* Form */}
        <div className="px-7 pt-8 pb-4">

          {/* Email Field */}
          <div className="mb-6">
            <label htmlFor="email" className="block text-[11px] font-semibold text-gray-800 mb-2 tracking-widest uppercase">
              Email address
            </label>
            <div className={`flex items-center border-2 rounded-xl px-4 h-12 bg-gray-50 gap-3 transition-colors focus-within:border-gray-500 ${error ? "border-red-400" : "border-gray-200"}`}>
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-gray-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.3₂ 8.91a２.２５ ２.２５ ０ ０１－１．０７－１．９１６V６．７５" />
              </svg>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(false); }}
                placeholder="you@example.com"
                className="border-none bg-transparent text-sm text-gray-900 outline-none flex-1 placeholder:text-gray-300"
              />
            </div>
            {error && (
              <p className="text-red-500 text-xs mt-1.5 ml-1">Please enter a valid email address.</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="button"
            onClick={handleSubmit}
            className="w-full py-3.5 bg-gradient-to-r from-gray-800 to-gray-600 text-white text-base font-medium rounded-2xl hover:opacity-90 active:scale-[0.98] transition-all"
          >
            Send reset link
          </button>

          {/* Success Message */}
          {submitted && (
            <div className="flex gap-3 items-start bg-gray-100 border-2 border-gray-400 rounded-xl p-4 mt-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-gray-700 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-xs text-gray-900 font-medium leading-relaxed">
                Reset link sent! Check your inbox (and spam folder).
              </p>
            </div>
          )}

          {/* Info Note */}
          {!submitted && (
            <div className="flex gap-3 items-start bg-gray-50 border-2 border-gray-200 rounded-xl p-4 mt-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-gray-600 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
              </svg>
              <p className="text-xs text-gray-800 leading-relaxed">
                Check your spam folder if you don't see the email within a few minutes.
              </p>
            </div>
          )}

          {/* Divider */}
          <div className="flex items-center gap-3 mt-6">
            <div className="flex-1 h-px bg-gray-100" />
            <span className="text-xs text-gray-400">OR</span>
            <div className="flex-1 h-px bg-gray-100" />
          </div>

          {/* Back to Sign In */}
          <p className="text-center text-sm text-gray-400 mt-4 mb-2">
            Remember your password?{" "}
            <Link href="/sign-in" className="text-gray-800 font-medium hover:underline ml-1">
              Sign in
            </Link>
          </p>
        </div>

        {/* Bottom bar */}
        <div className="px-7 pb-7 pt-3 text-center">
          <div className="h-px bg-gray-50 mb-4" />
          <div className="w-10 h-[5px] bg-gray-200 rounded-full mx-auto" />
        </div>

      </div>
    </main>
  );
}
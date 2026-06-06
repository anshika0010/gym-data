"use client";

import { useState } from "react";
import Link from "next/link";

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  }

  function validate() {
    const newErrors = {};
    if (!form.firstName.trim()) newErrors.firstName = "Required";
    if (!form.lastName.trim()) newErrors.lastName = "Required";
    if (!form.username.trim()) newErrors.username = "Required";
    if (!form.email.trim()) newErrors.email = "Required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = "Invalid email";
    if (!form.password) newErrors.password = "Required";
    else if (form.password.length < 8) newErrors.password = "Min 8 characters";
    if (!form.confirmPassword) newErrors.confirmPassword = "Required";
    else if (form.password !== form.confirmPassword) newErrors.confirmPassword = "Passwords don't match";
    if (!agreed) newErrors.agreed = "You must agree to the terms";
    return newErrors;
  }

  function handleSubmit() {
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <main className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="w-full max-w-[380px] bg-white rounded-[32px] overflow-hidden border border-gray-200 shadow-sm">
          <div className="bg-gradient-to-br from-gray-800 to-gray-600 px-8 pt-12 pb-9 text-center">
            <div className="w-[68px] h-[68px] rounded-[20px] bg-white/20 flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h1 className="text-white text-2xl font-medium mb-1.5">Account created!</h1>
            <p className="text-white/70 text-sm leading-relaxed">Welcome aboard, {form.firstName}!</p>
          </div>
          <div className="px-7 py-8 text-center">
            <p className="text-sm text-gray-400 mb-5">Your account has been successfully created. You can now sign in.</p>
            <Link href="/sign-in" className="block w-full py-3.5 bg-gradient-to-r from-gray-800 to-gray-600 text-white text-base font-medium rounded-2xl hover:opacity-90 transition-all text-center">
              Go to Sign In
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-[380px] bg-white rounded-[32px] overflow-hidden border border-gray-200 shadow-sm">

        {/* Header */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-600 px-8 pt-10 pb-8 text-center">
          <div className="w-[64px] h-[64px] rounded-[18px] bg-white/20 flex items-center justify-center mx-auto mb-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z" />
            </svg>
          </div>
          <h1 className="text-white text-2xl font-medium mb-1">Create account</h1>
          <p className="text-white/70 text-sm">Join us today, it's free!</p>
        </div>

        {/* Form */}
        <div className="px-7 pt-6 pb-4">

          {/* First & Last Name */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div>
              <label className="block text-[10px] font-semibold text-gray-800 mb-1.5 tracking-widest uppercase">First name</label>
              <div className={`flex items-center border-2 rounded-xl px-3 h-11 bg-gray-50 gap-2 transition-colors focus-within:border-gray-500 ${errors.firstName ? "border-red-400" : "border-gray-200"}`}>
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-gray-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.125a7.5 7.5 0 0114.998 0" />
                </svg>
                <input name="firstName" type="text" value={form.firstName} onChange={handleChange} placeholder="John"
                  className="border-none bg-transparent text-xs text-gray-900 outline-none flex-1 min-w-0 placeholder:text-gray-300" />
              </div>
              {errors.firstName && <p className="text-red-500 text-[10px] mt-1">{errors.firstName}</p>}
            </div>
            <div>
              <label className="block text-[10px] font-semibold text-gray-800 mb-1.5 tracking-widest uppercase">Last name</label>
              <div className={`flex items-center border-2 rounded-xl px-3 h-11 bg-gray-50 gap-2 transition-colors focus-within:border-gray-500 ${errors.lastName ? "border-red-400" : "border-gray-200"}`}>
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-gray-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.125a7.5 7.5 0 0114.998 0" />
                </svg>
                <input name="lastName" type="text" value={form.lastName} onChange={handleChange} placeholder="Doe"
                  className="border-none bg-transparent text-xs text-gray-900 outline-none flex-1 min-w-0 placeholder:text-gray-300" />
              </div>
              {errors.lastName && <p className="text-red-500 text-[10px] mt-1">{errors.lastName}</p>}
            </div>
          </div>

          {/* Username */}
          <div className="mb-4">
            <label className="block text-[10px] font-semibold text-gray-800 mb-1.5 tracking-widest uppercase">Username</label>
            <div className={`flex items-center border-2 rounded-xl px-3 h-11 bg-gray-50 gap-2.5 transition-colors focus-within:border-gray-500 ${errors.username ? "border-red-400" : "border-gray-200"}`}>
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-gray-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zm0 0c0 1.657 1.007 3 2.25 3S21 13.657 21 12a9 9 0 10-2.636 6.364M16.5 12V8.25" />
              </svg>
              <input name="username" type="text" value={form.username} onChange={handleChange} placeholder="johndoe"
                className="border-none bg-transparent text-sm text-gray-900 outline-none flex-1 placeholder:text-gray-300" />
            </div>
            {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username}</p>}
          </div>

          {/* Email */}
          <div className="mb-4">
            <label className="block text-[10px] font-semibold text-gray-800 mb-1.5 tracking-widest uppercase">Email address</label>
            <div className={`flex items-center border-2 rounded-xl px-3 h-11 bg-gray-50 gap-2.5 transition-colors focus-within:border-gray-500 ${errors.email ? "border-red-400" : "border-gray-200"}`}>
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-gray-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.3₂ 8.91a２．２５ ２．２５ ０ ０１－１．０７－１．９１６Ｖ６．７５" />
              </svg>
              <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="you@example.com"
                className="border-none bg-transparent text-sm text-gray-900 outline-none flex-1 placeholder:text-gray-300" />
            </div>
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          </div>

          {/* Password */}
          <div className="mb-4">
            <label className="block text-[10px] font-semibold text-gray-800 mb-1.5 tracking-widest uppercase">Password</label>
            <div className={`flex items-center border-2 rounded-xl px-3 h-11 bg-gray-50 gap-2.5 transition-colors focus-within:border-gray-500 ${errors.password ? "border-red-400" : "border-gray-200"}`}>
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-gray-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
              </svg>
              <input name="password" type={showPassword ? "text" : "password"} value={form.password} onChange={handleChange} placeholder="Min 8 characters"
                className="border-none bg-transparent text-sm text-green-900 outline-none flex-1 placeholder:text-green-300" />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-green-600 hover:text-green-800 transition-colors">
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                )}
              </button>
            </div>
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
          </div>

          {/* Confirm Password */}
          <div className="mb-5">
            <label className="block text-[10px] font-semibold text-gray-800 mb-1.5 tracking-widest uppercase">Confirm password</label>
            <div className={`flex items-center border-2 rounded-xl px-3 h-11 bg-gray-50 gap-2.5 transition-colors focus-within:border-gray-500 ${errors.confirmPassword ? "border-red-400" : "border-gray-200"}`}>
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-gray-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
              </svg>
              <input name="confirmPassword" type={showConfirm ? "text" : "password"} value={form.confirmPassword} onChange={handleChange} placeholder="Repeat password"
                className="border-none bg-transparent text-sm text-gray-900 outline-none flex-1 placeholder:text-gray-300" />
              <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="text-gray-600 hover:text-gray-800 transition-colors">
                {showConfirm ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 １．９５３－．１３８ ２．８６３－．３９５Ｍ６．２２８６．２２８Ａ１０．４５１０．４５００１１２４．５ｃ４．７５６０８．７７３３．１６２１０．０６５７．４９８ａ１０．５２３１０．５２３００１－４．２９３５．７７４Ｍ６．２２８６．２２８Ｌ３３ｍ３．２２８３．２２８ｌ３．６５３．６５ｍ７．８９４７．８９４Ｌ２１２１ｍ－３．２２８－３．２２８ｌ－３．６５－３．６５ｍ００ａ３３０１０－４．２４３－４．２４３ｍ４．２４２４．２４２Ｌ９．８８９．８８" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                )}
              </button>
            </div>
            {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
          </div>

          {/* Terms Checkbox */}
          <div className="mb-5">
            <div className="flex items-start gap-2.5">
              <input
                id="terms"
                type="checkbox"
                checked={agreed}
                onChange={(e) => { setAgreed(e.target.checked); setErrors({ ...errors, agreed: "" }); }}
                className="mt-0.5 w-4 h-4 accent-gray-700 cursor-pointer shrink-0"
              />
              <label htmlFor="terms" className="text-xs text-gray-700 leading-relaxed cursor-pointer">
                I agree to the{" "}
                <Link href="/terms" className="text-gray-800 font-semibold underline hover:no-underline">Terms of Service</Link>
                {" "}and{" "}
                <Link href="/privacy" className="text-gray-800 font-semibold underline hover:no-underline">Privacy Policy</Link>
              </label>
            </div>
            {errors.agreed && <p className="text-red-500 text-xs mt-1 ml-6">{errors.agreed}</p>}
          </div>

          {/* Submit Button */}
          <button
            type="button"
            onClick={handleSubmit}
            className="w-full py-3.5 bg-gradient-to-r from-gray-800 to-gray-600 text-white text-base font-medium rounded-2xl hover:opacity-90 active:scale-[0.98] transition-all"
          >
            Create account
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3 mt-5">
            <div className="flex-1 h-px bg-green-100" />
            <span className="text-xs text-gray-400">OR</span>
            <div className="flex-1 h-px bg-green-100" />
          </div>

          {/* Social Buttons */}
          <div className="flex gap-3 mt-4">
            <button type="button" className="flex-1 h-11 bg-green-50 border-2 border-green-200 rounded-xl flex items-center justify-center gap-2 text-xs text-green-800 font-medium hover:bg-green-100 active:scale-[0.98] transition-all">
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Google
            </button>
            <button type="button" className="flex-1 h-11 bg-green-50 border-2 border-green-200 rounded-xl flex items-center justify-center gap-2 text-xs text-green-800 font-medium hover:bg-green-100 active:scale-[0.98] transition-all">
              <svg className="w-4 h-4 text-green-800" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701z" />
              </svg>
              Apple
            </button>
          </div>

          {/* Sign In Link */}
          <p className="text-center text-sm text-gray-400 mt-5 mb-2">
            Already have an account?{" "}
            <Link href="/sign-in" className="text-green-800 font-semibold hover:underline ml-1">
              Sign in
            </Link>
          </p>
        </div>

        {/* Bottom bar */}
        <div className="px-7 pb-7 pt-3 text-center">
          <div className="h-px bg-green-50 mb-4" />
          <div className="w-10 h-[5px] bg-green-200 rounded-full mx-auto" />
        </div>

      </div>
    </main>
  );
}
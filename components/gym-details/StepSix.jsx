"use client";

import { useState } from "react";
import StepHeader from "./StepHeader";

// ── Preset supplement options ─────────────────────────────────────────────────
const PRESET_SUPPLEMENTS = [
  "Whey Protein",
  "Mass Gainer",
  "Creatine",
  "Pre-workout",
  "BCAA / EAA",
  "Multivitamins",
  "Fish Oil / Omega-3",
  "Fat Burner",
  "Casein Protein",
  "Glutamine",
  "Weight Loss Shake",
  "Plant Protein",
  "Collagen",
  "Testosterone Booster",
];

// ── Currency options ──────────────────────────────────────────────────────────
const CURRENCIES = [
  { code: "INR", symbol: "₹", label: "₹ INR" },
  { code: "NPR", symbol: "₹", label: "₹ NPR" },
  { code: "AED", symbol: "د.إ", label: "د.إ AED" },
  { code: "USD", symbol: "$", label: "$ USD" },
];

// ── User count bands ──────────────────────────────────────────────────────────
const USER_BANDS = ["1 – 50", "50 – 100", "100 – 200", "200+"];

// ── Non-supplement user count bands ──────────────────────────────────────────
const NON_USER_BANDS = ["1 – 50", "50 – 100", "100 – 200", "200+"];

export default function StepSix({ data, setData, onBack, onSubmit, loading }) {
  const [customInput, setCustomInput] = useState("");
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // ── Helpers ──────────────────────────────────────────────────────────────────
  const update = (field, value) => {
    setData((prev) => ({ ...prev, [field]: value }));
    setTouched((prev) => ({ ...prev, [field]: true }));
    validateField(field, value);
  };

  const validateField = (field, value) => {
    let error = "";
    if (field === "supplementUserCount" && !value)
      error = "Please select how many members use supplements";
    if (field === "supplementTypes" && (!value || value.length === 0))
      error = "Select at least one supplement type";
    if (field === "budgetAmount" && value && isNaN(Number(value)))
      error = "Enter a valid number";
    setErrors((prev) => ({ ...prev, [field]: error }));
  };

  // ── Toggle supplement chip ────────────────────────────────────────────────
  const toggleSupplement = (name) => {
    const current = data.supplementTypes || [];
    const updated = current.includes(name)
      ? current.filter((s) => s !== name)
      : [...current, name];
    update("supplementTypes", updated);
  };

  // ── Add custom supplement ─────────────────────────────────────────────────
  const addCustom = () => {
    const trimmed = customInput.trim();
    if (!trimmed) return;
    const current = data.supplementTypes || [];
    if (!current.includes(trimmed)) {
      update("supplementTypes", [...current, trimmed]);
    }
    setCustomInput("");
  };

  // ── Remove a selected supplement ─────────────────────────────────────────
  const removeSupplement = (name) => {
    const updated = (data.supplementTypes || []).filter((s) => s !== name);
    update("supplementTypes", updated);
  };

  // ── Validate all on submit ────────────────────────────────────────────────
  const handleSubmit = () => {
    const newErrors = {};
    const newTouched = {};

    if (!data.supplementUserCount) {
      newErrors.supplementUserCount =
        "Please select how many members use supplements";
    }
    if (!data.supplementTypes || data.supplementTypes.length === 0) {
      newErrors.supplementTypes = "Select at least one supplement type";
    }

    newTouched.supplementUserCount = true;
    newTouched.supplementTypes = true;
    newTouched.budgetAmount = true;

    setErrors(newErrors);
    setTouched(newTouched);

    if (Object.keys(newErrors).length === 0) onSubmit();
  };

  // ── Input border helper ───────────────────────────────────────────────────
  const inputClass = (field) =>
    `w-full border-2 text-gray-900 rounded-xl px-3 h-12 bg-gray-50 outline-none transition-colors ${
      touched[field] && errors[field]
        ? "border-red-500 bg-red-50"
        : touched[field] && !errors[field]
        ? "border-green-500"
        : "border-gray-600"
    }`;

  const ErrorMsg = ({ field }) =>
    touched[field] && errors[field] ? (
      <p className="text-red-500 text-xs mt-1 ml-1">{errors[field]}</p>
    ) : null;

  const selectedTypes = data.supplementTypes || [];

  return (
    <div className="min-h-screen max-w-md mx-auto bg-gray-50 rounded-[32px] flex flex-col">
      <StepHeader step={6} title="Supplement Insights" />

      <div className="flex-1 px-5 pt-6 pb-8 overflow-y-auto">

        {/* ── Section 1: How many users ── */}
        <div className="mb-6">
          <label className="block text-[11px] font-bold text-gray-900 mb-1 tracking-widest uppercase">
            Members Using Supplements
          </label>
          <p className="text-xs text-gray-500 mb-3">
            Approximate count of gym members who regularly use supplements
          </p>

          <div className="grid grid-cols-2 gap-3">
            {USER_BANDS.map((band) => {
              const selected = data.supplementUserCount === band;
              return (
                <button
                  key={band}
                  type="button"
                  onClick={() => update("supplementUserCount", band)}
                  className={`h-14 rounded-2xl border-2 text-sm font-bold transition-all ${
                    selected
                      ? "bg-gray-800 border-gray-800 text-white"
                      : "bg-white border-gray-300 text-gray-700 hover:border-gray-500"
                  }`}
                >
                  {band}
                  <span className="block text-[10px] font-normal opacity-70">
                    members
                  </span>
                </button>
              );
            })}
          </div>
          <ErrorMsg field="supplementUserCount" />
        </div>

        {/* ── Section 2: Supplement types ── */}
        <div className="mb-6">
          <label className="block text-[11px] font-bold text-gray-900 mb-1 tracking-widest uppercase">
            Most Used Supplement Types
          </label>
          <p className="text-xs text-gray-500 mb-3">
            Select all that apply — you can add custom ones too
          </p>

          {/* Selected chips */}
          {selectedTypes.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {selectedTypes.map((s) => (
                <span
                  key={s}
                  className="flex items-center gap-1 bg-gray-800 text-white text-xs font-semibold px-3 py-1.5 rounded-full"
                >
                  {s}
                  <button
                    type="button"
                    onClick={() => removeSupplement(s)}
                    className="ml-1 text-gray-300 hover:text-white leading-none"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}

          {/* Preset grid */}
          <div className="flex flex-wrap gap-2 mb-3">
            {PRESET_SUPPLEMENTS.filter((s) => !selectedTypes.includes(s)).map(
              (s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => toggleSupplement(s)}
                  className="border-2 border-gray-300 bg-white text-gray-700 text-xs font-semibold px-3 py-1.5 rounded-full hover:border-gray-600 transition-all"
                >
                  + {s}
                </button>
              )
            )}
          </div>

          {/* Custom input */}
          <div className="flex gap-2 mt-2">
            <input
              type="text"
              placeholder="Add custom supplement..."
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addCustom()}
              className="flex-1 border-2 border-gray-600 text-gray-900 rounded-xl px-3 h-11 bg-gray-50 outline-none text-sm"
            />
            <button
              type="button"
              onClick={addCustom}
              disabled={!customInput.trim()}
              className="h-11 px-4 bg-gray-800 text-white text-sm font-bold rounded-xl disabled:opacity-30 hover:bg-gray-900 transition-all"
            >
              Add
            </button>
          </div>

          <ErrorMsg field="supplementTypes" />
        </div>

        {/* ── Section 3: Budget ── */}
        <div className="mb-8">
          <label className="block text-[11px] font-bold text-gray-900 mb-1 tracking-widest uppercase">
            Average Monthly Supplement Budget
          </label>
          <p className="text-xs text-gray-500 mb-3">
            Per member average spend on supplements per month{" "}
            <span className="text-gray-400">(optional)</span>
          </p>

          <div className="flex gap-2">
            {/* Currency selector */}
            <select
              value={data.budgetCurrency || "INR"}
              onChange={(e) => update("budgetCurrency", e.target.value)}
              className="border-2 border-gray-600 text-gray-900 rounded-xl px-2 h-12 bg-gray-50 outline-none text-sm font-semibold"
            >
              {CURRENCIES.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.label}
                </option>
              ))}
            </select>

            {/* Amount input */}
            <input
              type="number"
              min="0"
              placeholder="e.g. 2000"
              value={data.budgetAmount || ""}
              onChange={(e) => update("budgetAmount", e.target.value)}
              onBlur={() =>
                setTouched((prev) => ({ ...prev, budgetAmount: true }))
              }
              className={`flex-1 border-2 text-gray-900 rounded-xl px-3 h-12 bg-gray-50 outline-none transition-colors ${
                touched.budgetAmount && errors.budgetAmount
                  ? "border-red-500 bg-red-50"
                  : touched.budgetAmount && data.budgetAmount && !errors.budgetAmount
                  ? "border-green-500"
                  : "border-gray-600"
              }`}
            />
          </div>
          <ErrorMsg field="budgetAmount" />
        </div>

        {/* ── Section 4: Members NOT using supplements ── */}
        <div className="mb-8">
          <label className="block text-[11px] font-bold text-gray-900 mb-1 tracking-widest uppercase">
            Members Not Using Supplements
          </label>
          <p className="text-xs text-gray-500 mb-3">
            Approximate count of members who don't use any supplements
          </p>

          <div className="grid grid-cols-2 gap-3 mb-4">
            {NON_USER_BANDS.map((band) => {
              const selected = data.nonSupplementUserCount === band;
              return (
                <button
                  key={band}
                  type="button"
                  onClick={() => update("nonSupplementUserCount", band)}
                  className={`h-14 rounded-2xl border-2 text-sm font-bold transition-all ${
                    selected
                      ? "bg-gray-800 border-gray-800 text-white"
                      : "bg-white border-gray-300 text-gray-700 hover:border-gray-500"
                  }`}
                >
                  {band}
                  <span className="block text-[10px] font-normal opacity-70">
                    members
                  </span>
                </button>
              );
            })}
          </div>

          {/* Reason textarea */}
          <label className="block text-[11px] font-bold text-gray-900 mb-1 tracking-widest uppercase">
            Reason for Not Using{" "}
            <span className="normal-case font-normal text-gray-400">(optional)</span>
          </label>
          <p className="text-xs text-gray-500 mb-2">
            Why do members avoid supplements? (cost, awareness, preference, etc.)
          </p>
          <div
            className={`border-2 rounded-xl px-3 pt-3 pb-2 transition-colors ${
              touched.nonSupplementReason && data.nonSupplementReason
                ? "border-green-500 bg-gray-50"
                : "border-gray-600 bg-gray-50"
            }`}
          >
            <textarea
              rows={4}
              placeholder="e.g. Many members feel supplements are too expensive or they don't know which ones to use..."
              value={data.nonSupplementReason || ""}
              onChange={(e) => update("nonSupplementReason", e.target.value)}
              onBlur={() =>
                setTouched((prev) => ({ ...prev, nonSupplementReason: true }))
              }
              className="w-full bg-transparent outline-none text-gray-900 resize-none text-sm"
            />
          </div>
        </div>

        {/* ── Buttons ── */}
        <div className="flex flex-col gap-3">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="w-full h-14 bg-gray-800 text-white text-base font-bold rounded-2xl hover:bg-gray-900 transition-all disabled:opacity-60"
          >
            {loading ? "Submitting..." : "Submit"}
          </button>

          <button
            type="button"
            onClick={onBack}
            className="w-full h-12 bg-white border-2 border-gray-300 text-gray-700 text-base font-semibold rounded-2xl hover:bg-gray-100 transition-all"
          >
            ← Back
          </button>
        </div>

      </div>
    </div>
  );
}
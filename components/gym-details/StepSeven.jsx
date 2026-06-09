"use client";

import { useState } from "react";

// ─── Data ──────────────────────────────────────────────────────────────────
const SUPPLEMENT_TYPES = [
  "Whey Protein", "Mass Gainer", "Creatine", "Pre-Workout",
  "BCAA / EAA", "Multivitamins", "Fat Burner", "Omega-3 / Fish Oil",
  "Protein Bar", "Weight Loss Supplement", "Testosterone Booster", "Glutamine",
];

const BRANDS = [
  "MuscleBlaze", "ON (Optimum Nutrition)", "Dymatize", "HealthKart",
  "Nutrabay", "BSN", "GNC", "Myprotein", "AS-IT-IS", "Scitron",
  "BigMuscles", "Labrada", "Local / Generic Brand",
];

const NO_SUPPLEMENT_REASONS = [
  "Too expensive",
  "Don't know which to take",
  "Prefer natural food",
  "Doctor advised against it",
  "Worried about side effects",
  "Haven't tried yet",
  "No results seen in others",
];

const BUDGET_RANGES = [
  "Under ₹500",
  "₹500 – ₹1,000",
  "₹1,000 – ₹2,000",
  "₹2,000 – ₹4,000",
  "₹4,000 – ₹7,000",
  "₹7,000+",
];

const FITNESS_GOALS = [
  "Muscle Gain", "Fat Loss", "Stamina / Endurance",
  "General Fitness", "Weight Gain", "Sports Performance", "Rehabilitation",
];

const IMPROVEMENTS_WANTED = [
  "Better taste / flavour",
  "More protein per serving",
  "Fewer side effects",
  "More affordable price",
  "Faster visible results",
  "Cleaner / natural ingredients",
  "Better mixability",
  "Bigger pack size",
  "Certified / trusted brand",
  "Locally available",
];

// ─── Small helpers ─────────────────────────────────────────────────────────
function Label({ children, required }) {
  return (
    <p className="text-sm font-semibold text-gray-800 mb-2">
      {children} {required && <span className="text-rose-500">*</span>}
    </p>
  );
}

function Hint({ children }) {
  return <p className="text-xs text-gray-400 mb-2 leading-relaxed">{children}</p>;
}

function ErrMsg({ msg }) {
  return msg ? (
    <p className="text-xs text-rose-500 mt-1.5 font-medium flex items-center gap-1">
      <span>⚠</span> {msg}
    </p>
  ) : null;
}

function ChipGroup({ options, selected, onToggle, multi = true, cols = 2 }) {
  const gridClass = cols === 3 ? "grid-cols-3" : cols === 1 ? "grid-cols-1" : "grid-cols-2";
  return (
    <div className={`grid ${gridClass} gap-2`}>
      {options.map((opt) => {
        const active = multi ? selected.includes(opt) : selected === opt;
        return (
          <button
            key={opt}
            type="button"
            onClick={() => onToggle(opt)}
            className={`px-3 py-2.5 rounded-xl text-xs font-semibold border text-left transition-all active:scale-95 leading-tight
              ${active
                ? "bg-violet-600 border-violet-600 text-white shadow-sm shadow-violet-200"
                : "bg-white border-gray-200 text-gray-600 hover:border-violet-300 hover:bg-violet-50"
              }`}
          >
            {active && <span className="mr-1">✓</span>}{opt}
          </button>
        );
      })}
    </div>
  );
}

function TagChips({ options, selected, onToggle }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {options.map((opt) => {
        const active = selected.includes(opt);
        return (
          <button
            key={opt}
            type="button"
            onClick={() => onToggle(opt)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all active:scale-95
              ${active
                ? "bg-violet-600 border-violet-600 text-white"
                : "bg-white border-gray-200 text-gray-500 hover:border-violet-300 hover:text-violet-600"
              }`}
          >
            {opt}
          </button>
        );
      })}
    </div>
  );
}

function SectionBlock({ icon, title, subtitle, children }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-4">
      <div className="flex items-start gap-3 mb-4 pb-3 border-b border-gray-100">
        <div className="w-9 h-9 rounded-xl bg-violet-50 flex items-center justify-center text-lg flex-shrink-0">
          {icon}
        </div>
        <div>
          <p className="text-sm font-bold text-gray-800">{title}</p>
          {subtitle && <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>}
        </div>
      </div>
      {children}
    </div>
  );
}

function inputCls(err) {
  return `w-full text-sm px-3.5 py-2.5 border rounded-xl bg-white text-gray-800 placeholder-gray-400
    focus:outline-none focus:ring-2 transition-all
    ${err
      ? "border-rose-300 focus:ring-rose-100 focus:border-rose-400"
      : "border-gray-200 focus:ring-violet-100 focus:border-violet-400"}`;
}

// ─── Main Component ────────────────────────────────────────────────────────
export default function StepSeven({ data, setData, onBack, onNext, loading }) {
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Helper: toggle item in array
  const toggle = (field, value) => {
    const arr = data[field] || [];
    const next = arr.includes(value) ? arr.filter(v => v !== value) : [...arr, value];
    setData(prev => ({ ...prev, [field]: next }));
    if (touched[field]) validateField(field, next);
  };

  const setSingle = (field, value) => {
    setData(prev => ({ ...prev, [field]: value }));
    if (touched[field]) validateField(field, value);
  };

  const blur = (field) => {
    setTouched(p => ({ ...p, [field]: true }));
    validateField(field, data[field]);
  };

  const validateField = (field, value) => {
    let err = null;
    switch (field) {
      case "userName":
        if (!value?.trim()) err = "Please enter the member's name";
        break;
      case "age":
        if (!value?.trim()) err = "Age is required";
        else if (isNaN(value) || Number(value) < 10 || Number(value) > 100)
          err = "Enter a valid age between 10 and 100";
        break;
      case "fitnessGoal":
        if (!value || value.length === 0) err = "Select at least one goal";
        break;
      case "usesSupplements":
        if (value === undefined || value === null || value === "")
          err = "Please answer this question";
        break;
      case "supplementTypes":
        if (data.usesSupplements === true && (!value || value.length === 0))
          err = "Select at least one supplement type";
        break;
      case "noSupplementReason":
        if (data.usesSupplements === false && !value?.trim())
          err = "Please select or describe a reason";
        break;
    }
    setErrors(prev => ({ ...prev, [field]: err }));
    return err;
  };

  const validate = () => {
    const fields = ["userName", "age", "fitnessGoal", "usesSupplements"];
    if (data.usesSupplements === true) fields.push("supplementTypes");
    if (data.usesSupplements === false) fields.push("noSupplementReason");

    const newTouched = {};
    const newErrors = {};
    let ok = true;

    fields.forEach(f => {
      newTouched[f] = true;
      const err = validateField(f, data[f]);
      if (err) { newErrors[f] = err; ok = false; }
    });

    setTouched(newTouched);
    setErrors(newErrors);
    return ok;
  };

  const handleNext = () => {
    if (validate()) onNext();
    else window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50/40 via-white to-slate-50 py-8 px-3 sm:px-5">
      <div className="max-w-lg mx-auto">

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <button
            type="button"
            onClick={onBack}
            className="w-9 h-9 rounded-xl border border-gray-200 bg-white flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-all flex-shrink-0"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div className="flex-1">
            <h1 className="text-lg font-bold text-gray-900">Member Profile</h1>
            <p className="text-xs text-gray-400 mt-0.5">Quick survey about this gym member</p>
          </div>
          <div className="text-xs font-bold text-violet-600 bg-violet-50 px-3 py-1.5 rounded-full">
            Step 7 of 7
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full h-1.5 bg-gray-100 rounded-full mb-6 overflow-hidden">
          <div className="h-full bg-gradient-to-r from-violet-500 to-indigo-500 rounded-full" style={{ width: "100%" }} />
        </div>

        {/* ── Section 1: Basic Info ── */}
        <SectionBlock  title="Member Basic Info" subtitle="Name and age of the gym member">

          <div className="mb-4">
            <Label required>Member's Name</Label>
            <input
              className={inputCls(touched.userName && errors.userName)}
              type="text"
              value={data.userName || ""}
              onChange={e => setData(p => ({ ...p, userName: e.target.value }))}
              onBlur={() => blur("userName")}
              placeholder="e.g. Rahul Sharma"
            />
            <ErrMsg msg={touched.userName && errors.userName} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label required>Age</Label>
              <input
                className={inputCls(touched.age && errors.age)}
                type="number"
                min="10" max="100"
                value={data.age || ""}
                onChange={e => setData(p => ({ ...p, age: e.target.value }))}
                onBlur={() => blur("age")}
                placeholder="e.g. 24"
              />
              <ErrMsg msg={touched.age && errors.age} />
            </div>
            <div>
              <Label>Gender</Label>
              <div className="grid grid-cols-3 gap-1.5 mt-0">
                {["Male", "Female", "Other"].map(g => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => setSingle("gender", g)}
                    className={`py-2.5 rounded-xl text-xs font-semibold border transition-all active:scale-95
                      ${data.gender === g
                        ? "bg-violet-600 border-violet-600 text-white"
                        : "bg-white border-gray-200 text-gray-500 hover:border-violet-300"}`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-4">
            <Label required>Fitness Goal</Label>
            <Hint>What is this member working towards? (Select all that apply)</Hint>
            <TagChips
              options={FITNESS_GOALS}
              selected={data.fitnessGoal || []}
              onToggle={v => { toggle("fitnessGoal", v); setTouched(p => ({ ...p, fitnessGoal: true })); }}
            />
            <ErrMsg msg={touched.fitnessGoal && errors.fitnessGoal} />
          </div>

          <div className="mt-4">
            <Label>How long have they been training?</Label>
            <ChipGroup
              options={["Less than 3 months", "3–6 months", "6–12 months", "1–3 years", "3+ years"]}
              selected={data.trainingDuration || ""}
              onToggle={v => setSingle("trainingDuration", v)}
              multi={false}
              cols={2}
            />
          </div>
        </SectionBlock>

        {/* ── Section 2: Supplement Use ── */}
        <SectionBlock title="Supplement Usage" subtitle="Does this member use supplements?">

          <Label required>Does this member use supplements?</Label>
          <div className="grid grid-cols-2 gap-3 mb-1">
            {[
              { label: "Yes, I use them", val: true},
              { label: "No, I don't use", val: false},
            ].map(({ label, val, icon }) => (
              <button
                key={String(val)}
                type="button"
                onClick={() => {
                  setSingle("usesSupplements", val);
                  setTouched(p => ({ ...p, usesSupplements: true }));
                }}
                className={`flex items-center gap-2.5 px-4 py-3.5 rounded-xl border text-sm font-semibold transition-all active:scale-95
                  ${data.usesSupplements === val
                    ? val
                      ? "bg-emerald-50 border-emerald-400 text-emerald-700 ring-2 ring-emerald-200"
                      : "bg-rose-50 border-rose-400 text-rose-700 ring-2 ring-rose-200"
                    : "bg-white border-gray-200 text-gray-600 hover:border-gray-300"}`}
              >
                <span className="text-lg">{icon}</span>
                <span>{label}</span>
              </button>
            ))}
          </div>
          <ErrMsg msg={touched.usesSupplements && errors.usesSupplements} />

          {/* ── YES branch ── */}
          {data.usesSupplements === true && (
            <div className="mt-5 space-y-5 pt-4 border-t border-gray-100">

              <div>
                <Label required>Which supplements do they use?</Label>
                <TagChips
                  options={SUPPLEMENT_TYPES}
                  selected={data.supplementTypes || []}
                  onToggle={v => { toggle("supplementTypes", v); setTouched(p => ({ ...p, supplementTypes: true })); }}
                />
                <ErrMsg msg={touched.supplementTypes && errors.supplementTypes} />
              </div>

              <div>
                <Label>Which brands do they prefer?</Label>
                <Hint>Select all brands this member currently uses</Hint>
                <TagChips
                  options={BRANDS}
                  selected={data.preferredBrands || []}
                  onToggle={v => toggle("preferredBrands", v)}
                />
              </div>

              <div>
                <Label>Monthly budget for supplements</Label>
                <ChipGroup
                  options={BUDGET_RANGES}
                  selected={data.monthlyBudget || ""}
                  onToggle={v => setSingle("monthlyBudget", v)}
                  multi={false}
                  cols={2}
                />
              </div>

              <div>
                <Label>How satisfied are they with current supplements?</Label>
                <div className="grid grid-cols-5 gap-2 mt-1">
                  {[
                    { val: "1", emoji: "😞", label: "Poor" },
                    { val: "2", emoji: "😕", label: "Okay" },
                    { val: "3", emoji: "😐", label: "Neutral" },
                    { val: "4", emoji: "🙂", label: "Good" },
                    { val: "5", emoji: "😍", label: "Great" },
                  ].map(({ val, emoji, label }) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setSingle("satisfactionRating", val)}
                      className={`flex flex-col items-center gap-1 py-2.5 rounded-xl border text-xs font-medium transition-all active:scale-95
                        ${data.satisfactionRating === val
                          ? "bg-violet-600 border-violet-600 text-white"
                          : "bg-white border-gray-200 text-gray-500 hover:border-violet-300"}`}
                    >
                      <span className="text-xl">{emoji}</span>
                      <span>{label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <Label>What improvements do they want in their current supplement?</Label>
                <Hint>Select all that apply</Hint>
                <TagChips
                  options={IMPROVEMENTS_WANTED}
                  selected={data.improvementsWanted || []}
                  onToggle={v => toggle("improvementsWanted", v)}
                />
              </div>

            </div>
          )}

          {/* ── NO branch ── */}
          {data.usesSupplements === false && (
            <div className="mt-5 pt-4 border-t border-gray-100 space-y-4">

              <div>
                <Label required>Why don't they use supplements?</Label>
                <ChipGroup
                  options={NO_SUPPLEMENT_REASONS}
                  selected={data.noSupplementReason ? [data.noSupplementReason] : []}
                  onToggle={v => { setSingle("noSupplementReason", v); setTouched(p => ({ ...p, noSupplementReason: true })); }}
                  multi={false}
                  cols={1}
                />
                <ErrMsg msg={touched.noSupplementReason && errors.noSupplementReason} />
              </div>

              <div>
                <Label>Would they consider trying supplements if recommended?</Label>
                <div className="grid grid-cols-3 gap-2">
                  {["Yes, definitely", "Maybe", "No, not interested"].map(opt => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setSingle("openToTrying", opt)}
                      className={`py-2.5 px-2 rounded-xl border text-xs font-semibold text-center transition-all active:scale-95
                        ${data.openToTrying === opt
                          ? "bg-violet-600 border-violet-600 text-white"
                          : "bg-white border-gray-200 text-gray-500 hover:border-violet-300"}`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

            </div>
          )}
        </SectionBlock>

        {/* ── Section 3: Feedback ── */}
        <SectionBlock icon="💬" title="Member Feedback" subtitle="What does this member want or feel?">

          <div className="mb-4">
            <Label>What product or feature are they looking for?</Label>
            <Hint>Something they can't find in the market right now</Hint>
            <textarea
              className={inputCls(false)}
              value={data.productWishlist || ""}
              onChange={e => setData(p => ({ ...p, productWishlist: e.target.value }))}
              rows={3}
              placeholder="e.g. An affordable whey protein with no artificial sweetener, or a pre-workout that doesn't cause jitters..."
            />
          </div>

          <div className="mb-4">
            <Label>Where do they usually buy supplements?</Label>
            <ChipGroup
              options={["At the gym", "Local supplement shop", "Amazon / Flipkart", "Brand website", "HealthKart / Nutrabay", "Friend / trainer"]}
              selected={data.buyingChannel || []}
              onToggle={v => toggle("buyingChannel", v)}
              multi={true}
              cols={2}
            />
          </div>

          <div>
            <Label>Any other feedback or comments from this member?</Label>
            <textarea
              className={inputCls(false)}
              value={data.memberFeedback || ""}
              onChange={e => setData(p => ({ ...p, memberFeedback: e.target.value }))}
              rows={3}
              placeholder="e.g. Wants better guidance on which supplements to take for muscle gain on a ₹1,500 budget..."
            />
          </div>
        </SectionBlock>

        {/* ── Nav Buttons ── */}
        <div className="flex gap-3 mt-2 mb-10">
          <button
            type="button"
            onClick={onBack}
            className="flex-1 py-3.5 text-sm font-semibold border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 active:scale-95 transition-all"
          >
            ← Back
          </button>
          <button
            type="button"
            onClick={handleNext}
            disabled={loading}
            className="flex-1 py-3.5 text-sm font-bold bg-violet-600 text-white rounded-xl hover:bg-violet-700 active:scale-95 transition-all shadow-md shadow-violet-200 disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                Saving...
              </>
            ) : (
              <>
                Continue
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </>
            )}
          </button>
        </div>

        <p className="text-center text-[11px] text-gray-400 mb-6">
          This information is kept confidential and used for internal purposes only.
        </p>
      </div>
    </div>
  );
}
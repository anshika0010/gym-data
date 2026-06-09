'use client';

import { useState, useRef } from "react";

const COUNTRIES = [
  { code: "IN", name: "India", flag: "🇮🇳", dial: "+91", currency: "₹", pinLabel: "PIN Code", pinPlaceholder: "e.g. 201001" },
  { code: "NP", name: "Nepal", flag: "🇳🇵", dial: "+977", currency: "₨", pinLabel: "PIN Code", pinPlaceholder: "e.g. 44600" },
  { code: "AE", name: "UAE", flag: "🇦🇪", dial: "+971", currency: "د.إ", pinLabel: "Postal Code", pinPlaceholder: "e.g. 00000" },
];

const DEFAULT_PRODUCTS = [
  "Whey Protein", "Mass Gainer", "Creatine", "Pre-Workout",
  "BCAA / EAA", "Multivitamins", "Fat Burner", "Omega 3 / Fish Oil",
  "Protein Bar / Snack", "Weight Loss Supplement",
];

const DEFAULT_BRANDS = [
  "MuscleBlaze", "ON (Optimum Nutrition)", "Dymatize",
  "Nutrabay",  "GNC", "Myprotein", "Local / Generic Brand",
];

// ─── Step indicator ───────────────────────────────────────────────────────────
const STEPS = ["Store Info", "Address", "Products", "Customers", "Market"];

function StepBar({ current }) {
  return (
    <div className="flex items-center gap-0 mb-8 px-1">
      {STEPS.map((s, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <div key={s} className="flex items-center flex-1 min-w-0">
            <div className="flex flex-col items-center flex-shrink-0">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all
                ${done ? "bg-indigo-600 border-indigo-600 text-white" : active ? "bg-white border-indigo-600 text-indigo-600" : "bg-white border-gray-200 text-gray-400"}`}>
                {done ? (
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                ) : i + 1}
              </div>
              <span className={`text-[9px] mt-1 font-semibold tracking-wide whitespace-nowrap ${active ? "text-indigo-600" : done ? "text-indigo-400" : "text-gray-400"}`}>{s}</span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`flex-1 h-0.5 mx-1 mb-4 rounded ${done ? "bg-indigo-500" : "bg-gray-200"}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Tag Input ────────────────────────────────────────────────────────────────
function TagInput({ label, required, defaultTags, selectedSet, onChange, error, touched }) {
  const [tags, setTags] = useState([...defaultTags]);
  const [inputVal, setInputVal] = useState("");
  const inputRef = useRef(null);

  const toggleTag = (tag) => {
    const next = new Set(selectedSet);
    next.has(tag) ? next.delete(tag) : next.add(tag);
    onChange(next);
  };

  const addTag = () => {
    const val = inputVal.trim();
    if (val && !tags.includes(val)) {
      setTags(prev => [...prev, val]);
      const next = new Set(selectedSet);
      next.add(val);
      onChange(next);
    }
    setInputVal("");
    inputRef.current?.focus();
  };

  const removeTag = (tag) => {
    setTags(prev => prev.filter(t => t !== tag));
    const next = new Set(selectedSet);
    next.delete(tag);
    onChange(next);
  };

  return (
    <div className="mb-5">
      <div className="flex justify-between items-center mb-2">
        <label className="text-sm font-semibold text-gray-700">
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
        {selectedSet.size > 0 && (
          <span className="text-[11px] bg-indigo-50 text-indigo-600 px-2.5 py-0.5 rounded-full font-semibold">
            {selectedSet.size} selected
          </span>
        )}
      </div>
      <div className="flex flex-wrap gap-1.5 p-3 rounded-xl border border-gray-100 bg-gray-50 min-h-[52px]">
        {tags.map(tag => {
          const sel = selectedSet.has(tag);
          const custom = !defaultTags.includes(tag);
          return (
            <button key={tag} type="button" onClick={() => toggleTag(tag)}
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium border transition-all active:scale-95
                ${sel ? "bg-indigo-600 border-indigo-600 text-white" : "bg-white border-gray-200 text-gray-600 hover:border-indigo-300 hover:text-indigo-600"}`}>
              {sel && <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>}
              {tag}
              {custom && <span onClick={e => { e.stopPropagation(); removeTag(tag); }}
                className={`ml-0.5 text-sm leading-none ${sel ? "opacity-70 hover:opacity-100" : "text-gray-400 hover:text-rose-500"}`}>×</span>}
            </button>
          );
        })}
      </div>
      <div className="flex gap-2 mt-2">
        <input ref={inputRef} type="text" value={inputVal}
          onChange={e => setInputVal(e.target.value)}
          onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); addTag(); } }}
          placeholder={`Add a custom ${label.toLowerCase().includes("brand") ? "brand" : "product"}...`}
          className="flex-1 text-sm px-3 py-2 border border-gray-200 rounded-lg bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-all" />
        <button type="button" onClick={addTag} disabled={!inputVal.trim()}
          className="px-3 py-2 text-sm font-semibold border border-gray-200 rounded-lg bg-white text-gray-600 hover:bg-indigo-50 hover:border-indigo-300 hover:text-indigo-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all">
          + Add
        </button>
      </div>
      {touched && error && <p className="text-xs text-rose-500 mt-1.5 font-medium">⚠ {error}</p>}
    </div>
  );
}

// ─── Shared field wrapper ─────────────────────────────────────────────────────
function Field({ label, required, hint, error, touched, children, extra }) {
  return (
    <div className="mb-4 last:mb-0">
      <div className="flex justify-between items-baseline mb-1">
        <label className="text-sm font-semibold text-gray-700">
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
        {extra && <span className="text-[11px] text-gray-400 font-medium">{extra}</span>}
      </div>
      {hint && <p className="text-xs text-gray-400 mb-1.5 leading-relaxed">{hint}</p>}
      {children}
      {touched && error && <p className="text-xs text-rose-500 mt-1 font-medium">⚠ {error}</p>}
    </div>
  );
}

// ─── Section card ─────────────────────────────────────────────────────────────
function Card({ children, className = "" }) {
  return (
    <div className={`bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-5 ${className}`}>
      {children}
    </div>
  );
}

function SectionTitle({ icon, title, subtitle }) {
  return (
    <div className="flex items-start gap-3 mb-5 pb-4 border-b border-gray-100">
      <div className="w-9 h-9 rounded-xl bg-indigo-50 flex items-center justify-center text-lg flex-shrink-0">{icon}</div>
      <div>
        <h3 className="text-sm font-bold text-gray-800">{title}</h3>
        {subtitle && <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>}
      </div>
    </div>
  );
}

// ─── Input class helper ───────────────────────────────────────────────────────
function iClass(touched, error, value, required = true) {
  const invalid = touched && error;
  const valid = touched && !error && value?.toString().trim();
  return `w-full text-sm px-3.5 py-2.5 border rounded-xl bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-150
    ${invalid ? "border-rose-300 focus:ring-rose-100 focus:border-rose-400"
      : valid && required ? "border-emerald-300 focus:ring-emerald-100 focus:border-emerald-400"
      : "border-gray-200 focus:ring-indigo-100 focus:border-indigo-400"}`;
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function StoreSurveyForm() {
  const [step, setStep] = useState(0);
  const [countryCode, setCountryCode] = useState("IN");
  const country = COUNTRIES.find(c => c.code === countryCode) || COUNTRIES[0];

  const [form, setForm] = useState({
    storeName: "", managerName: "", email: "", phone: "", whatsapp: "",
    street: "", locality: "", city: "", state: "", pinCode: "",
    products: new Set(), brands: new Set(), topSellingProduct: "",
    ageGroups: new Set(), demandText: "",
    priceRange: "", onlineImpact: "", feedback: ""
  });

  const [touched, setTouched] = useState({});
  const [errors, setErrors] = useState({});
  const [gpsStatus, setGpsStatus] = useState("idle");
  const [gpsCoords, setGpsCoords] = useState({ lat: "", lng: "" });
  const [submitted, setSubmitted] = useState(false);

  const PRICE_OPTIONS = [
    `Under ${country.currency}500`,
    `${country.currency}500 – ${country.currency}1,000`,
    `${country.currency}1,000 – ${country.currency}2,000`,
    `${country.currency}2,000 – ${country.currency}4,000`,
    `${country.currency}4,000 – ${country.currency}7,000`,
    `${country.currency}7,000 and above`,
  ];

  const validate = (field, value) => {
    let err = null;
    const emailRx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    switch (field) {
      case "storeName": if (!value?.trim()) err = "Store name is required"; break;
      case "managerName": if (!value?.trim()) err = "Owner / manager name is required"; break;
      case "email":
        if (!value?.trim()) err = "Email is required";
        else if (!emailRx.test(value)) err = "Enter a valid email address";
        break;
      case "phone":
        if (!value?.trim()) err = "Phone number is required";
        else if (value.replace(/\D/g, "").length < 6) err = "Phone number is too short";
        break;
      case "products": if (!value || value.size === 0) err = "Select at least one product"; break;
      case "brands": if (!value || value.size === 0) err = "Select at least one brand"; break;
      case "topSellingProduct": if (!value?.trim()) err = "Enter your top selling product"; break;
      case "ageGroups": if (!value || value.size === 0) err = "Select at least one age group"; break;
      case "demandText": if (!value?.trim()) err = "Describe what customers ask for"; break;
      case "priceRange": if (!value) err = "Select a price range"; break;
      case "onlineImpact": if (!value) err = "Select an option"; break;
    }
    setErrors(prev => ({ ...prev, [field]: err }));
    return err;
  };

  const set = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (touched[field]) validate(field, value);
  };

  const blur = (field) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    validate(field, form[field]);
  };

  // Step field groups
  const STEP_FIELDS = [
    ["storeName", "managerName", "email", "phone"],
    [],
    ["products", "brands", "topSellingProduct"],
    ["ageGroups", "demandText"],
    ["priceRange", "onlineImpact"],
  ];

  const validateStep = (s) => {
    const fields = STEP_FIELDS[s];
    const newTouched = { ...touched };
    const newErrors = { ...errors };
    let hasErr = false;
    fields.forEach(f => {
      newTouched[f] = true;
      const err = validate(f, form[f]);
      if (err) { newErrors[f] = err; hasErr = true; }
    });
    setTouched(newTouched);
    setErrors(newErrors);
    return !hasErr;
  };

  const nextStep = () => {
    if (validateStep(step)) setStep(s => Math.min(s + 1, STEPS.length - 1));
    else window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const prevStep = () => setStep(s => Math.max(s - 1, 0));

  const detectGPS = () => {
    setGpsStatus("loading");
    if (!navigator.geolocation) { setGpsStatus("error"); return; }
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude.toFixed(6);
        const lng = pos.coords.longitude.toFixed(6);
        setGpsCoords({ lat, lng });
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&addressdetails=1`, { headers: { "Accept-Language": "en" } });
          const data = await res.json();
          const a = data.address || {};
          setForm(prev => ({
            ...prev,
            street: [a.road, a.house_number].filter(Boolean).join(", ") || prev.street,
            locality: a.suburb || a.neighbourhood || a.village || prev.locality,
            city: a.city || a.town || a.county || prev.city,
            state: a.state || prev.state,
            pinCode: a.postcode || prev.pinCode,
          }));
          setGpsStatus("filled");
        } catch { setGpsStatus("ok"); }
      },
      () => setGpsStatus("error")
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateStep(4)) setSubmitted(true);
  };

  const inputClass = (field, req = true) => iClass(touched[field], errors[field], form[field], req);

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-slate-100 flex items-center justify-center p-6">
        <div className="bg-white rounded-3xl border border-gray-100 shadow-2xl p-10 text-center max-w-sm w-full">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500 flex items-center justify-center mx-auto mb-5 shadow-lg shadow-emerald-200">
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-1">Survey Submitted!</h2>
          <p className="text-sm text-gray-500 mb-7">Store details saved successfully. Thank you!</p>
          <button onClick={() => { setSubmitted(false); setStep(0); setTouched({}); setErrors({}); setGpsStatus("idle"); setGpsCoords({ lat: "", lng: "" }); setForm({ storeName: "", managerName: "", email: "", phone: "", whatsapp: "", street: "", locality: "", city: "", state: "", pinCode: "", products: new Set(), brands: new Set(), topSellingProduct: "", ageGroups: new Set(), demandText: "", priceRange: "", onlineImpact: "", feedback: "" }); }}
            className="w-full py-3 text-sm font-bold bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 active:scale-95 transition-all">
            Add Another Store
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-slate-100 py-8 px-3 sm:px-6">
      <div className="w-full max-w-xl mx-auto">

        {/* Header */}
        <div className="mb-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-200 flex-shrink-0">
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 leading-tight">Store Survey</h1>
            <p className="text-xs text-gray-500">Supplement distribution network — store details</p>
          </div>
        </div>

        <StepBar current={step} />

        <form onSubmit={handleSubmit} noValidate>

          {/* ── Step 0: Store Info ── */}
          {step === 0 && (
            <Card>
              <SectionTitle icon="🏪" title="Store & Contact Details" subtitle="Basic information about the store and its manager" />

              {/* Country dropdown */}
              <Field label="Country" required>
                <div className="relative">
                  <select value={countryCode} onChange={e => setCountryCode(e.target.value)}
                    className="w-full text-sm pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 appearance-none transition-all cursor-pointer">
                    {COUNTRIES.map(c => (
                      <option key={c.code} value={c.code}>{c.flag} {c.name} ({c.dial})</option>
                    ))}
                  </select>
                 
                  <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"/></svg>
                </div>
              </Field>

              <Field label="Store Name" required error={errors.storeName} touched={touched.storeName}>
                <input className={inputClass("storeName")} type="text" value={form.storeName}
                  onBlur={() => blur("storeName")} onChange={e => set("storeName", e.target.value)}
                  placeholder="e.g. HealthPro Supplements & Fitness" />
              </Field>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-1">
                <Field label="Owner / Manager Name" required error={errors.managerName} touched={touched.managerName}>
                  <input className={inputClass("managerName")} type="text" value={form.managerName}
                    onBlur={() => blur("managerName")} onChange={e => set("managerName", e.target.value)}
                    placeholder="Full name" />
                </Field>
                <Field label="Email Address" required error={errors.email} touched={touched.email}>
                  <input className={inputClass("email")} type="email" value={form.email}
                    onBlur={() => blur("email")} onChange={e => set("email", e.target.value)}
                    placeholder="manager@store.com" />
                </Field>
                <Field label="Phone Number" required error={errors.phone} touched={touched.phone}>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 font-mono font-medium pointer-events-none">{country.dial}</span>
                    <input className={inputClass("phone") + " pl-12"} type="tel" value={form.phone}
                      onBlur={() => blur("phone")} onChange={e => set("phone", e.target.value)}
                      placeholder="98765 43210" />
                  </div>
                </Field>
                <Field label="WhatsApp Number" required={false}>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 font-mono font-medium pointer-events-none">{country.dial}</span>
                    <input className={iClass(false, false, form.whatsapp, false) + " pl-12"} type="tel" value={form.whatsapp}
                      onChange={e => set("whatsapp", e.target.value)} placeholder="98765 43210 (optional)" />
                  </div>
                </Field>
              </div>
            </Card>
          )}

          {/* ── Step 1: Address ── */}
          {step === 1 && (
            <Card>
              <SectionTitle icon="📍" title="Store Address" subtitle="Location details — use GPS to auto-fill" />

              <div className="p-4 rounded-xl bg-indigo-50 border border-indigo-100 mb-5">
                <p className="text-xs font-semibold text-indigo-700 mb-2">Auto-detect address from GPS</p>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input className="flex-1 text-xs font-mono px-3 py-2 border border-indigo-100 rounded-lg bg-white text-gray-500" placeholder="Latitude" value={gpsCoords.lat} readOnly />
                  <input className="flex-1 text-xs font-mono px-3 py-2 border border-indigo-100 rounded-lg bg-white text-gray-500" placeholder="Longitude" value={gpsCoords.lng} readOnly />
                  <button type="button" onClick={detectGPS} disabled={gpsStatus === "loading"}
                    className="flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-bold bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 active:scale-95 disabled:opacity-60 whitespace-nowrap transition-all">
                    {gpsStatus === "loading"
                      ? <><svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg> Detecting...</>
                      : <><svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><circle cx="12" cy="12" r="3"/><path strokeLinecap="round" d="M12 2v3M12 19v3M2 12h3M19 12h3"/></svg> Detect</>
                    }
                  </button>
                </div>
                <p className={`text-[11px] mt-2 font-medium
                  ${gpsStatus === "filled" || gpsStatus === "ok" ? "text-emerald-600"
                    : gpsStatus === "error" ? "text-rose-500"
                    : gpsStatus === "loading" ? "text-indigo-500"
                    : "text-indigo-400"}`}>
                  {gpsStatus === "idle" && "Click 'Detect' to auto-fill your address below."}
                  {gpsStatus === "loading" && "🛰 Getting your location..."}
                  {gpsStatus === "ok" && "✓ Location captured. Some fields may have been filled."}
                  {gpsStatus === "filled" && "✓ Address filled from GPS. You can still edit below."}
                  {gpsStatus === "error" && "✕ Could not access location. Please fill address manually."}
                </p>
              </div>

              <Field label="Street Address">
                <input className={iClass(false, false, form.street, false)} type="text" value={form.street}
                  onChange={e => set("street", e.target.value)} placeholder="e.g. Shop 12, Ground Floor, MG Road" />
              </Field>
              <div className="grid grid-cols-2 gap-3 mt-1">
                <Field label="Area / Locality">
                  <input className={iClass(false, false, form.locality, false)} type="text" value={form.locality}
                    onChange={e => set("locality", e.target.value)} placeholder="e.g. Sector 4" />
                </Field>
                <Field label="City">
                  <input className={iClass(false, false, form.city, false)} type="text" value={form.city}
                    onChange={e => set("city", e.target.value)} placeholder="e.g. Ghaziabad" />
                </Field>
                <Field label="State / Region">
                  <input className={iClass(false, false, form.state, false)} type="text" value={form.state}
                    onChange={e => set("state", e.target.value)} placeholder="e.g. Uttar Pradesh" />
                </Field>
                <Field label={country.pinLabel} extra={`${form.pinCode.length}/10`}>
                  <input className={iClass(false, false, form.pinCode, false)} type="text" maxLength={10} value={form.pinCode}
                    onChange={e => set("pinCode", e.target.value)} placeholder={country.pinPlaceholder} />
                </Field>
              </div>
            </Card>
          )}

          {/* ── Step 2: Products ── */}
          {step === 2 && (
            <Card>
              <SectionTitle icon="📦" title="Products & Brands" subtitle="What do you sell and which brands do you stock?" />
              <TagInput label="Most Selling Products'Category" required defaultTags={DEFAULT_PRODUCTS}
                selectedSet={form.products} onChange={s => { set("products", s); setTouched(p => ({ ...p, products: true })); }}
                error={errors.products} touched={touched.products} />
              <TagInput label="Top Selling Brands" required defaultTags={DEFAULT_BRANDS}
                selectedSet={form.brands} onChange={s => { set("brands", s); setTouched(p => ({ ...p, brands: true })); }}
                error={errors.brands} touched={touched.brands} />
              <Field label="Top Selling Product" required hint="Which single product sells the most in your store?"
                error={errors.topSellingProduct} touched={touched.topSellingProduct}>
                <input className={inputClass("topSellingProduct")} type="text" value={form.topSellingProduct}
                  onBlur={() => blur("topSellingProduct")} onChange={e => set("topSellingProduct", e.target.value)}
                  placeholder="e.g. MuscleBlaze Whey Protein 1kg" />
              </Field>
            </Card>
          )}

          {/* ── Step 3: Customers ── */}
          {step === 3 && (
            <Card>
              <SectionTitle icon="👥" title="Customer Profile" subtitle="Who shops at your store and what do they want?" />
              <Field label="Customer Age Groups" required error={errors.ageGroups} touched={touched.ageGroups}>
                <div className="flex flex-wrap gap-2 mt-1">
                  {["Under 18", "18–24 yrs", "25–34 yrs", "35–44 yrs", "45+ yrs"].map(age => {
                    const sel = form.ageGroups.has(age);
                    return (
                      <button key={age} type="button"
                        onClick={() => { const n = new Set(form.ageGroups); sel ? n.delete(age) : n.add(age); set("ageGroups", n); setTouched(p => ({ ...p, ageGroups: true })); }}
                        className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all active:scale-95
                          ${sel ? "bg-indigo-600 border-indigo-600 text-white" : "bg-white border-gray-200 text-gray-600 hover:border-indigo-300"}`}>
                        {sel && <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>}
                        {age}
                      </button>
                    );
                  })}
                </div>
              </Field>
              <div className="mt-4">
                <Field label="What Do Customers Usually Ask For?" required
                  hint="Common requests — specific supplements, budget products, beginner packs, etc."
                  error={errors.demandText} touched={touched.demandText}>
                  <textarea className={inputClass("demandText")} value={form.demandText}
                    onBlur={() => blur("demandText")} onChange={e => set("demandText", e.target.value)}
                    rows={3} placeholder="e.g. Customers mostly ask for affordable whey protein, fat burners, and local brand options..." />
                </Field>
              </div>
            </Card>
          )}

          {/* ── Step 4: Market ── */}
          {step === 4 && (
            <Card>
              <SectionTitle icon="💰" title="Market & Sales" subtitle="Pricing and how online shopping affects your business" />

              <Field label="Which price range has the most sales?" required error={errors.priceRange} touched={touched.priceRange}>
                <div className="grid grid-cols-2 gap-2 mt-1">
                  {PRICE_OPTIONS.map(opt => {
                    const sel = form.priceRange === opt;
                    return (
                      <button key={opt} type="button"
                        onClick={() => { set("priceRange", opt); setTouched(p => ({ ...p, priceRange: true })); }}
                        className={`px-3 py-2.5 rounded-xl text-xs font-semibold border text-left transition-all active:scale-95
                          ${sel ? "bg-indigo-600 border-indigo-600 text-white" : "bg-white border-gray-200 text-gray-600 hover:border-indigo-300 hover:bg-indigo-50"}`}>
                        {sel && "✓ "}{opt}
                      </button>
                    );
                  })}
                </div>
              </Field>

              <div className="mt-5">
                <Field label="How much does online shopping affect your sales?" required
                  hint="e.g. Amazon, Flipkart, Blinkit"
                  error={errors.onlineImpact} touched={touched.onlineImpact}>
                  <div className="grid grid-cols-3 gap-2 mt-1">
                    {[
                      { label: "No Impact", icon: "😊", color: "emerald" },
                      { label: "Some Impact", icon: "📉", color: "amber" },
                      { label: "High Impact", icon: "⚠️", color: "rose" },
                    ].map(({ label, icon, color }) => {
                      const sel = form.onlineImpact === label;
                      return (
                        <button key={label} type="button"
                          onClick={() => { set("onlineImpact", label); setTouched(p => ({ ...p, onlineImpact: true })); }}
                          className={`flex flex-col items-center gap-1.5 py-4 rounded-xl border text-xs font-semibold transition-all active:scale-95
                            ${sel
                              ? color === "emerald" ? "bg-emerald-50 border-emerald-400 text-emerald-700 ring-2 ring-emerald-200"
                                : color === "amber" ? "bg-amber-50 border-amber-400 text-amber-700 ring-2 ring-amber-200"
                                : "bg-rose-50 border-rose-400 text-rose-700 ring-2 ring-rose-200"
                              : "bg-white border-gray-200 text-gray-500 hover:border-gray-300"}`}>
                          <span className="text-2xl">{icon}</span>
                          {label}
                        </button>
                      );
                    })}
                  </div>
                </Field>
              </div>

              <div className="mt-4">
                <Field label="Other Comments (Optional)">
                  <textarea className={iClass(false, false, form.feedback, false)} value={form.feedback}
                    onChange={e => set("feedback", e.target.value)} rows={3}
                    placeholder="e.g. Customers often compare our prices with online apps before buying..." />
                </Field>
              </div>
            </Card>
          )}

          {/* Navigation */}
          <div className="flex gap-3 mt-2 mb-10">
            {step > 0 && (
              <button type="button" onClick={prevStep}
                className="flex-1 py-3 text-sm font-semibold border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 active:scale-95 transition-all">
                ← Back
              </button>
            )}
            {step < STEPS.length - 1 ? (
              <button type="button" onClick={nextStep}
                className="flex-1 py-3 text-sm font-bold bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 active:scale-95 transition-all shadow-md shadow-indigo-200">
                Continue →
              </button>
            ) : (
              <button type="submit"
                className="flex-1 py-3 text-sm font-bold bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 active:scale-95 transition-all shadow-md shadow-indigo-200 flex items-center justify-center gap-2">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/></svg>
                Submit Survey
              </button>
            )}
          </div>
          <p className="text-center text-[11px] text-gray-400 mb-6">Confidential — used for internal purposes only.</p>
        </form>
      </div>
    </div>
  );
}
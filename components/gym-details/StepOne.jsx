"use client";

import { useState } from "react";
import StepHeader from "./StepHeader";
import FormField from "./FormField";

export default function StepOne({ form, setForm, onNext, onBack }) {
  const [gpsStatus, setGpsStatus] = useState(null);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const states = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
];

  // ── Validators ──────────────────────────────────────────
  const validators = {
    gymName: (v) => {
      if (!v?.trim()) return "Gym name is required";
      return "";
      // Gym name allows letters + numbers both ✅
    },

    ownerManagerName: (v) => {
      if (!v?.trim()) return "Owner / Manager name is required";
      if (!/^[a-zA-Z\s]+$/.test(v.trim()))
        return "Name should contain letters only";
      return "";
    },

    phoneNumber: (v) => {
      if (!v?.trim()) return "Phone number is required";
      if (!/^[6-9]\d{9}$/.test(v.replace(/\s/g, "")))
        return "Enter a valid 10-digit phone number";
      return "";
    },

    address: (v) => (!v?.trim() ? "Address is required" : ""),

    pincode: (v) => {
      if (!v?.trim()) return "Pincode is required";
      if (!/^\d{6}$/.test(v.trim())) return "Enter valid 6-digit pincode";
      return "";
    },

    city: (v) => (!v?.trim() ? "City is required" : ""),

    state: (v) => (!v?.trim() ? "State is required" : ""),
  };

  // ── On change ───────────────────────────────────────────
  const update = (field) => (e) => {
    let value = e.target.value;

    // Owner name: block numbers from being typed
    if (field === "ownerManagerName") {
      value = value.replace(/[^a-zA-Z\s]/g, "");
    }

    setForm((prev) => ({ ...prev, [field]: value }));
    setTouched((prev) => ({ ...prev, [field]: true }));
    if (validators[field]) {
      setErrors((prev) => ({ ...prev, [field]: validators[field](value) }));
    }
  };

  // ── On blur ─────────────────────────────────────────────
  const onBlur = (field) => () => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    if (validators[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: validators[field](form[field]),
      }));
    }
  };

  // ── GPS ─────────────────────────────────────────────────
  const fetchGPS = () => {
    if (!navigator.geolocation) {
      setGpsStatus("error");
      return;
    }
    setGpsStatus("loading");

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude.toFixed(5);
        const lng = pos.coords.longitude.toFixed(5);

        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
          );
          const data = await res.json();

          const newValues = {
            address: data.display_name || `Lat: ${lat}, Lng: ${lng}`,
            pincode: data.address?.postcode || "",
            city:
              data.address?.city ||
              data.address?.town ||
              data.address?.village ||
              "",
            state: data.address?.state || data.address?.county || "",
            lat,
            lng,
          };

          setForm((prev) => ({ ...prev, ...newValues }));

          setErrors((prev) => ({
            ...prev,
            address: validators.address(newValues.address),
            pincode: validators.pincode(newValues.pincode),
            city: validators.city(newValues.city),
            state: validators.state(newValues.state),
            gps: "",
          }));

          setTouched((prev) => ({
            ...prev,
            address: true,
            pincode: true,
            city: true,
            state: true,
          }));
        } catch {
          setForm((prev) => ({ ...prev, lat, lng }));
          setErrors((prev) => ({ ...prev, gps: "" }));
        }

        setGpsStatus("success");
      },
      () => {
        setGpsStatus("error");
        setErrors((prev) => ({
          ...prev,
          gps: "Could not fetch location. Please try again.",
        }));
      }
    );
  };

  // ── Next ────────────────────────────────────────────────
  const handleNext = () => {
const allTouched = Object.keys(validators).reduce(
  (acc, k) => ({ ...acc, [k]: true }),
  {}
);
    setTouched(allTouched);

    const newErrors = Object.entries(validators).reduce((acc, [k, fn]) => {
      acc[k] = fn(form[k]);
      return acc;
    }, {});

  
    setErrors(newErrors);

    const hasErrors = Object.values(newErrors).some((e) => e);
    if (!hasErrors) onNext();
  };

  // ── Helpers ─────────────────────────────────────────────
  const ErrorMsg = ({ field }) =>
    touched[field] && errors[field] ? (
      <p className="text-red-500 text-xs mt-1 ml-1">{errors[field]}</p>
    ) : null;

  const inputClass = (field) =>
    `w-full border-2 text-gray-900 rounded-xl px-3 h-12 bg-gray-50 outline-none transition-colors ${
      touched[field] && errors[field]
        ? "border-red-500 bg-red-50"
        : touched[field] && !errors[field]
        ? "border-green-500"
        : "border-gray-600"
    }`;

  return (
    <div className="min-h-screen max-w-md mx-auto bg-gray-50 rounded-[32px] flex flex-col">
      <StepHeader step={1} title="Gym details" />

      <div className="flex-1 px-5 pt-6 pb-8 overflow-y-auto">

        {/* Gym Name — letters + numbers allowed */}
        <div className="mb-4">
          <label className="block text-[11px] font-bold text-gray-900 mb-2 tracking-widest uppercase">
            Gym Name
          </label>
          <input
            type="text"
            placeholder="e.g. Iron Beast Fitness 24"
            value={form.gymName}
            onChange={update("gymName")}
            onBlur={onBlur("gymName")}
            className={inputClass("gymName")}
          />
          <ErrorMsg field="gymName" />
        </div>

        {/* Owner — only letters allowed, numbers blocked on type */}
        <div className="mb-4">
          <label className="block text-[11px] font-bold text-gray-900 mb-2 tracking-widest uppercase">
            Owner / Manager
          </label>
          <input
            type="text"
            placeholder="Full name"
            value={form.ownerManagerName}
            onChange={update("ownerManagerName")}
            onBlur={onBlur("ownerManagerName")}
            className={inputClass("ownerManagerName")}
          />
          <ErrorMsg field="ownerManagerName" />
        </div>

        {/* Phone */}
        <div className="mb-4">
          <label className="block text-[11px] font-bold text-gray-900 mb-2 tracking-widest uppercase">
            Phone Number
          </label>
          <input
            type="tel"
            placeholder="9876543210"
            value={form.phoneNumber}
            onChange={update("phoneNumber")}
            onBlur={onBlur("phoneNumber")}
            maxLength={10}
            className={inputClass("phoneNumber")}
          />
          <ErrorMsg field="phoneNumber" />
        </div>

        {/* Address */}
        <div className="mb-4">
          <label className="block text-[11px] font-bold text-gray-900 mb-2 tracking-widest uppercase">
            Gym Address
          </label>
          <div
            className={`flex items-start border-2 rounded-xl px-3 pt-3 pb-2 transition-colors ${
              touched.address && errors.address
                ? "border-red-500 bg-red-50"
                : touched.address && !errors.address
                ? "border-green-500 bg-gray-50"
                : "border-gray-600 bg-gray-50"
            }`}
          >
            <textarea
              rows={3}
              value={form.address}
              onChange={update("address")}
              onBlur={onBlur("address")}
              placeholder="Street, area, city, state, pincode"
              className="w-full bg-transparent outline-none text-gray-900 resize-none text-sm"
            />
          </div>
          <ErrorMsg field="address" />
        </div>

        {/* GPS Button */}
        <button
          type="button"
          onClick={fetchGPS}
          disabled={gpsStatus === "loading"}
          className={`w-full h-11 border-2 border-dashed rounded-xl text-sm font-semibold mb-1 transition-all ${
            gpsStatus === "success"
              ? "bg-green-50 border-green-500 text-green-700"
              : touched.gps && errors.gps
              ? "border-red-500 bg-red-50 text-red-600"
              : "bg-gray-50 border-gray-900 text-gray-900"
          }`}
        >
          {gpsStatus === "loading"
            ? "Fetching location..."
            : gpsStatus === "success"
            ? "✓ Location fetched!"
            : "📍 Use my current location"}
        </button>
        <ErrorMsg field="gps" />

        {gpsStatus === "success" && form.lat && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-3 mb-2 mt-2">
            <p className="text-xs text-green-700">
              GPS: {form.lat}, {form.lng}
            </p>
          </div>
        )}

        {/* Pincode + City + State */}
        <div className="grid grid-cols-2 gap-3 mb-6 mt-3">
          <div>
            <label className="block text-[11px] text-gray-900 font-bold mb-2 uppercase">
              Pincode
            </label>
            <input
              type="text"
              value={form.pincode}
              onChange={update("pincode")}
              onBlur={onBlur("pincode")}
              maxLength={6}
              className={inputClass("pincode")}
            />
            <ErrorMsg field="pincode" />
          </div>

          <div>
            <label className="block text-[11px] text-gray-900 font-bold mb-2 uppercase">
              City
            </label>
            <input
              type="text"
              value={form.city}
              onChange={update("city")}
              onBlur={onBlur("city")}
              className={inputClass("city")}
            />
            <ErrorMsg field="city" />
          </div>

          <div className="col-span-2">
            <label className="block text-[11px] text-gray-900 font-bold mb-2 uppercase">
              State
            </label>
           <select
  value={form.state || ""}
  onChange={update("state")}
  onBlur={onBlur("state")}
  className={inputClass("state")}
>
  <option value="">Select State</option>

  {states.map((state) => (
    <option key={state} value={state}>
      {state}
    </option>
  ))}
</select>
            <ErrorMsg field="state" />
          </div>
        </div>

        {/* Next + Back Buttons */}
        <div className="flex flex-col gap-3">
          <button
            type="button"
            onClick={handleNext}
            className="w-full h-14 bg-gray-800 text-white text-base font-bold rounded-2xl hover:bg-gray-900 transition-all"
          >
            Next
          </button>

          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="w-full h-12 bg-white border-2 border-gray-300 text-gray-700 text-base font-semibold rounded-2xl hover:bg-gray-100 transition-all"
            >
              ← Back
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
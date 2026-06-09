"use client";

import { useState } from "react";
import StepHeader from "./StepHeader";

// ── Country config ────────────────────────────────────────────────────────────
const COUNTRIES = [
  {
    code: "IN",
    name: "India",
    flag: "🇮🇳",
    dialCode: "+91",
    phonePlaceholder: "9876543210",
    phoneMaxLength: 10,
    phoneRegex: /^[6-9]\d{9}$/,
    phoneError: "Enter a valid 10-digit Indian mobile number",
    regions: [
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
    ],
    regionLabel: "State",
    pincodeLabel: "Pincode",
    pincodeRegex: /^\d{6}$/,
    pincodeError: "Enter valid 6-digit pincode",
  },
  {
    code: "NP",
    name: "Nepal",
    flag: "🇳🇵",
    dialCode: "+977",
    phonePlaceholder: "9841234567",
    phoneMaxLength: 10,
    phoneRegex: /^9\d{9}$/,
    phoneError: "Enter a valid 10-digit Nepal mobile number starting with 9",
    regions: [
      "Koshi Province",
      "Madhesh Province",
      "Bagmati Province",
      "Gandaki Province",
      "Lumbini Province",
      "Karnali Province",
      "Sudurpashchim Province",
    ],
    regionLabel: "Province",
    pincodeLabel: "Postal Code",
    pincodeRegex: /^\d{5}$/,
    pincodeError: "Enter valid 5-digit postal code",
  },
  {
    code: "AE",
    name: "UAE",
    flag: "🇦🇪",
    dialCode: "+971",
    phonePlaceholder: "0501234567",
    phoneMaxLength: 10,
    phoneRegex: /^0?5[0-9]\d{7}$/,
    phoneError: "Enter a valid UAE mobile number (e.g. 0501234567)",
    regions: [
      "Abu Dhabi",
      "Dubai",
      "Sharjah",
      "Ajman",
      "Umm Al Quwain",
      "Ras Al Khaimah",
      "Fujairah",
    ],
    regionLabel: "Emirate",
    pincodeLabel: "P.O. Box / Postal Code",
    pincodeRegex: /^\d{5,6}$/,
    pincodeError: "Enter valid postal code",
  },
];

// ── Component ─────────────────────────────────────────────────────────────────
export default function StepOne({ form, setForm, onNext, onBack }) {
  const [gpsStatus, setGpsStatus] = useState(null);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Resolve active country config
  const activeCountry =
    COUNTRIES.find((c) => c.code === form.countryCode) || COUNTRIES[0];

  // ── Validators ──────────────────────────────────────────
  const getValidators = (country) => ({
    countryCode: (v) => (!v ? "Please select a country" : ""),

    gymName: (v) => (!v?.trim() ? "Gym name is required" : ""),
    monthlyMembershipFees: (v) => (!v ? "Monthly membership fees is required" : ""),

    ownerManagerName: (v) => {
      if (!v?.trim()) return "Owner / Manager name is required";
      if (!/^[a-zA-Z\s]+$/.test(v.trim()))
        return "Name should contain letters only";
      return "";
    },

    phoneNumber: (v) => {
      if (!v?.trim()) return "Phone number is required";
      const cleaned = v.replace(/\s/g, "");
      if (!country.phoneRegex.test(cleaned)) return country.phoneError;
      return "";
    },

    whatsappNumber: (v) => {
      if (!v?.trim()) return ""; // optional field
      const cleaned = v.replace(/\s/g, "");
      if (!country.phoneRegex.test(cleaned))
        return `Enter a valid WhatsApp number (${country.dialCode})`;
      return "";
    },

    address: (v) => (!v?.trim() ? "Address is required" : ""),

    pincode: (v) => {
      if (!v?.trim()) return `${country.pincodeLabel} is required`;
      if (!country.pincodeRegex.test(v.trim())) return country.pincodeError;
      return "";
    },

    city: (v) => (!v?.trim() ? "City is required" : ""),

    state: (v) => (!v?.trim() ? `${country.regionLabel} is required` : ""),
  });

  // ── On change ───────────────────────────────────────────
  const update = (field) => (e) => {
    let value = e.target.value;

    if (field === "ownerManagerName") {
      value = value.replace(/[^a-zA-Z\s]/g, "");
    }

    // When country changes, reset location-related fields
    if (field === "countryCode") {
      setForm((prev) => ({
        ...prev,
        countryCode: value,
        phoneNumber: "",
        whatsappNumber: "",
        pincode: "",
        state: "",
        city: "",
        address: "",
        lat: "",
        lng: "",
      }));
      setErrors({});
      setTouched({});
      return;
    }

    setForm((prev) => ({ ...prev, [field]: value }));
    setTouched((prev) => ({ ...prev, [field]: true }));
    const validators = getValidators(activeCountry);
    if (validators[field]) {
      setErrors((prev) => ({ ...prev, [field]: validators[field](value) }));
    }
  };

  // ── On blur ─────────────────────────────────────────────
  const onBlur = (field) => () => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const validators = getValidators(activeCountry);
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

          const validators = getValidators(activeCountry);
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
    const validators = getValidators(activeCountry);
    // whatsappNumber is optional — exclude from required check
    const requiredFields = Object.keys(validators).filter(
      (k) => k !== "whatsappNumber"
    );

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

    const hasErrors = requiredFields.some((k) => newErrors[k]);
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

        {/* ── Country Selector ── */}
        <div className="mb-4">
          <label className="block text-[11px] font-bold text-gray-900 mb-2 tracking-widest uppercase">
            Country
          </label>
          <select
            value={form.countryCode || "IN"}
            onChange={update("countryCode")}
            onBlur={onBlur("countryCode")}
            className={inputClass("countryCode")}
          >
            {COUNTRIES.map((c) => (
              <option key={c.code} value={c.code}>
                {c.flag} {c.name} ({c.dialCode})
              </option>
            ))}
          </select>
          <ErrorMsg field="countryCode" />
        </div>

        {/* ── Gym Name ── */}
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

        {/* ── Monthly Membership Fees ── */}
<div className="mb-4">
  <label className="block text-[11px] font-bold text-gray-900 mb-2 tracking-widest uppercase">
    Monthly Membership Fees (₹)
  </label>

  <input
    type="number"
    placeholder="e.g. 1500"
    value={form.monthlyMembershipFees || ""}
    onChange={update("monthlyMembershipFees")}
    onBlur={onBlur("monthlyMembershipFees")}
    min="0"
    className={inputClass("monthlyMembershipFees")}
  />

  <ErrorMsg field="monthlyMembershipFees" />
</div>


        {/* ── Owner / Manager ── */}
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

        {/* ── Phone Number ── */}
        <div className="mb-1">
          <label className="block text-[11px] font-bold text-gray-900 mb-2 tracking-widest uppercase">
            Phone Number
          </label>
          <div className="flex gap-2">
            {/* Dial code badge */}
            <div className="flex items-center justify-center h-12 px-3 border-2 border-gray-600 rounded-xl bg-gray-100 text-gray-700 text-sm font-semibold whitespace-nowrap select-none">
              {activeCountry.flag} {activeCountry.dialCode}
            </div>
            <input
              type="tel"
              placeholder={activeCountry.phonePlaceholder}
              value={form.phoneNumber}
              onChange={update("phoneNumber")}
              onBlur={onBlur("phoneNumber")}
              maxLength={activeCountry.phoneMaxLength}
              className={`flex-1 border-2 text-gray-900 rounded-xl px-3 h-12 bg-gray-50 outline-none transition-colors ${
                touched.phoneNumber && errors.phoneNumber
                  ? "border-red-500 bg-red-50"
                  : touched.phoneNumber && !errors.phoneNumber
                  ? "border-green-500"
                  : "border-gray-600"
              }`}
            />
          </div>
          <ErrorMsg field="phoneNumber" />
        </div>

        {/* ── WhatsApp Number ── */}
        <div className="mb-4 mt-3">
          <label className="block text-[11px] font-bold text-gray-900 mb-2 tracking-widest uppercase">
            WhatsApp Number{" "}
           
          </label>
          <div className="flex gap-2">
            <div className="flex items-center justify-center h-12 px-3 border-2 border-gray-600 rounded-xl bg-gray-100 text-gray-700 text-sm font-semibold whitespace-nowrap select-none">
              💬 {activeCountry.dialCode}
            </div>
            <input
              type="tel"
              placeholder={activeCountry.phonePlaceholder}
              value={form.whatsappNumber || ""}
              onChange={update("whatsappNumber")}
              onBlur={onBlur("whatsappNumber")}
              maxLength={activeCountry.phoneMaxLength}
              className={`flex-1 border-2 text-gray-900 rounded-xl px-3 h-12 bg-gray-50 outline-none transition-colors ${
                touched.whatsappNumber && errors.whatsappNumber
                  ? "border-red-500 bg-red-50"
                  : touched.whatsappNumber && !errors.whatsappNumber && form.whatsappNumber
                  ? "border-green-500"
                  : "border-gray-600"
              }`}
            />
          </div>
          <ErrorMsg field="whatsappNumber" />
        </div>

        {/* ── Gym Address ── */}
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
              placeholder="Street, area, city"
              className="w-full bg-transparent outline-none text-gray-900 resize-none text-sm"
            />
          </div>
          <ErrorMsg field="address" />
        </div>

        {/* ── GPS Button ── */}
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

        {/* ── Pincode + City + State/Province/Emirate ── */}
        <div className="grid grid-cols-2 gap-3 mb-6 mt-3">
          <div>
            <label className="block text-[11px] text-gray-900 font-bold mb-2 uppercase">
              {activeCountry.pincodeLabel}
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
              {activeCountry.regionLabel}
            </label>
            <select
              value={form.state || ""}
              onChange={update("state")}
              onBlur={onBlur("state")}
              className={inputClass("state")}
            >
              <option value="">Select {activeCountry.regionLabel}</option>
              {activeCountry.regions.map((region) => (
                <option key={region} value={region}>
                  {region}
                </option>
              ))}
            </select>
            <ErrorMsg field="state" />
          </div>
        </div>

        {/* ── Next + Back ── */}
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
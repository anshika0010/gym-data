"use client";

import { useEffect, useRef, useState } from "react";
import StepHeader from "./StepHeader";

// ── Voice Recorder Component ─────────────────────────────
function VoiceRecorder({ onRecordingComplete, existingRecording }) {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [duration, setDuration] = useState(0);
  const [audioUrl, setAudioUrl] = useState(existingRecording || null);

  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const timerRef = useRef(null);
  const MAX_SECONDS = 10 * 60; // 10 minutes

  useEffect(() => {
    return () => clearInterval(timerRef.current);
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;
      chunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
        onRecordingComplete(blob, url);
        stream.getTracks().forEach((t) => t.stop());
      };

      recorder.start();
      setIsRecording(true);
      setIsPaused(false);
      setDuration(0);

      timerRef.current = setInterval(() => {
        setDuration((prev) => {
          if (prev >= MAX_SECONDS - 1) {
            stopRecording();
            return MAX_SECONDS;
          }
          return prev + 1;
        });
      }, 1000);
    } catch {
      alert("Microphone permission denied. Please allow microphone access.");
    }
  };

  const pauseRecording = () => {
    if (mediaRecorderRef.current?.state === "recording") {
      mediaRecorderRef.current.pause();
      setIsPaused(true);
      clearInterval(timerRef.current);
    }
  };

  const resumeRecording = () => {
    if (mediaRecorderRef.current?.state === "paused") {
      mediaRecorderRef.current.resume();
      setIsPaused(false);
      timerRef.current = setInterval(() => {
        setDuration((prev) => {
          if (prev >= MAX_SECONDS - 1) {
            stopRecording();
            return MAX_SECONDS;
          }
          return prev + 1;
        });
      }, 1000);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
    }
    clearInterval(timerRef.current);
    setIsRecording(false);
    setIsPaused(false);
  };

  const deleteRecording = () => {
    setAudioUrl(null);
    setDuration(0);
    onRecordingComplete(null, null);
  };

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60).toString().padStart(2, "0");
    const s = (secs % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const progress = (duration / MAX_SECONDS) * 100;

  return (
    <div className="bg-white border-2 border-gray-200 rounded-2xl p-4 space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-bold text-black">Voice Note</p>
        <span className="text-xs text-gray-400">Max 10 minutes</span>
      </div>

      {/* Recording UI */}
      {isRecording && (
        <div className="space-y-3">
          {/* Waveform animation */}
          <div className="flex items-center justify-center gap-1 py-3">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className={`w-1 rounded-full bg-red-500 ${isPaused ? "opacity-30" : "animate-pulse"}`}
                style={{
                  height: `${Math.random() * 20 + 8}px`,
                  animationDelay: `${i * 0.05}s`,
                  animationDuration: `${0.4 + Math.random() * 0.4}s`,
                }}
              />
            ))}
          </div>

          {/* Timer */}
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span className={`font-mono font-bold text-base ${isPaused ? "text-gray-400" : "text-red-500"}`}>
              {formatTime(duration)}
            </span>
            <span className="text-gray-400">{formatTime(MAX_SECONDS)} max</span>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-100 rounded-full h-1.5">
            <div
              className="bg-red-500 h-1.5 rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Controls */}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={isPaused ? resumeRecording : pauseRecording}
              className="flex-1 h-11 rounded-xl border-2 border-gray-200 text-sm font-semibold text-gray-700 flex items-center justify-center gap-2"
            >
              {isPaused ? (
                <>
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                  Resume
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                  </svg>
                  Pause
                </>
              )}
            </button>

            <button
              type="button"
              onClick={stopRecording}
              className="flex-1 h-11 rounded-xl bg-red-500 text-white text-sm font-semibold flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 6h12v12H6z" />
              </svg>
              Stop
            </button>
          </div>
        </div>
      )}

      {/* Playback UI */}
      {!isRecording && audioUrl && (
        <div className="space-y-3">
          <div className="bg-green-50 border border-green-200 rounded-xl p-3 flex items-center gap-3">
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shrink-0">
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 15c1.66 0 3-1.34 3-3V6c0-1.66-1.34-3-3-3S9 4.34 9 6v6c0 1.66 1.34 3 3 3z" />
                <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-xs font-semibold text-green-700">Recording saved</p>
              <p className="text-xs text-green-600">{formatTime(duration)} recorded</p>
            </div>
          </div>

          <audio controls src={audioUrl} className="w-full h-10 rounded-xl" />

          <button
            type="button"
            onClick={deleteRecording}
            className="w-full h-10 rounded-xl border-2 border-red-200 text-red-500 text-sm font-semibold flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Delete Recording
          </button>
        </div>
      )}

      {/* Start Button */}
      {!isRecording && !audioUrl && (
        <button
          type="button"
          onClick={startRecording}
          className="w-full h-12 rounded-xl bg-black text-white text-sm font-semibold flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 15c1.66 0 3-1.34 3-3V6c0-1.66-1.34-3-3-3S9 4.34 9 6v6c0 1.66 1.34 3 3 3z" />
            <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
          </svg>
          Start Recording
        </button>
      )}
    </div>
  );
}

// ── Main StepThree ───────────────────────────────────────
export default function StepThree({ details, setDetails, onBack, onNext }) {
  const [errors, setErrors] = useState({});
  const [brandInput, setBrandInput] = useState("");

  const updateField = (field, value) => {
    setDetails((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const addBranchAddress = () => {
    setDetails((prev) => ({
      ...prev,
      branchAddresses: [...prev.branchAddresses, ""],
    }));
  };

  const updateBranchAddress = (index, value) => {
    const updated = [...details.branchAddresses];
    updated[index] = value;
    setDetails((prev) => ({ ...prev, branchAddresses: updated }));
  };

  const removeBranchAddress = (index) => {
    const updated = details.branchAddresses.filter((_, i) => i !== index);
    setDetails((prev) => ({ ...prev, branchAddresses: updated.length ? updated : [""] }));
  };

  // ── Brand Tags ───────────────────────────────────────
  const addBrand = () => {
    const trimmed = brandInput.trim();
    if (!trimmed) return;
    if ((details.brands || []).includes(trimmed)) {
      setBrandInput("");
      return;
    }
    setDetails((prev) => ({
      ...prev,
      brands: [...(prev.brands || []), trimmed],
    }));
    setBrandInput("");
  };

  const removeBrand = (brand) => {
    setDetails((prev) => ({
      ...prev,
      brands: (prev.brands || []).filter((b) => b !== brand),
    }));
  };

  const handleBrandKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addBrand();
    }
  };

  // ── Voice Recording ──────────────────────────────────
  const handleRecordingComplete = (blob, url) => {
    setDetails((prev) => ({
      ...prev,
      voiceBlob: blob,
      voiceUrl: url,
    }));
  };

  // ── Validation ───────────────────────────────────────
  const validate = () => {
    const newErrors = {};

    if (details.website?.trim() && !/^https?:\/\/.+\..+/.test(details.website.trim())) {
      newErrors.website = "Enter a valid URL (e.g. https://yourgym.com)";
    }

    if (details.email?.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(details.email.trim())) {
      newErrors.email = "Enter a valid email address";
    }

    if (
      details.alternatePhone?.trim() &&
      !/^[6-9]\d{9}$/.test(details.alternatePhone.replace(/\s/g, ""))
    ) {
      newErrors.alternatePhone = "Enter a valid 10-digit phone number";
    }

    if (details.hasBranches) {
      if (!details.numberOfBranches) {
        newErrors.numberOfBranches = "Please enter number of branches";
      }
      details.branchAddresses.forEach((addr, i) => {
        if (!addr.trim()) {
          newErrors[`branch_${i}`] = `Branch ${i + 1} address is required`;
        }
      });
    }

    if (details.providesSupplements && !(details.brands || []).length) {
      newErrors.brands = "Add at least one brand name";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validate()) onNext();
  };

  const inputClass = (field) =>
    `w-full border-2 rounded-xl px-4 h-12 text-black outline-none transition-colors bg-white ${
      errors[field] ? "border-red-400 bg-red-50" : "border-gray-200 focus:border-gray-800"
    }`;

  const textareaClass = (field) =>
    `w-full border-2 rounded-xl p-3 text-black outline-none transition-colors bg-white resize-none ${
      errors[field] ? "border-red-400 bg-red-50" : "border-gray-200 focus:border-gray-800"
    }`;

  const ErrorMsg = ({ field }) =>
    errors[field] ? (
      <p className="text-red-500 text-xs mt-1 ml-1">{errors[field]}</p>
    ) : null;

  const labelClass = "block text-sm font-bold mb-2 text-black";

  return (
    <div className="min-h-screen max-w-md mx-auto bg-gray-50 flex flex-col">
      <StepHeader step={3} title="Additional Details" onBack={onBack} />

      <div className="flex-1 px-5 py-6 space-y-5 overflow-y-auto">

        {/* Website */}
        <div>
          <label className={labelClass}>Gym Website URL</label>
          <input
            type="url"
            value={details.website}
            onChange={(e) => updateField("website", e.target.value)}
            placeholder="https://yourgym.com"
            className={inputClass("website")}
          />
          <ErrorMsg field="website" />
        </div>

        {/* Email */}
        <div>
          <label className={labelClass}>Gym Email ID</label>
          <input
            type="email"
            value={details.email}
            onChange={(e) => updateField("email", e.target.value)}
            placeholder="gym@email.com"
            className={inputClass("email")}
          />
          <ErrorMsg field="email" />
        </div>

        {/* Alternate Phone */}
        <div>
          <label className={labelClass}>Alternative Phone Number</label>
          <input
            type="tel"
            value={details.alternatePhone}
            onChange={(e) => {
              const val = e.target.value.replace(/[^0-9]/g, "");
              updateField("alternatePhone", val);
            }}
            placeholder="9876543210"
            maxLength={10}
            className={inputClass("alternatePhone")}
          />
          <ErrorMsg field="alternatePhone" />
        </div>

        {/* Branches */}
        <div className="bg-white border-2 border-gray-200 rounded-2xl p-4">
          <label className="flex items-center gap-3 cursor-pointer">
            <div
              onClick={() => updateField("hasBranches", !details.hasBranches)}
              className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                details.hasBranches ? "bg-black" : "bg-gray-300"
              }`}
            >
              <div
                className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                  details.hasBranches ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </div>
            <span className="text-sm font-bold text-black">
              Does your gym have branches?
            </span>
          </label>

          {details.hasBranches && (
            <div className="mt-4 space-y-3">
              <div>
                <input
                  type="number"
                  placeholder="Number of branches"
                  value={details.numberOfBranches}
                  onChange={(e) => updateField("numberOfBranches", e.target.value)}
                  className={inputClass("numberOfBranches")}
                />
                <ErrorMsg field="numberOfBranches" />
              </div>

              {details.branchAddresses.map((address, index) => (
                <div key={index}>
                  <div className="flex gap-2 items-start">
                    <textarea
                      rows={2}
                      value={address}
                      placeholder={`Branch ${index + 1} address`}
                      onChange={(e) => updateBranchAddress(index, e.target.value)}
                      className={`flex-1 border-2 rounded-xl p-3 text-black outline-none transition-colors bg-white resize-none text-sm ${
                        errors[`branch_${index}`]
                          ? "border-red-400 bg-red-50"
                          : "border-gray-200 focus:border-gray-800"
                      }`}
                    />
                    {details.branchAddresses.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeBranchAddress(index)}
                        className="w-9 h-9 mt-1 rounded-xl bg-red-50 text-red-500 flex items-center justify-center shrink-0"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    )}
                  </div>
                  {errors[`branch_${index}`] && (
                    <p className="text-red-500 text-xs mt-1 ml-1">{errors[`branch_${index}`]}</p>
                  )}
                </div>
              ))}

              <button
                type="button"
                onClick={addBranchAddress}
                className="w-full h-10 rounded-xl border-2 border-dashed border-gray-300 text-sm font-semibold text-gray-600 flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                Add Branch Address
              </button>
            </div>
          )}
        </div>

        {/* Supplements / Brands */}
        <div className="bg-white border-2 border-gray-200 rounded-2xl p-4">
          <label className="flex items-center gap-3 cursor-pointer">
            <div
              onClick={() => updateField("providesSupplements", !details.providesSupplements)}
              className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                details.providesSupplements ? "bg-black" : "bg-gray-300"
              }`}
            >
              <div
                className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                  details.providesSupplements ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </div>
            <span className="text-sm font-bold text-black">
              Do you promote or provide supplements?
            </span>
          </label>

          {details.providesSupplements && (
            <div className="mt-4 space-y-3">
              {/* Brand Tags */}
              {(details.brands || []).length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {(details.brands || []).map((brand) => (
                    <div
                      key={brand}
                      className="flex items-center gap-1.5 bg-black text-white text-xs font-semibold px-3 py-1.5 rounded-full"
                    >
                      {brand}
                      <button
                        type="button"
                        onClick={() => removeBrand(brand)}
                        className="text-white/70 hover:text-white"
                      >
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Brand Input */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={brandInput}
                  onChange={(e) => setBrandInput(e.target.value)}
                  onKeyDown={handleBrandKeyDown}
                  placeholder="e.g. MuscleBlaze, Optimum..."
                  className={`flex-1 border-2 rounded-xl px-4 h-11 text-black text-sm outline-none transition-colors bg-white ${
                    errors.brands ? "border-red-400 bg-red-50" : "border-gray-200 focus:border-gray-800"
                  }`}
                />
                <button
                  type="button"
                  onClick={addBrand}
                  className="h-11 px-4 bg-black text-white rounded-xl text-sm font-bold shrink-0"
                >
                  Add
                </button>
              </div>
              <p className="text-xs text-gray-400">Press Enter or comma to add multiple brands</p>
              <ErrorMsg field="brands" />
            </div>
          )}
        </div>

        {/* Voice Recording */}
        <VoiceRecorder
          onRecordingComplete={handleRecordingComplete}
          existingRecording={details.voiceUrl}
        />

        {/* Note */}
        <div>
          <label className={labelClass}>Additional Note</label>
          <textarea
            rows={4}
            value={details.note}
            onChange={(e) => updateField("note", e.target.value)}
            placeholder="Any optional information..."
            className={textareaClass("note")}
          />
        </div>

        {/* Info */}
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
          <p className="text-xs text-blue-700">
            ℹ️ All fields are optional. Adding more details improves gym listing quality.
          </p>
        </div>

        {/* Button */}
        <button
          type="button"
          onClick={handleNext}
          className="w-full h-14 bg-black text-white rounded-2xl font-bold"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
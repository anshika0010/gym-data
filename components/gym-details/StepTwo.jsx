"use client";

import { useState } from "react";
import StepHeader from "./StepHeader";
import OptionChip from "./OptionChip";
import {
  MEMBER_OPTIONS,
  VISIT_OPTIONS,
  AGE_OPTIONS,
  GENDER_OPTIONS,
  GYM_TYPE_OPTIONS,
} from "./constants";

export default function StepTwo({ stats, setStats, onBack, onNext }) {
  const [errors, setErrors] = useState({});

  const updateField = (field, value) => {
    setStats((prev) => ({ ...prev, [field]: value }));
    // Clear error on select
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!stats.members)
      newErrors.members = "Please select number of active members";

    if (!stats.visits)
      newErrors.visits = "Please select average daily visits";

    if (!stats.ageGroup)
      newErrors.ageGroup = "Please select primary age group";

    if (!stats.gender)
      newErrors.gender = "Please select gender majority";

    if (!stats.gymType)
      newErrors.gymType = "Please select gym type";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validate()) onNext();
  };

  const ErrorMsg = ({ field }) =>
    errors[field] ? (
      <p className="text-red-500 text-xs mt-1">{errors[field]}</p>
    ) : null;

  const SectionTitle = ({ children }) => (
    <p className="text-sm font-bold text-gray-900 mb-3">{children}</p>
  );

  return (
    <div className="min-h-screen max-w-md mx-auto bg-gray-50 rounded-[32px] flex flex-col">
      <StepHeader step={2} title="Gym statistics" onBack={onBack} />

      <div className="flex-1 px-5 pt-6 pb-8 overflow-y-auto space-y-6">

        {/* Members */}
        <div>
          <SectionTitle>Number of active members</SectionTitle>
          <div className="flex flex-wrap gap-2 text-gray-600">
            {MEMBER_OPTIONS.map((item) => (
              <OptionChip
                key={item}
                label={item}
                selected={stats.members === item}
                onClick={() => updateField("members", item)}
              />
            ))}
          </div>
          <ErrorMsg field="members" />
        </div>

        {/* Visits */}
        <div>
          <SectionTitle>Average daily visits</SectionTitle>
          <div className="flex flex-wrap gap-2 text-gray-600">
            {VISIT_OPTIONS.map((item) => (
              <OptionChip
                key={item}
                label={item}
                selected={stats.visits === item}
                onClick={() => updateField("visits", item)}
              />
            ))}
          </div>
          <ErrorMsg field="visits" />
        </div>

        {/* Age Group */}
        <div>
          <SectionTitle>Primary age group</SectionTitle>
          <div className="flex flex-wrap gap-2 text-gray-600">
            {AGE_OPTIONS.map((item) => (
              <OptionChip
                key={item}
                label={item}
                selected={stats.ageGroup === item}
                onClick={() => updateField("ageGroup", item)}
              />
            ))}
          </div>
          <ErrorMsg field="ageGroup" />
        </div>

        {/* Gender */}
        <div>
          <SectionTitle>Gender majority</SectionTitle>
          <div className="grid grid-cols-2 gap-2 mb-2">
            {GENDER_OPTIONS.slice(0, 2).map((gender) => (
              <button
                key={gender.id}
                type="button"
                onClick={() => updateField("gender", gender.id)}
                className={`h-12 rounded-xl border-2 text-sm font-semibold transition-all ${
                  stats.gender === gender.id
                    ? "bg-gray-800 border-gray-800 text-white"
                    : errors.gender
                    ? "bg-red-50 border-red-400 text-gray-900"
                    : "bg-gray-50 border-gray-200 text-gray-900"
                }`}
              >
                {gender.label}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => updateField("gender", "equally")}
            className={`w-full h-12 rounded-xl border-2 text-sm font-semibold transition-all ${
              stats.gender === "equally"
                ? "bg-gray-800 border-gray-800 text-white"
                : errors.gender
                ? "bg-red-50 border-red-400 text-gray-900"
                : "bg-gray-50 border-gray-200 text-gray-900"
            }`}
          >
            Equally
          </button>
          <ErrorMsg field="gender" />
        </div>

        {/* Gym Type */}
        <div>
          <SectionTitle>Gym type</SectionTitle>
          <div className="flex flex-wrap gap-2 text-gray-600">
            {GYM_TYPE_OPTIONS.map((item) => (
              <OptionChip
                key={item}
                label={item}
                selected={stats.gymType === item}
                onClick={() => updateField("gymType", item)}
              />
            ))}
          </div>
          <ErrorMsg field="gymType" />
        </div>

        {/* Next */}
        <button
          type="button"
          onClick={handleNext}
          className="w-full h-14 bg-gray-800 text-white text-base font-bold rounded-2xl hover:bg-gray-900 transition-all"
        >
          Next
        </button>
      </div>
    </div>
  );
}
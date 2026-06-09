"use client";

// ─── ICONS ──────────────────────────────────────────────
const IconBuilding = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={1.6}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3.75 21h16.5M4.5 3h15l.75 18H3.75L4.5 3zM9 21V9h6v12M9 3v6m6-6v6"
    />
  </svg>
);

const IconArrowLeft = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
    />
  </svg>
);

// ─── COMPONENT ──────────────────────────────────────────
export default function StepHeader({
  step,
  title,
  onBack,
}) {
  const colors = [
    "bg-gray-900",
    "bg-gray-900",
    "bg-gray-900",
    "bg-gray-900",
    "bg-gray-900",
    "bg-gray-900",
    "bg-gray-900",
  ];

  const bg = colors[step - 1] || "bg-gray-800";

  const StepIcon = () => {
    if (step === 1) return <IconBuilding />;

    if (step === 2)
      return (
        <svg
          className="w-6 h-6 text-white"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.6}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"
          />
        </svg>
      );

    if (step === 3)
      return (
        <svg
          className="w-6 h-6 text-white"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.6}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z"
          />
        </svg>
      );

    if (step === 4)
      return (
        <svg
          className="w-6 h-6 text-white"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.6}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 8.25h3"
          />
        </svg>
      );

    return null;
  };

  return (
    <div className={`${bg} px-5 pt-12 pb-6`}>
      <div className="flex items-center gap-3 mb-4">
        {onBack ? (
          <button
            type="button"
            onClick={onBack}
            className="w-9 h-9 rounded-[12px] bg-white/20 flex items-center justify-center text-white hover:bg-white/30 transition-colors"
            aria-label="Go back"
          >
            <IconArrowLeft />
          </button>
        ) : (
          <div className="w-11 h-11 rounded-[14px] bg-white/20 flex items-center justify-center text-white">
            <StepIcon />
          </div>
        )}

        <div>
          <p className="text-white/70 text-xs">
            Step {step} of 7
          </p>
          <p className="text-white text-lg font-bold">
            {title}
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="flex gap-2">
        {[1, 2, 3, 4, 5, 6, 7].map((n) => (
          <div
            key={n}
            className={`flex-1 h-1.5 rounded-full transition-all duration-300 ${
              n <= step
                ? "bg-white"
                : "bg-white/30"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
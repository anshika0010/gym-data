export default function OptionChip({
  label,
  selected,
  onClick,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-4 py-2 rounded-xl border-2 text-sm font-semibold
      ${
        selected
          ? "bg-gray-800 border-gray-800 text-white"
          : "bg-gray-50 border-gray-200"
      }`}
    >
      {label}
    </button>
  );
}
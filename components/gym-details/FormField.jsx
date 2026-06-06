"use client";

export default function FormField({
  label,
  id,
  icon,
  type = "text",
  placeholder,
  value,
  onChange,
}) {
  return (
    <div className="mb-4">
      <label
        htmlFor={id}
        className="block text-[11px] font-bold text-gray-800 mb-2 tracking-widest uppercase"
      >
        {label}
      </label>

      <div className="flex items-center border-2 border-gray-200 rounded-xl px-3 h-12 bg-gray-50 gap-2.5 focus-within:border-gray-700 transition-colors">
        <span className="text-gray-600 shrink-0">
          {icon}
        </span>

        <input
          id={id}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className="border-none bg-transparent text-sm text-gray-900 outline-none flex-1 placeholder:text-gray-300"
        />
      </div>
    </div>
  );
}
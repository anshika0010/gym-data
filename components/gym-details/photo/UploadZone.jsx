"use client";

export default function UploadZone({
  onClick,
  onDrop,
  onDragOver,
  onDragLeave,
  isDragging,
  hasPhotos,
}) {
  return (
    <div
      className={`mx-4 my-3 border-2 border-dashed rounded-xl transition-all ${
        isDragging
          ? "border-gray-700 bg-gray-100"
          : "border-gray-300 bg-gray-50"
      }`}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
    >
      <div
        role="button"
        onClick={onClick}
        className="w-full py-4 flex flex-col items-center gap-2 text-gray-500 hover:text-gray-800 cursor-pointer"
      >
        <span className="text-xs font-semibold">
          {hasPhotos
            ? "Add more photos"
            : "Tap to upload or drag & drop"}
        </span>

        <span className="text-[11px] text-gray-600">
          JPG, PNG, WEBP
        </span>
      </div>
    </div>
  );
}
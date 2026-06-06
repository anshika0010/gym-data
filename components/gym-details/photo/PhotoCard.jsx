"use client";

import UploadZone from "./UploadZone";

export default function PhotoCard({
  category,
  photos,
  fileInputRef,
  dragOver,
  setDragOver,
  addFiles,
  removePhoto,
  isUploading,
  uploadingCount,
}) {
  const categoryPhotos = photos[category.id] || [];

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(null);
    addFiles(category.id, e.dataTransfer.files);
  };

  return (
    <div className="bg-white border-2 border-gray-100 rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="flex justify-between max-w-md mx-auto items-center px-4 py-4 border-b">
        <div>
          <div className="flex items-center gap-2">
            <span>{category.icon}</span>

            <p className="font-bold text-sm text-gray-900">
              {category.label}
            </p>

            {category.required && (
              <span className="text-[10px] bg-red-100 text-red-600 px-2 py-1 rounded-full">
                Required
              </span>
            )}

            {/* Loading badge */}
            {isUploading && (
              <div className="flex items-center gap-1 bg-blue-50 text-blue-600 text-[10px] font-semibold px-2 py-1 rounded-full">
                <svg
                  className="animate-spin h-3 w-3"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12" cy="12" r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z"
                  />
                </svg>
                {uploadingCount} uploading
              </div>
            )}
          </div>

          <p className="text-xs text-gray-400 mt-1">
            {category.desc}
          </p>
        </div>

        <span className="text-xs bg-gray-100 px-2 py-1 text-gray-900 rounded-full">
          {categoryPhotos.length}/5
        </span>
      </div>

      {/* Preview */}
      {categoryPhotos.length > 0 && (
        <div className="flex gap-2 px-4 pt-3 overflow-x-auto">
          {categoryPhotos.map((file, index) => (
            <div
              key={index}
              className="relative w-20 h-20 shrink-0 rounded-xl overflow-hidden"
            >
              <img
                src={file}
                alt=""
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={() => removePhoto(category.id, index)}
                className="absolute top-1 right-1 bg-black/70 text-white w-5 h-5 rounded-full text-xs"
              >
                ✕
              </button>
            </div>
          ))}

          {/* Uploading placeholder thumbnails */}
          {isUploading &&
            Array.from({ length: uploadingCount }).map((_, i) => (
              <div
                key={`uploading-${i}`}
                className="relative w-20 h-20 shrink-0 rounded-xl overflow-hidden bg-blue-50 border-2 border-blue-200 border-dashed flex items-center justify-center"
              >
                <svg
                  className="animate-spin h-6 w-6 text-blue-400"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12" cy="12" r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z"
                  />
                </svg>
              </div>
            ))}
        </div>
      )}

      {/* Uploading placeholders jab koi photo nahi hai abhi tak */}
      {categoryPhotos.length === 0 && isUploading && (
        <div className="flex gap-2 px-4 pt-3 overflow-x-auto">
          {Array.from({ length: uploadingCount }).map((_, i) => (
            <div
              key={`uploading-empty-${i}`}
              className="relative w-20 h-20 shrink-0 rounded-xl overflow-hidden bg-blue-50 border-2 border-blue-200 border-dashed flex items-center justify-center"
            >
              <svg
                className="animate-spin h-6 w-6 text-blue-400"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12" cy="12" r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z"
                />
              </svg>
            </div>
          ))}
        </div>
      )}

      {/* Upload Zone */}
      {categoryPhotos.length < 5 && (
        <UploadZone
          hasPhotos={categoryPhotos.length > 0}
          isDragging={dragOver === category.id}
          onClick={() => fileInputRef.current[category.id]?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(category.id);
          }}
          onDragLeave={() => setDragOver(null)}
          onDrop={handleDrop}
        />
      )}

      <input
        ref={(el) => (fileInputRef.current[category.id] = el)}
        type="file"
        multiple
        accept="image/*"
        className="hidden"
        onChange={(e) => addFiles(category.id, e.target.files)}
      />
    </div>
  );
}
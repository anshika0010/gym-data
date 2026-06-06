"use client";

import { useRef, useState } from "react";
import StepHeader from "./StepHeader";
import PhotoCard from "./photo/PhotoCard";
import { PHOTO_CATEGORIES } from "./constants";

const uploadToCloudinary = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "gym_uploads");

  const res = await fetch(
    "https://api.cloudinary.com/v1_1/dby0jlqbg/image/upload",
    { method: "POST", body: formData }
  );

  const data = await res.json();
  return data.secure_url;
};

export default function StepFour({ photos, setPhotos, onBack, onSubmit }) {
  const fileInputRef = useRef({});
  const [dragOver, setDragOver] = useState(null);

  // { categoryId: number } — kitni photos us category mein upload ho rahi hain
  const [uploadingCount, setUploadingCount] = useState({});

  const addFiles = async (categoryId, files) => {
    const imageFiles = Array.from(files).filter((f) =>
      f.type.startsWith("image/")
    );
    if (!imageFiles.length) return;

    // Loading start — kitni files upload ho rahi hain track karo
    setUploadingCount((prev) => ({
      ...prev,
      [categoryId]: (prev[categoryId] || 0) + imageFiles.length,
    }));

    try {
      const uploadedUrls = await Promise.all(
        imageFiles.map((file) => uploadToCloudinary(file))
      );

      setPhotos((prev) => {
        const current = prev[categoryId] || [];
        return {
          ...prev,
          [categoryId]: [...current, ...uploadedUrls].slice(0, 5),
        };
      });
    } catch (err) {
      console.error("Upload failed:", err);
    } finally {
      // Loading clear — us category ki count kam karo
      setUploadingCount((prev) => {
        const updated = { ...prev };
        updated[categoryId] = Math.max(
          0,
          (updated[categoryId] || 0) - imageFiles.length
        );
        if (updated[categoryId] === 0) delete updated[categoryId];
        return updated;
      });
    }
  };

  const removePhoto = (categoryId, index) => {
    setPhotos((prev) => {
      const updated = [...(prev[categoryId] || [])];
      updated.splice(index, 1);
      return { ...prev, [categoryId]: updated };
    });
  };

  const totalUploaded = Object.values(photos).reduce(
    (acc, item) => acc + (item?.length || 0),
    0
  );

  const isAnyUploading = Object.values(uploadingCount).some((c) => c > 0);

  const requiredDone =
    !isAnyUploading &&
    PHOTO_CATEGORIES.filter((c) => c.required).every(
      (c) => (photos[c.id]?.length || 0) > 0
    );

  return (
    <div className="min-h-screen max-w-md mx-auto bg-gray-50 flex flex-col">
      <StepHeader step={4} title="Gym Photos" onBack={onBack} />

      <div className="flex-1 px-5 py-6 space-y-5 overflow-y-auto">

        {/* Summary */}
        <div className="bg-white border border-gray-200 rounded-2xl p-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500 font-medium">Photos uploaded</p>
            <p className="text-lg font-bold text-gray-900">{totalUploaded}</p>
          </div>

          {isAnyUploading && (
            <div className="flex items-center gap-2 text-blue-600 text-sm font-medium">
              {/* Spinner */}
              <svg
                className="animate-spin h-4 w-4"
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
              Uploading...
            </div>
          )}
        </div>

        {/* Categories */}
        {PHOTO_CATEGORIES.map((category) => (
          <PhotoCard
            key={category.id}
            category={category}
            photos={photos}
            dragOver={dragOver}
            setDragOver={setDragOver}
            fileInputRef={fileInputRef}
            addFiles={addFiles}
            removePhoto={removePhoto}
            isUploading={!!(uploadingCount[category.id] > 0)}
            uploadingCount={uploadingCount[category.id] || 0}
          />
        ))}

        {/* Submit */}
        <button
          type="button"
          onClick={onSubmit}
          disabled={!requiredDone || isAnyUploading}
          className={`w-full h-14 rounded-2xl font-bold transition-all flex items-center justify-center gap-2 ${
            requiredDone && !isAnyUploading
              ? "bg-gray-800 text-white hover:bg-gray-900"
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
          }`}
        >
          {isAnyUploading ? (
            <>
              <svg
                className="animate-spin h-5 w-5"
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
              Uploading photos...
            </>
          ) : (
            "Submit Details"
          )}
        </button>

      </div>
    </div>
  );
}
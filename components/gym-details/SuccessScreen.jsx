"use client";

import Link from "next/link";

export default function SuccessScreen({ gymName, onRestart }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-lg border border-gray-100 p-6 sm:p-8">
        
        {/* Success Icon */}
        <div className="flex justify-center">
          <div className="w-20 h-20 sm:w-24 sm:h-24 bg-green-100 rounded-full flex items-center justify-center">
            <span className="text-4xl sm:text-5xl">✅</span>
          </div>
        </div>

        {/* Heading */}
        <div className="text-center mt-5">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Gym Registered!
          </h1>

          <p className="text-sm sm:text-base text-gray-600 mt-3 break-words">
            <span className="font-semibold text-gray-800">
              {gymName}
            </span>{" "}
            has been successfully submitted.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col gap-3">
          <Link
            href="/"
            className="w-full h-12 sm:h-14 flex items-center justify-center rounded-xl bg-gray-800 text-white font-semibold hover:bg-gray-900 transition-all duration-300"
          >
            Go to Dashboard
          </Link>

          <button
            onClick={onRestart}
            className="w-full h-12 sm:h-14 rounded-xl border-2 border-gray-300 bg-white text-gray-700 font-semibold hover:bg-gray-50 transition-all duration-300"
          >
            Register Another Gym
          </button>
        </div>
      </div>
    </div>
  );
}
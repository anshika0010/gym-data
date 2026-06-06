"use client";

import Link from "next/link";

export default function SuccessScreen({ gymName, onRestart }) {
  return (
    <div className="min-h-screen w-full max-w-md mx-auto bg-gray-50 flex items-center justify-center px-6">
      
      <div className="text-center">

        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-3xl">✅</span>
        </div>

        <h1 className="text-xl font-bold text-gray-900">
          Gym Registered!
        </h1>

        <p className="text-sm text-gray-900 mt-2">
          {gymName} successfully submitted
        </p>
<Link href="/"  className="mt-6 w-full h-12 bg-gray-800 text-white rounded-xl font-bold">
          Go to Dashboard
        </Link> 
        <button
          onClick={onRestart}
          className="mt-6 w-full h-12 bg-gray-800 text-white rounded-xl font-bold"
        >
        Register Another Gym
        </button>

      </div>
    </div>
  );
}
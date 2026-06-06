"use client";

import Image from "next/image";

export default function SplashScreen() {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center">
      <div className="text-center">
        <div className="w-28 h-28 mx-auto rounded-full bg-white flex items-center justify-center animate-pulse shadow-2xl">
        <Image
  src="/Analytics Illustration.jpeg"
  alt="Gym Data Collector Logo"
  width={48}
  height={48}
  className="w-20 h-20 object-contain"
/>
        </div>

        <h1 className="text-white text-3xl font-bold mt-6">
          Gym Data Collector 
        </h1>

        <div className="flex justify-center mt-5 gap-2">
          <span className="w-3 h-3 bg-white rounded-full animate-bounce"></span>
          <span
            className="w-3 h-3 bg-white rounded-full animate-bounce"
            style={{ animationDelay: "0.2s" }}
          ></span>
          <span
            className="w-3 h-3 bg-white rounded-full animate-bounce"
            style={{ animationDelay: "0.4s" }}
          ></span>
        </div>
      </div>
    </div>
  );
}
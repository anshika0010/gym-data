"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import HeroSection from "@/components/HeroSection";
import TaskStats from "@/components/TaskStats";
import SplashScreen from "@/components/SplashScreen";

import {
  Home,
  User,
  LogOut,
  Plus,
} from "lucide-react";

export default function GroceryHomePage() {
  const router = useRouter();

  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showSplash, setShowSplash] = useState(true);

  // Splash Screen (3 Seconds)
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  // Auth Check
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.replace("/sign-in");
      return;
    }

    const user = localStorage.getItem("user");

    if (user) {
      setUserData(JSON.parse(user));
    }

    setLoading(false);
  }, [router]);

  // Logout Function
  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token");

      await axios.post(
        "https://gym.earthmaafoods.com/api/v1/agent/logout",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );
    } catch (error) {
      console.log("Logout Error:", error.response?.data);
    }

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    router.replace("/sign-in");
  };

  // Show Splash First
  if (showSplash) {
    return <SplashScreen />;
  }

  // Wait For Auth Check
  if (loading) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#f4f5ef] flex justify-center">
      <div className="w-full max-w-md bg-[#f4f5ef] relative overflow-hidden">

        {/* HEADER */}
        <div className="bg-black px-5 pt-4 pb-6 text-white rounded-b-[32px]">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-gray-100">
                Hello
              </p>

              <h2 className="text-lg font-semibold leading-tight">
                {userData?.name || "User"}
              </h2>
            </div>

            <h1 className="text-xl mt-2 font-semibold text-center text-gray-100">
              Dashboard
            </h1>
          </div>
        </div>

        {/* MAIN CONTENT */}
        <div className="px-4 pt-2 pb-24">
          <HeroSection />

          <Link href="/add-details">
            <button className="w-full mt-5 bg-gray-900 text-white py-5 rounded-2xl font-semibold flex items-center justify-center gap-3 text-lg">
              ADD GYM DETAILS
            </button>
          </Link>

          <TaskStats />
        </div>

        {/* BOTTOM NAVBAR */}
        <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md px-4 pb-5">
          <div className="bg-[#f6f7f1] border border-[#b9d08e] rounded-[24px] py-3 px-6 flex items-center justify-between shadow-sm">

            {/* Home */}
            <Link
              href="/"
              className="flex flex-col items-center text-[#3d730d]"
            >
              <Home size={22} />
              <span className="text-xs mt-1">
                Home
              </span>
            </Link>

            {/* Add Gym */}
            <Link
              href="/add-details"
              className="flex flex-col items-center text-gray-500"
            >
              <Plus size={22} />
              <span className="text-xs mt-1">
                Add
              </span>
            </Link>

            {/* Profile */}
            <Link
              href="/profile"
              className="flex flex-col items-center text-gray-500"
            >
              <User size={22} />
              <span className="text-xs mt-1">
                Profile
              </span>
            </Link>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="flex flex-col items-center text-red-600"
            >
              <LogOut size={22} />
              <span className="text-xs mt-1">
                Logout
              </span>
            </button>

          </div>
        </div>

      </div>
    </div>
  );
}
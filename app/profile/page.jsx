"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Mail, Phone, User, Home, LogOut, Plus } from "lucide-react";

export default function ProfilePage() {
  const [userData, setUserData] = useState(null);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", phone: "" });
  const [originalData, setOriginalData] = useState({});

  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");

    if (!token) {
      router.replace("/sign-in");
      return;
    }

    if (user) {
      const parsed = JSON.parse(user);
      setUserData(parsed);
      setFormData({
        name: parsed.name || "",
        email: parsed.email || "",
        phone: parsed.phone || "",
      });
    }

    setCheckingAuth(false);
  }, [router]);

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "https://gym.earthmaafoods.com/api/v1/agent/logout",
        {},
        { headers: { Authorization: `Bearer ${token}`, Accept: "application/json" } }
      );
    } catch (error) {
      console.log("Logout Error:", error.response?.data);
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      router.replace("/sign-in");
    }
  };

  const handleEditClick = () => {
    setOriginalData({ ...formData }); // backup for cancel
    setIsEditing(true);
  };

  const handleCancel = () => {
    setFormData({ ...originalData }); // restore original
    setIsEditing(false);
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      const token = localStorage.getItem("token");

      await axios.post(
        "https://gym.earthmaafoods.com/api/v1/agent/profile-update",
        {
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      // Update localStorage
      const updatedUser = { ...userData, ...formData };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUserData(updatedUser);

      setIsEditing(false);
    } catch (error) {
      console.log("Update Error:", error.response?.data);
      alert(error.response?.data?.message || "Profile update failed.");
    } finally {
      setIsSaving(false);
    }
  };

  if (checkingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center">Loading...</div>
    );
  }

  const fields = [
    { key: "name", label: "Full Name", icon: <User size={20} />, iconBg: "bg-black", type: "text" },
    { key: "email", label: "Email Address", icon: <Mail size={20} />, iconBg: "bg-blue-500", type: "email" },
    { key: "phone", label: "Phone Number", icon: <Phone size={20} />, iconBg: "bg-green-500", type: "tel" },
  ];

  return (
    <div className="min-h-screen bg-[#f4f5ef] flex justify-center p-4 pb-28">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="bg-black text-white rounded-b-[30px] px-6 py-8 text-center">
          <div className="w-24 h-24 mx-auto rounded-full bg-white/10 border-4 border-white flex items-center justify-center">
            <User size={42} />
          </div>
          <h2 className="text-2xl font-bold mt-4">{formData.name || "User"}</h2>
          <p className="text-gray-300 text-sm">Gym Agent Profile</p>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-3xl shadow-md p-5 mt-6">
          <h3 className="text-lg text-gray-900 font-semibold mb-5">Personal Information</h3>

          {fields.map(({ key, label, icon, iconBg, type }) => (
            <div key={key} className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl mb-4">
              <div className={`w-12 h-12 rounded-xl ${iconBg} text-white flex items-center justify-center`}>
                {icon}
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-500">{label}</p>
                {isEditing ? (
                  <input
                    type={type}
                    value={formData[key]}
                    onChange={(e) => setFormData((prev) => ({ ...prev, [key]: e.target.value }))}
                    className="w-full bg-transparent border-b-2 border-black font-semibold text-gray-900 outline-none pb-0.5 text-sm"
                  />
                ) : (
                  <p className="font-semibold text-gray-900">{formData[key] || "-"}</p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Buttons */}
        {!isEditing ? (
          <button
            onClick={handleEditClick}
            className="w-full mt-6 bg-black text-white py-4 rounded-2xl font-semibold hover:opacity-90 transition"
          >
            Edit Profile
          </button>
        ) : (
          <div className="flex flex-col gap-3 mt-6">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="w-full bg-green-600 text-white py-4 rounded-2xl font-semibold hover:opacity-90 transition disabled:opacity-60"
            >
              {isSaving ? "Saving..." : "Save Changes"}
            </button>
            <button
              onClick={handleCancel}
              className="w-full bg-gray-100 text-gray-700 py-4 rounded-2xl font-semibold hover:opacity-90 transition"
            >
              Cancel
            </button>
          </div>
        )}
      </div>

      {/* Bottom Navbar */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-sm px-4 pb-5">
        <div className="bg-[#f6f7f1] border border-[#b9d08e] rounded-[24px] py-3 px-6 flex items-center justify-between shadow-sm">
          <Link href="/" className="flex flex-col items-center text-[#3d730d]">
            <Home size={22} />
            <span className="text-xs mt-1">Home</span>
          </Link>
          <Link href="/add-details" className="flex flex-col items-center text-gray-500">
            <Plus size={22} />
            <span className="text-xs mt-1">ADD</span>
          </Link>
          <Link href="/profile" className="flex flex-col items-center text-gray-500">
            <User size={22} />
            <span className="text-xs mt-1">Profile</span>
          </Link>
          <button onClick={handleLogout} className="flex flex-col items-center text-red-600">
            <LogOut size={22} />
            <span className="text-xs mt-1">Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
}
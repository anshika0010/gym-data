"use client";

import { useState } from "react";
import axios from "axios";

import StepOne from "../../components/gym-details/StepOne";
import StepTwo from "../../components/gym-details/StepTwo";
import StepThree from "../../components/gym-details/StepThree";
import StepFour from "../../components/gym-details/StepFour";
import StepFive from "../../components/gym-details/StepFive";
import SuccessScreen from "../../components/gym-details/SuccessScreen";
import { useRouter } from "next/navigation";
export default function GymSetupPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);

  // STEP 1
const [form, setForm] = useState({
  gymName: "",
  ownerManagerName: "",   // ← ownerName nahi, ownerManagerName
  phoneNumber: "",     
  address: "",
  pincode: "",
  city: "",
  state: "",
  lat: "",
  lng: "",
});
  // STEP 2
  const [stats, setStats] = useState({
    members: "",
    visits: "",
    ageGroup: "",
    gender: "",
    gymType: "",
    gymAreaSqFt: "",
    numberOfFloor: "",
    category: "",
  });

  // STEP 3
  const [additionalDetails, setAdditionalDetails] = useState({
    website: "",
    email: "",
    alternatePhone: "",
    hasBranches: false,
    numberOfBranches: "",
    branchAddresses: [""],
    providesSupplements: false,
    supplementBrand: "",
    note: "",
  });

  // STEP 4
  const [photos, setPhotos] = useState({
    exterior: [],
    floor: [],
    changing: [],
    logo: [],
  });

  const [loading, setLoading] = useState(false);

  const resetAll = () => {
    setStep(1);

    setForm({
      gymName: "",
      ownerManagerName: "",
      phoneNumber: "",
      address: "",
      pincode: "",
      city: "",
      state: "",
      lat: "",
      lng: "",
    });

    setStats({
      members: "",
      visits: "",
      ageGroup: "",
      gender: "",
      gymType: "",
      gymAreaSqFt: "",
      numberOfFloor: "",
      category: "",
    });

    setPhotos({
      exterior: [],
      floor: [],
      changing: [],
      logo: [],
    });

    setAdditionalDetails({
      website: "",
      email: "",
      alternatePhone: "",
      hasBranches: false,
      numberOfBranches: "",
      branchAddresses: [""],
      providesSupplements: false,
      supplementBrand: "",
      note: "",
    });
  };

const handleSubmit = async () => {
  try {
    setLoading(true);

    const token = localStorage.getItem("token");

    // ── Images ──────────────────────────────────────────
    const images = Object.values(photos).flat();

    // ── Voice Note → Cloudinary upload ──────────────────
    let voiceNoteUrl = null;

    if (additionalDetails.voiceBlob) {
      const voiceForm = new FormData();
      voiceForm.append("file", additionalDetails.voiceBlob, "voice-note.webm");
      voiceForm.append("upload_preset", "gym_uploads");

      const res = await fetch(
        "https://api.cloudinary.com/v1_1/dby0jlqbg/video/upload",
        { method: "POST", body: voiceForm }
      );
      const data = await res.json();
      voiceNoteUrl = data.secure_url;
      console.log("Voice uploaded:", voiceNoteUrl);
    }

    // ── Branches ─────────────────────────────────────────
    const branches = additionalDetails.hasBranches
      ? additionalDetails.branchAddresses
          .filter((addr) => addr.trim())
          .map((address, index) => ({
            branch_number: index + 1,
            address,
          }))
      : [];

    // ── Brands ───────────────────────────────────────────
    const brands = additionalDetails.providesSupplements
      ? (additionalDetails.brands || []).filter((b) => b.trim())
      : [];

    const payload = {
      gymName: form.gymName,
      ownerManagerName: form.ownerManagerName,
      phoneNumber: form.phoneNumber,
      alternatePhoneNumber: additionalDetails.alternatePhone || null,
      email: additionalDetails.email || null,
      websiteUrl: additionalDetails.website || null,

      address: form.address,
      fullAddress: form.address,

      city: form.city,
      state: form.state,
      pincode: form.pincode,

      gpsLocation: `${form.lat}, ${form.lng}`,
      latitude: Number(form.lat),
      longitude: Number(form.lng),

      activeMembers: Number(stats.members) || 0,
      dailyVisits: Number(stats.visits) || 0,

      majorityGender: stats.gender,
      primaryAgeGroup: stats.ageGroup,

      minAge: 15,
      maxAge: 65,

      gymType: stats.gymType,
      gymAreaSqFt: Number(stats.gymAreaSqFt || 0),
      numberOfFloor: Number(stats.numberOfFloor || 1),

      category: stats.category || null,
      additionalNotes: additionalDetails.note || null,

      hasBranches: additionalDetails.hasBranches,
      branches,                                       // ✅ proper array

      promotesBrand: additionalDetails.providesSupplements,
      brands,                                         // ✅ brands array

      images,
      voiceNotes: voiceNoteUrl ? [voiceNoteUrl] : [], // ✅ cloudinary url
      videos: [],
    };

    console.log("Final Payload:", payload);

    const response = await axios.post(
      "https://gym.earthmaafoods.com/api/v1/gym/store",
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Success:", response.data);
    setStep(6);
  } catch (error) {
    console.log("API Error:", error.response?.data || error.message);
  } finally {
    setLoading(false);
  }
};
// STEP 1
if (step === 1) {
  return (
    <StepOne
      form={form}
      setForm={setForm}
      onBack={() => router.push("/")}
      onNext={() => setStep(2)}
    />
  );
}
  // STEP 2
  if (step === 2) {
    return (
      <StepTwo
        stats={stats}
        setStats={setStats}
        onBack={() => setStep(1)}
        onNext={() => setStep(3)}
      />
    );
  }

  // STEP 3
  if (step === 3) {
    return (
      <StepThree
        details={additionalDetails}
        setDetails={setAdditionalDetails}
        onBack={() => setStep(2)}
        onNext={() => setStep(4)}
      />
    );
  }

  // STEP 4
  if (step === 4) {
    return (
      <StepFour
        photos={photos}
        setPhotos={setPhotos}
        onBack={() => setStep(3)}
        onSubmit={() => setStep(5)}
      />
    );
  }

  // STEP 5
  if (step === 5) {
    return (
      <StepFive
        onBack={() => setStep(4)}
        onSubmit={handleSubmit}
        loading={loading}
      />
    );
  }

  // SUCCESS
  if (step === 6) {
    return (
      <SuccessScreen
        gymName={form.gymName}
        onRestart={resetAll}
      />
    );
  }

  return null;
}
"use client";

import { useState } from "react";
import axios from "axios";

import StepOne from "../../components/gym-details/StepOne";
import StepTwo from "../../components/gym-details/StepTwo";
import StepThree from "../../components/gym-details/StepThree";
import StepFour from "../../components/gym-details/StepFour";
import StepFive from "../../components/gym-details/StepFive";
import StepSix from "../../components/gym-details/StepSix";
import StepSeven from "../../components/gym-details/StepSeven";
import SuccessScreen from "../../components/gym-details/SuccessScreen";
import { useRouter } from "next/navigation";

export default function GymSetupPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);

  // STEP 1
  const [form, setForm] = useState({
    countryCode: "IN",
    gymName: "",
    ownerManagerName: "",
    phoneNumber: "",
    whatsappNumber: "",
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

  // STEP 6 — Supplement Insights (gym-level)
  const [supplementData, setSupplementData] = useState({
    supplementUserCount: "",
    supplementTypes: [],
    budgetCurrency: "INR",
    budgetAmount: "",
    nonSupplementUserCount: "",
    nonSupplementReason: "",
  });

  // STEP 7 — Member Profile Survey (NEW)
  const [memberData, setMemberData] = useState({
    userName: "",
    age: "",
    gender: "",
    fitnessGoal: [],
    trainingDuration: "",
    usesSupplements: null,        // true | false | null
    supplementTypes: [],
    preferredBrands: [],
    monthlyBudget: "",
    satisfactionRating: "",
    improvementsWanted: [],
    noSupplementReason: "",
    openToTrying: "",
    productWishlist: "",
    buyingChannel: [],
    memberFeedback: "",
  });

  const [loading, setLoading] = useState(false);

  // ── Reset all ─────────────────────────────────────────────────────────────
  const resetAll = () => {
    setStep(1);
    setForm({ countryCode: "IN", gymName: "", ownerManagerName: "", phoneNumber: "", whatsappNumber: "", address: "", pincode: "", city: "", state: "", lat: "", lng: "" });
    setStats({ members: "", visits: "", ageGroup: "", gender: "", gymType: "", gymAreaSqFt: "", numberOfFloor: "", category: "" });
    setPhotos({ exterior: [], floor: [], changing: [], logo: [] });
    setAdditionalDetails({ website: "", email: "", alternatePhone: "", hasBranches: false, numberOfBranches: "", branchAddresses: [""], providesSupplements: false, supplementBrand: "", note: "" });
    setSupplementData({ supplementUserCount: "", supplementTypes: [], budgetCurrency: "INR", budgetAmount: "", nonSupplementUserCount: "", nonSupplementReason: "" });
    setMemberData({ userName: "", age: "", gender: "", fitnessGoal: [], trainingDuration: "", usesSupplements: null, supplementTypes: [], preferredBrands: [], monthlyBudget: "", satisfactionRating: "", improvementsWanted: [], noSupplementReason: "", openToTrying: "", productWishlist: "", buyingChannel: [], memberFeedback: "" });
  };

  // ── Final submit (called from StepFive) ───────────────────────────────────
  const handleSubmit = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const images = Object.values(photos).flat();

      let voiceNoteUrl = null;
      if (additionalDetails.voiceBlob) {
        const voiceForm = new FormData();
        voiceForm.append("file", additionalDetails.voiceBlob, "voice-note.webm");
        voiceForm.append("upload_preset", "gym_uploads");
        const res = await fetch("https://api.cloudinary.com/v1_1/dby0jlqbg/video/upload", { method: "POST", body: voiceForm });
        const cloudinaryData = await res.json();
        voiceNoteUrl = cloudinaryData.secure_url;
      }

      const branches = additionalDetails.hasBranches
        ? additionalDetails.branchAddresses.filter(addr => addr.trim()).map((address, index) => ({ branch_number: index + 1, address }))
        : [];

      const brands = additionalDetails.providesSupplements
        ? (additionalDetails.brands || []).filter(b => b.trim())
        : [];

      const payload = {
        gymName: form.gymName,
        ownerManagerName: form.ownerManagerName,
        phoneNumber: form.phoneNumber,
        whatsappNumber: form.whatsappNumber || null,
        country: form.countryCode,
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
        branches,
        promotesBrand: additionalDetails.providesSupplements,
        brands,

        // Supplement insights (Step 6 — gym level)
        supplementUserCount: supplementData.supplementUserCount || null,
        supplementTypes: supplementData.supplementTypes,
        supplementBudgetCurrency: supplementData.budgetCurrency || "INR",
        supplementBudgetAmount: supplementData.budgetAmount ? Number(supplementData.budgetAmount) : null,
        nonSupplementUserCount: supplementData.nonSupplementUserCount || null,
        nonSupplementReason: supplementData.nonSupplementReason || null,

        // Member profile survey (Step 7 — NEW)
        memberSurvey: {
          userName: memberData.userName || null,
          age: memberData.age ? Number(memberData.age) : null,
          gender: memberData.gender || null,
          fitnessGoals: memberData.fitnessGoal,
          trainingDuration: memberData.trainingDuration || null,
          usesSupplements: memberData.usesSupplements,
          supplementTypes: memberData.supplementTypes,
          preferredBrands: memberData.preferredBrands,
          monthlyBudget: memberData.monthlyBudget || null,
          satisfactionRating: memberData.satisfactionRating ? Number(memberData.satisfactionRating) : null,
          improvementsWanted: memberData.improvementsWanted,
          noSupplementReason: memberData.noSupplementReason || null,
          openToTrying: memberData.openToTrying || null,
          productWishlist: memberData.productWishlist || null,
          buyingChannel: memberData.buyingChannel,
          memberFeedback: memberData.memberFeedback || null,
        },

        images,
        voiceNotes: voiceNoteUrl ? [voiceNoteUrl] : [],
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
      setStep(8); // success screen
    } catch (error) {
      console.log("API Error:", error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  // ── Step routing ──────────────────────────────────────────────────────────

  if (step === 1)
    return <StepOne form={form} setForm={setForm} onBack={() => router.push("/")} onNext={() => setStep(2)} />;

  if (step === 2)
    return <StepTwo stats={stats} setStats={setStats} onBack={() => setStep(1)} onNext={() => setStep(3)} />;

  if (step === 3)
    return <StepThree details={additionalDetails} setDetails={setAdditionalDetails} onBack={() => setStep(2)} onNext={() => setStep(4)} />;

  if (step === 4)
    return <StepFour photos={photos} setPhotos={setPhotos} onBack={() => setStep(3)} onSubmit={() => setStep(5)} />;

  if (step === 5)
    return <StepSix data={supplementData} setData={setSupplementData} onBack={() => setStep(4)} onSubmit={() => setStep(6)} loading={loading} />;

  if (step === 6)
    return (
      <StepSeven
        data={memberData}
        setData={setMemberData}
        onBack={() => setStep(6)}
        onNext={handleSubmit}   // final API call happens here
        loading={loading}
      />
    );

  // ── NEW: Member profile survey ────────────────────────────────────────────
  if (step === 7)
      return <StepFive onBack={() => setStep(5)} onSubmit={() => setStep(7)} loading={false} />;


  // ── Success ───────────────────────────────────────────────────────────────
  if (step === 8)
    return <SuccessScreen gymName={form.gymName} onRestart={resetAll} />;

  return null;
}
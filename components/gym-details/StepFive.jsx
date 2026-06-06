// "use client";

// import { useRef, useState } from "react";

// export default function StepFive({
//   phone: initialPhone,
//   onBack,
//   onVerified,
// }) {
//   const [phone, setPhone] = useState(initialPhone || "");
//   const [otp, setOtp] = useState(["", "", "", "", "", ""]);
//   const [status, setStatus] = useState("idle"); 
//   const [timer, setTimer] = useState(0);

//   const inputRefs = useRef([]);

//   // Send OTP
//   const sendOtp = () => {
//     if (phone.length < 10) return;

//     setStatus("sent");
//     setOtp(["", "", "", "", "", ""]);
//     setTimer(30);

//     const interval = setInterval(() => {
//       setTimer((t) => {
//         if (t <= 1) {
//           clearInterval(interval);
//           return 0;
//         }
//         return t - 1;
//       });
//     }, 1000);
//   };

//   // OTP input
//   const handleChange = (i, value) => {
//     const digit = value.replace(/\D/g, "").slice(-1);
//     const updated = [...otp];
//     updated[i] = digit;
//     setOtp(updated);

//     if (digit && i < 5) {
//       inputRefs.current[i + 1]?.focus();
//     }
//   };

//   // Verify OTP
//   const verifyOtp = () => {
//     const code = otp.join("");

//     if (code.length !== 6) return;

//     setStatus("verifying");

//     setTimeout(() => {
//       if (code === "000000") {
//         setStatus("error");
//       } else {
//         setStatus("success");
//         setTimeout(onVerified, 800);
//       }
//     }, 1000);
//   };

//   const filled = otp.filter(Boolean).length;

//   return (
//     <div className="min-h-screen w-full max-w-md mx-auto bg-gray-50 flex flex-col">

//       {/* Header */}
//       <div className="px-5 pt-10 pb-6">
//         <button onClick={onBack} className="text-gray-900 font-semibold">
//           ← Back
//         </button>

//         <h1 className="text-xl font-bold text-gray-900 mt-3">
//           Verify Phone Number
//         </h1>
//       </div>

//       <div className="flex-1 px-5 space-y-5">

//         {/* PHONE INPUT */}
//         {status === "idle" && (
//           <>
//             <input
//               type="tel"
//               placeholder="Enter phone number"
//               value={phone}
//               onChange={(e) => setPhone(e.target.value)}
//               className="w-full h-12 border-2 border-gray-300 rounded-xl px-3 text-gray-900"
//             />

//             <button
//               onClick={sendOtp}
//               className="w-full h-12 bg-gray-800 text-white rounded-xl font-bold"
//             >
//               Send OTP
//             </button>
//           </>
//         )}

//         {/* OTP INPUT */}
//         {(status === "sent" ||
//           status === "verifying" ||
//           status === "error" ||
//           status === "success") && (
//           <>
//             <p className="text-sm text-gray-900">
//               OTP sent to {phone}
//             </p>

//             <div className="flex gap-2 justify-center">
//               {otp.map((val, i) => (
//                 <input
//                   key={i}
//                   ref={(el) => (inputRefs.current[i] = el)}
//                   value={val}
//                   onChange={(e) => handleChange(i, e.target.value)}
//                   maxLength={1}
//                   className="w-12 h-12 text-center border-2 border-gray-300 rounded-xl text-gray-900 text-lg font-bold"
//                 />
//               ))}
//             </div>

//             <button
//               onClick={verifyOtp}
//               disabled={filled !== 6}
//               className={`w-full h-12 rounded-xl font-bold ${
//                 filled === 6
//                   ? "bg-gray-800 text-white"
//                   : "bg-gray-200 text-gray-400"
//               }`}
//             >
//               Verify OTP
//             </button>
//           </>
//         )}

//         {/* Resend */}
//         {timer > 0 && (
//           <p className="text-center text-gray-900 text-sm">
//             Resend in {timer}s
//           </p>
//         )}

//         {timer === 0 && status !== "idle" && (
//           <button
//             onClick={sendOtp}
//             className="text-sm text-gray-900 underline w-full"
//           >
//             Resend OTP
//           </button>
//         )}

//         {/* Error */}
//         {status === "error" && (
//           <p className="text-red-600 text-center text-sm font-semibold">
//             Incorrect OTP
//           </p>
//         )}
//       </div>
//     </div>
//   );
// }


"use client";

export default function StepFive({
  onBack,
  onSubmit,
  loading = false,
}) {
  return (
    <div className="min-h-screen w-full max-w-md mx-auto bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="px-5 pt-10 pb-6">
        <button
          onClick={onBack}
          className="text-gray-900 font-semibold"
        >
          ← Back
        </button>

        <h1 className="text-xl font-bold text-gray-900 mt-3">
          Review & Submit
        </h1>

        <p className="text-sm text-gray-500 mt-2">
          Please review your gym details and submit.
        </p>
      </div>

      {/* Body */}
      <div className="flex-1 px-5 flex flex-col justify-end pb-8">
        <button
          onClick={onSubmit}
          disabled={loading}
          className={`w-full h-14 rounded-2xl font-bold transition-all ${
            loading
              ? "bg-gray-400 text-white cursor-not-allowed"
              : "bg-gray-800 text-white hover:bg-gray-900"
          }`}
        >
          {loading ? "Submitting..." : "Submit Details"}
        </button>
      </div>
    </div>
  );
}
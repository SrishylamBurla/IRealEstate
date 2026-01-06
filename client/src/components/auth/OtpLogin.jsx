"use client";

import { useState, useEffect } from "react";
import {
  useRequestLoginOtpMutation,
  useVerifyLoginOtpMutation,
  useRequestMobileOtpMutation,
  useVerifyMobileOtpMutation,
} from "@/features/users/userApi";
import { useRouter } from "next/navigation";

export default function OtpLogin() {
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [method, setMethod] = useState("email");

  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");

  const [timer, setTimer] = useState(0);

  const [requestLoginOtp, { isLoading: sendingEmail }] =
    useRequestLoginOtpMutation();
  const [verifyLoginOtp, { isLoading: verifyingEmail }] =
    useVerifyLoginOtpMutation();

  const [requestMobileOtp, { isLoading: sendingMobile }] =
    useRequestMobileOtpMutation();
  const [verifyMobileOtp, { isLoading: verifyingMobile }] =
    useVerifyMobileOtpMutation();

  /* ---------------- TIMER ---------------- */

  useEffect(() => {
    if (timer <= 0) return;
    const interval = setInterval(() => setTimer((t) => t - 1), 1000);
    return () => clearInterval(interval);
  }, [timer]);

  /* ---------------- SEND OTP ---------------- */

  const sendOtp = async () => {
    try {
      if (method === "email") {
        if (!email) return alert("Enter email");
        await requestLoginOtp({ email }).unwrap();
      } else {
        if (!mobile) return alert("Enter mobile number");
        await requestMobileOtp({ phone: mobile }).unwrap();
      }

      setStep(2);
      setTimer(30);
    } catch (err) {
      alert(err?.data?.message || "Failed to send OTP");
    }
  };

  /* ---------------- VERIFY OTP ---------------- */
  const verify = async () => {
  try {
    const user =
      method === "email"
        ? await verifyLoginOtp({ email, otp }).unwrap()
        : await verifyMobileOtp({ phone: mobile, otp }).unwrap();

    localStorage.setItem("token", user.token);
    localStorage.setItem("user", JSON.stringify(user));
    window.dispatchEvent(new Event("auth-change"));
    router.push("/");
  } catch (err) {
    alert(err?.data?.message || "Invalid OTP");
  }
};


  // const verify = async () => {
  //   try {
  //     const user =
  //       method === "email"
  //         ? await verifyLoginOtp({ email, otp }).unwrap()
  //         : await verifyMobileOtp({ mobile, otp }).unwrap();

  //     localStorage.setItem("token", user.token);
  //     localStorage.setItem("user", JSON.stringify(user));
  //     window.dispatchEvent(new Event("auth-change"));

  //     router.push("/");
  //   } catch (err) {
  //     alert(err?.data?.message || "Invalid OTP");
  //   }
  // };

  return (
    <div className="max-w-md mx-auto bg-gray-50 shadow-xl rounded-xl p-6 space-y-6">
      <h2 className="text-2xl font-semibold text-center">Login with OTP</h2>

      {/* METHOD TOGGLE */}
      <div className="flex justify-center gap-4">
        {["email", "mobile"].map((m) => (
          <button
            key={m}
            onClick={() => {
              setMethod(m);
              setStep(1);
              setOtp("");
            }}
            className={`px-4 py-1 rounded-full text-sm ${
              method === m
                ? "bg-indigo-600 text-white"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            {m === "email" ? "Email" : "Mobile"}
          </button>
        ))}
      </div>

      {/* STEP 1 */}
      {step === 1 && (
        <>
          {method === "email" ? (
            <input
              type="email"
              placeholder="Enter email"
              className="w-full border rounded px-3 py-2"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          ) : (
            <input
              type="tel"
              placeholder="Enter mobile number"
              className="w-full border rounded px-3 py-2"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
            />
          )}

          <button
            onClick={sendOtp}
            disabled={sendingEmail || sendingMobile}
            className="w-full bg-indigo-600 text-white py-2 rounded"
          >
            Send OTP
          </button>
        </>
      )}

      {/* STEP 2 */}
      {step === 2 && (
        <>
          <p className="text-sm text-gray-600">
            OTP sent to <b>{method === "email" ? email : mobile}</b>
          </p>

          <input
            type="text"
            placeholder="Enter 6-digit OTP"
            className="w-full border rounded px-3 py-2 tracking-widest text-center"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />

          <button
            onClick={verify}
            disabled={verifyingEmail || verifyingMobile}
            className="w-full bg-green-600 text-white py-2 rounded"
          >
            Verify & Login
          </button>

          <div className="text-center text-xs text-gray-500">
            {timer > 0 ? (
              <>Resend OTP in <b>{timer}s</b></>
            ) : (
              <button onClick={sendOtp} disabled={timer > 0 || sending} className="text-blue-600 underline">
                Resend OTP
              </button>
            )}
          </div>

          <button
            onClick={() => setStep(1)}
            className="block mx-auto text-xs text-gray-500 underline"
          >
            Change {method}
          </button>
        </>
      )}
    </div>
  );
}

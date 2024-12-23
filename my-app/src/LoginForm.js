import React, { useState, useEffect } from "react";
import { auth, createRecaptchaVerifier } from "./firebase/setup";
import { signInWithPhoneNumber } from "firebase/auth";

const LoginForm = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [sessionInfo, setSessionInfo] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Initialize reCAPTCHA when component mounts
    createRecaptchaVerifier("recaptcha-container");
  }, []);

  const handleSendOTP = async () => {
    if (!phoneNumber) {
      alert("Please enter a valid phone number.");
      return;
    }

    const appVerifier = window.recaptchaVerifier;

    try {
      // Send OTP using Firebase Authentication
      const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
      setSessionInfo(confirmationResult);
      alert("OTP sent successfully!");
    } catch (error) {
      console.error("Error sending OTP:", error.message);
      setError(error.message);
    }
  };

  const handleVerifyOTP = async () => {
    if (!otp) {
      alert("Please enter the OTP.");
      return;
    }

    try {
      // Verify OTP and sign in the user
      await sessionInfo.confirm(otp);
      setIsLoggedIn(true);
      alert("Login successful!");
    } catch (error) {
      console.error("Error verifying OTP:", error.message);
      setError(error.message);
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "50px auto", textAlign: "center" }}>
      <h2>Mobile Login</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {!isLoggedIn ? (
        <>
          <input
            type="text"
            placeholder="Enter Phone Number"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            style={{ display: "block", margin: "10px auto", padding: "10px", width: "100%" }}
          />
          <button
            onClick={handleSendOTP}
            style={{
              backgroundColor: "#007BFF",
              color: "white",
              border: "none",
              padding: "10px 20px",
              cursor: "pointer",
            }}
          >
            Send OTP
          </button>
          <div id="recaptcha-container"></div> {/* reCAPTCHA container */}

          {sessionInfo && (
            <>
              <input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                style={{ display: "block", margin: "10px auto", padding: "10px", width: "100%" }}
              />
              <button
                onClick={handleVerifyOTP}
                style={{
                  backgroundColor: "#28A745",
                  color: "white",
                  border: "none",
                  padding: "10px 20px",
                  cursor: "pointer",
                }}
              >
                Verify OTP
              </button>
            </>
          )}
        </>
      ) : (
        <h3>Welcome! You are logged in.</h3>
      )}
    </div>
  );
};

export default LoginForm;

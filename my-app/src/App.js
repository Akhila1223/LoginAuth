import React, { useState } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { auth } from "./firebase/setup";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";

const App = () => {
  const [otp, setOtp] = useState("");
  const [ph, setPh] = useState("");
  const [loading, setLoading] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  const onCaptchVerify = () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(
        "recaptcha-container",
        {
          size: "invisible",
          callback: (response) => {
            console.log("Captcha verified:", response);
          },
          "expired-callback": () => {
            console.error("Captcha expired. Please try again.");
          },
        },
        auth
      );
    }
  };

  const onSignup = () => {
    setLoading(true);
    setError(null);
    onCaptchVerify();

    const appVerifier = window.recaptchaVerifier;
    const formatPh = "+" + ph;

    signInWithPhoneNumber(auth, formatPh, appVerifier)
      .then((confirmationResult) => {
        window.confirmationResult = confirmationResult;
        setLoading(false);
        setShowOTP(true);
        console.log("OTP sent");
      })
      .catch((err) => {
        setError("Failed to send OTP. Please try again.");
        console.error(err);
        setLoading(false);
      });
  };

  const onOTPVerify = () => {
    setLoading(true);
    setError(null);

    window.confirmationResult
      .confirm(otp)
      .then((result) => {
        setUser(result.user);
        setLoading(false);
        console.log("User signed in:", result.user);
      })
      .catch((err) => {
        setError("Invalid OTP. Please try again.");
        console.error(err);
        setLoading(false);
      });
  };

  return (
    <section>
      <div>
        <div id="recaptcha-container"></div>
        {user ? (
          <h2>
            Login Successful!
          </h2>
        ) : (
          <div>
            {error && <p>{error}</p>}
            {loading && <p>Loading...</p>}
            {showOTP ? (
              <>
                <label htmlFor="otp">
                  Enter your OTP
                </label>
                <input
                  type="text"
                  id="otp"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="123456"
                />
                <button
                  onClick={onOTPVerify}
                  className={`bg-emerald-600 text-white w-full py-2 rounded mt-2 ${
                    loading ? "opacity-50" : ""
                  }`}
                  disabled={loading}
                >
                  Verify OTP
                </button>
              </>
            ) : (
              <>
                <label
                  htmlFor="phone"
                >
                  Verify your phone number
                </label>
                <PhoneInput
                  country={"in"}
                  value={ph}
                  onChange={setPh}
                  inputProps={{
                    name: "phone",
                    required: true,
                    autoFocus: true,
                  }}
                />
                <button
                  onClick={onSignup}
                  className={`bg-emerald-600 text-white w-full py-2 rounded mt-2 ${
                    loading ? "opacity-50" : ""
                  }`}
                  disabled={loading}
                >
                  Send code via SMS
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default App;

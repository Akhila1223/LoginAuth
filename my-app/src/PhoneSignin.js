import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { useState } from 'react';
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { auth } from "./firebase/setup";

function PhoneSignin() {
  const [phone, setPhone] = useState("");

  const sendOtp = async () => {
    try {
      const recaptcha = new RecaptchaVerifier(auth, "recaptcha", {});
      const confirmation = await signInWithPhoneNumber(auth, phone, recaptcha);
      console.log(confirmation);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="phone-signin-container">
      <h2>Phone Number Authentication</h2>
      <div className="phone-input-container">
        <PhoneInput
          country={'us'}
          value={phone}
          onChange={(phone) => setPhone("+" + phone)}
        />
      </div>
      <div className="button-container">
        <button
          onClick={sendOtp}
          className="btn-primary"
        >
          Send OTP
        </button>
      </div>
      <div id="recaptcha" className="recaptcha-container"></div>
      <div className="otp-input-container">
        <input
          type="text"
          placeholder="Enter OTP"
          className="otp-input"
        />
        <button
          className="btn-success"
        >
          Verify OTP
        </button>
      </div>
    </div>
  );
}

export default PhoneSignin;

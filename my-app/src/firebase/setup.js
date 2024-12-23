import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyD6iiOiR49kbJX3vK6BGiuOLTzivtJRNo4",
    authDomain: "ballotnow-dev.firebaseapp.com",
    projectId: "ballotnow-dev",
    storageBucket: "ballotnow-dev.firebasestorage.app",
    messagingSenderId: "1068410053744",
    appId: "1:1068410053744:web:6a71e1b8902380b69ac0b5",
    measurementId: "G-WJJ49TG9E9"
  };

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
auth.settings.appVerificationDisabledForTesting = false;

export { auth };

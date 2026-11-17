import { initializeApp } from "https://www.gstatic.com/firebasejs/13.2.0/firebase-app.js";
import {
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateProfile
} from "https://www.gstatic.com/firebasejs/13.2.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyBrRa5yuDUkTr2yo4ZYqy5RNe6FZwhphbc",
  authDomain: "archive-of-rain.firebaseapp.com",
  projectId: "archive-of-rain",
  storageBucket: "archive-of-rain.firebasestorage.app",
  messagingSenderId: "685280901631",
  appId: "1:685280901631:web:a9e37f5a4439bd57144fca",
  measurementId: "G-H3S8WWZCSK"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const signupForm = document.querySelector("#signup-form");
const loginForm = document.querySelector("#login-form");
const authMessage = document.querySelector("#auth-message");
const profileEmail = document.querySelector("#profile-email");
const profileUsername = document.querySelector("#profile-username");
const profileToggle = document.querySelector("#login-toggle");
const signOutButton = document.querySelector("#sign-out");
const isProfilePage = Boolean(profileEmail);
let isCreatingAccount = false;

async function submitAuthForm(form, authenticate, successMessage) {
  const formData = new FormData(form);
  const submitButton = form.querySelector('button[type="submit"]');
  submitButton.disabled = true;
  if (authMessage) {
    authMessage.textContent = "Please wait...";
  }

  try {
    const user = await authenticate(formData.get("email"), formData.get("password"), formData);
    if (authMessage) {
      authMessage.textContent = successMessage(user.email);
    }
    form.reset();
    return true;
  } catch (error) {
    if (authMessage) {
      authMessage.textContent = error.message || "Authentication failed. Please try again.";
    }
    return false;
  } finally {
    submitButton.disabled = false;
  }
}

onAuthStateChanged(auth, (user) => {
  if (isProfilePage) {
    if (!user) {
      window.location.replace("AOR-home.html");
      return;
    }
    if (profileUsername) {
      profileUsername.textContent = user.displayName || "Username not set";
    }
    profileEmail.textContent = user.email || "Email unavailable";
    if (profileToggle) {
      profileToggle.textContent = user.displayName || "Profile";
    }
  } else if (user && !isCreatingAccount) {
    window.location.replace("loggedin.html");
  }
});

if (signupForm) {
  signupForm.addEventListener("submit", (event) => {
    event.preventDefault();
    isCreatingAccount = true;
    submitAuthForm(
      signupForm,
      async (email, password, formData) => {
        const username = String(formData.get("username")).trim();
        if (!username) {
          throw new Error("Please enter a username.");
        }
        const { user } = await createUserWithEmailAndPassword(auth, email, password);
        try {
          await updateProfile(user, { displayName: username });
        } catch (error) {
          await signOut(auth);
          throw error;
        }
        return user;
      },
      (email) => `Account created for ${email}.`
    ).then((created) => {
      isCreatingAccount = false;
      if (created) {
        window.location.replace("loggedin.html");
      }
    });
  });
}

if (signOutButton) {
  signOutButton.addEventListener("click", async () => {
    signOutButton.disabled = true;
    try {
      await signOut(auth);
    } catch (error) {
      signOutButton.disabled = false;
      if (authMessage) {
        authMessage.textContent = error.message || "Could not log out. Please try again.";
      }
    }
  });
}

if (loginForm) {
  loginForm.addEventListener("submit", (event) => {
    event.preventDefault();
    submitAuthForm(
      loginForm,
      (email, password) => signInWithEmailAndPassword(auth, email, password).then(({ user }) => user),
      (email) => `Logged in as ${email}.`
    );
  });
}

// -------------------------------------------------------------
// src/loginSignup.js
// -------------------------------------------------------------
// Tailwind CSS version — no Bootstrap dependencies.
// Handles Login/Signup toggling, error messages, and form submits.
// -------------------------------------------------------------

import "../styles/style.css";
import { loginUser, signupUser, authErrorMessage } from "./authentication.js";

// --- Login and Signup Page ---
function initAuthUI() {
  // --- DOM Elements ---
  const alertEl = document.getElementById("authAlert");
  const loginView = document.getElementById("loginView");
  const signupView = document.getElementById("signupView");
  const toSignupBtn = document.getElementById("toSignup");
  const toLoginBtn = document.getElementById("toLogin");
  const loginForm = document.getElementById("loginForm");
  const signupForm = document.getElementById("signupForm");
  const redirectUrl = "main.html";

  // --- Helper Functions ---
  // Toggle visibility (Tailwind uses "hidden")
  function setVisible(el, visible) {
    el.classList.toggle("hidden", !visible);
  }

  // Show error message (Tailwind alert styling)
  let errorTimeout;
  function showError(msg) {
    alertEl.textContent = msg || "";
    alertEl.classList.remove("hidden");
    alertEl.classList.add(
      "bg-red-100",
      "text-red-700",
      "border",
      "border-red-400",
      "px-4",
      "py-2",
      "rounded"
    );
    clearTimeout(errorTimeout);
    errorTimeout = setTimeout(hideError, 5000);
  }

  function hideError() {
    alertEl.classList.add("hidden");
    alertEl.textContent = "";
    clearTimeout(errorTimeout);
  }

  // Enable/disable submit button
  function setSubmitDisabled(form, disabled) {
    const submitBtn = form?.querySelector('[type="submit"]');
    if (submitBtn) {
      submitBtn.disabled = disabled;
      submitBtn.classList.toggle("opacity-50", disabled);
      submitBtn.classList.toggle("cursor-not-allowed", disabled);
    }
  }

  // --- Event Listeners ---
  // Switch to Signup
  toSignupBtn?.addEventListener("click", (e) => {
    e.preventDefault();
    hideError();
    setVisible(loginView, false);
    setVisible(signupView, true);
    signupView?.querySelector("input")?.focus();
  });

  // Switch to Login
  toLoginBtn?.addEventListener("click", (e) => {
    e.preventDefault();
    hideError();
    setVisible(signupView, false);
    setVisible(loginView, true);
    loginView?.querySelector("input")?.focus();
  });

  // Login form
  loginForm?.addEventListener("submit", async (e) => {
    e.preventDefault();
    hideError();
    const email = document.querySelector("#loginEmail")?.value?.trim() ?? "";
    const password = document.querySelector("#loginPassword")?.value ?? "";
    if (!email || !password) {
      showError("Please enter your email and password.");
      return;
    }
    setSubmitDisabled(loginForm, true);
    try {
      await loginUser(email, password);
      location.href = redirectUrl;
    } catch (err) {
      showError(authErrorMessage(err));
      console.error(err);
    } finally {
      setSubmitDisabled(loginForm, false);
    }
  });

  // Signup form
  signupForm?.addEventListener("submit", async (e) => {
    e.preventDefault();
    hideError();
    const name = document.querySelector("#signupName")?.value?.trim() ?? "";
    const email = document.querySelector("#signupEmail")?.value?.trim() ?? "";
    const password = document.querySelector("#signupPassword")?.value ?? "";
    if (!name || !email || !password) {
      showError("Please fill in name, email, and password.");
      return;
    }
    setSubmitDisabled(signupForm, true);
    try {
      await signupUser(name, email, password);
      location.href = redirectUrl;
    } catch (err) {
      showError(authErrorMessage(err));
      console.error(err);
    } finally {
      setSubmitDisabled(signupForm, false);
    }
  });
}

// --- Initialize UI on DOMContentLoaded ---
document.addEventListener("DOMContentLoaded", initAuthUI);

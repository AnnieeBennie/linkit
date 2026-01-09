import React, { useState } from "react";
import "../css/SignUp.css";
import CloseIcon from "../Icons/close.svg";
import { signUpUser } from "../services/userService";

/* ---------------------- HELPER FUNCTIONS ---------------------- */

function extractFormData(formElement) {
  const form = new FormData(formElement);
  return {
    email: form.get("email"),
    password: form.get("password"),
  };
}

function notifyAuthChange() {
  window.dispatchEvent(new Event("auth-change"));
}

/* ---------------------- COMPONENT ---------------------- */

function SignUp({ onClose = () => {}, onSuccess = () => {} }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { email, password } = extractFormData(e.target);

    try {
      const user = await signUpUser({ email, password });
      onSuccess(user);
      notifyAuthChange();
      onClose();
    } catch (err) {
      setError(err?.message || "Sign up failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="sign-up-overlay">
      <div className="sign-up-modal">
        <div className="sign-up-container" role="dialog" aria-modal="true">
          <button className="sign-up-close" onClick={onClose} type="button">
            <img src={CloseIcon} alt="close" />
          </button>

          <form className="sign-up-inner" onSubmit={handleSubmit}>
            <h2 className="create-an-acc">Create an account</h2>
            <p className="text-sign-up">Enter your email to sign up</p>

            {error && <div className="sign-up-error">{error}</div>}

            <input
              name="email"
              className="input"
              placeholder="Email"
              required
            />
            <input
              name="password"
              type="password"
              className="input"
              placeholder="Password"
              required
            />

            <button className="sign-up-login" type="submit" disabled={loading}>
              {loading ? "Signing up..." : "Sign Up"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default SignUp;

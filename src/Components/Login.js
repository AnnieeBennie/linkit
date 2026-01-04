import React, { useState } from "react";
import "../css/AuthModal.css";
import CloseIcon from "../Icons/close.svg";
import { loginUser } from "../services/loginService";

function Login({
  onClose = () => {},
  onSuccess = () => {},
  onShowRegister = () => {},
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const form = new FormData(e.target);
    const email = form.get("email");
    const password = form.get("password");

    try {
      const user = await loginUser({ email, password });
      setLoading(false);
      onSuccess(user);
      // notify other components that auth state changed
      try {
        window.dispatchEvent(new Event("auth-change"));
      } catch (e) {}
      onClose();
    } catch (err) {
      setLoading(false);
      setError(err.message);
    }
  };

  return (
    <div className="auth-overlay">
      <div className="auth-modal">
        <button className="auth-close" onClick={onClose}>
          <img src={CloseIcon} alt="close" />
        </button>

        <form onSubmit={handleSubmit}>
          <h1 className="auth-title">Log in</h1>

          {error && <div className="auth-error">{error}</div>}

          <input
            name="email"
            className="auth-input"
            placeholder="Email"
            required
          />

          <input
            name="password"
            type="password"
            className="auth-input"
            placeholder="Password"
            required
          />

          <button className="auth-submit" type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>

          <p className="auth-switch">
            Not a user yet?{" "}
            <span
              onClick={() => {
                onClose();
                onShowRegister();
              }}
            >
              Register
            </span>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;

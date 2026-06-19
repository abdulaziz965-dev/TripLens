import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  registerWithEmail,
  loginWithEmail
} from "../../services/authService";

export function EmailAuthScreen() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    try {
      setLoading(true);

      await registerWithEmail(email, password);

      alert("Account Created!");

      navigate("/home");
    } catch (err: any) {
      console.error(err);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    try {
      setLoading(true);

      await loginWithEmail(email, password);

      navigate("/home");
    } catch (err: any) {
      console.error(err);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0F172A",
        color: "white",
        padding: 24,
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 400
        }}
      >
        <h1>TripLens Email Login</h1>

        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{
            width: "100%",
            padding: 14,
            marginTop: 20,
            borderRadius: 12
          }}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{
            width: "100%",
            padding: 14,
            marginTop: 12,
            borderRadius: 12
          }}
        />

        <button
          onClick={handleSignup}
          disabled={loading}
          style={{
            width: "100%",
            marginTop: 20,
            padding: 14,
            borderRadius: 12
          }}
        >
          Create Account
        </button>

        <button
          onClick={handleLogin}
          disabled={loading}
          style={{
            width: "100%",
            marginTop: 12,
            padding: 14,
            borderRadius: 12
          }}
        >
          Login
        </button>
      </div>
    </div>
  );
}
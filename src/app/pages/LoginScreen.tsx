
import { Phone, Mail, Shield, Eye, Zap } from "lucide-react";
import { T, display, body, heading, label, IMG } from "../theme";
import { LogoMark } from "../components/SharedComponents";
import { useState } from "react";

export function LoginScreen({
  onLogin,
  onPhoneLogin,
  onEmailSignup,
  onEmailLogin,
  onForgotPassword,
  loading,
  error
}: {
  onLogin: () => void;
  onPhoneLogin: () => void;
  onEmailSignup: (
    name: string,
    email: string,
    password: string
  ) => void;
  onEmailLogin: (
    email: string,
    password: string
  ) => void;
  onForgotPassword: (
    email: string
  ) => void;
  loading?: boolean;
  error?: string | null;
}) {
  const [showSignup, setShowSignup] = useState(false);

const [signupName, setSignupName] = useState("");
const [signupEmail, setSignupEmail] = useState("");
const [signupPassword, setSignupPassword] = useState("");
const [confirmPassword, setConfirmPassword] = useState("");
const inputStyle = {
  width: "100%",
  padding: "15px",
  borderRadius: 18,
  border: "1px solid rgba(255,255,255,0.15)",
  background: "rgba(255,255,255,0.08)",
  color: "white",
  outline: "none",
  marginBottom: 12,
};
const canCreateAccount =
  signupName.trim() &&
  signupEmail.trim() &&
  signupPassword.trim() &&
  confirmPassword.trim();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  return (
    <div style={{ position: "relative", width: "100%", minHeight: "100dvh", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, background: T.navy }} />

      <img
        src={IMG.loginBg}
        alt="Silhouette couple standing on scenic hilltop"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: "center 20%"
        }}
      />

      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(to bottom, rgba(15,23,42,0.22) 0%, rgba(15,23,42,0.65) 38%, rgba(15,23,42,0.95) 65%, #0F172A 85%)"
        }}
      />

      

      <div
        style={{
          position: "absolute",
          top: 70,
          left: 22,
          display: "flex",
          alignItems: "center",
          gap: 8
        }}
      >
        <LogoMark size={32} />
        <span style={{ ...heading, fontSize: 18, color: "white" }}>
          TripLens
        </span>
      </div>

      <div
        style={{
          position: "absolute",
          top: 120,
          left: 0,
          right: 0,
          bottom: 0,
          overflowY:"auto",
          padding: "28px 22px 40px",
          background: "rgba(15,23,42,0.97)",
          borderTop: "1px solid rgba(255,255,255,0.07)"
        }}
      >
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <p
            style={{
              ...label,
              fontSize: 11,
              color: T.teal,
              marginBottom: 8
            }}
          >
            Step into smart travel
          </p>

          <h2
            style={{
              ...display,
              fontSize: 28,
              color: "white",
              letterSpacing: -0.5,
              marginBottom: 8
            }}
          >
            Welcome Back
          </h2>

          <p
            style={{
              ...body,
              fontSize: 14,
              color: "rgba(255,255,255,0.42)",
              lineHeight: 1.6
            }}
          >
            Sign in to plan your next reality-checked adventure
          </p>
        </div>

        <div
  style={{
    display: "flex",
    flexDirection: "column",
    gap: 12,
    marginBottom: 20
  }}
>
  <>
  {/* Google Login */}
  <button
    onClick={onLogin}
    disabled={loading}
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 12,
      width: "100%",
      padding: "15px 20px",
      borderRadius: 18,
      border: "none",
      cursor: "pointer",
      background: "white",
      boxShadow: "0 4px 24px rgba(0,0,0,0.4)",
      opacity: loading ? 0.7 : 1,
      ...heading,
      fontSize: 15,
      color: T.navy
    }}
  >
    Continue with Google
  </button>

  <div
    style={{
      textAlign: "center",
      color: "rgba(255,255,255,0.3)",
      margin: "4px 0"
    }}
  >
    ──────── OR ────────
  </div>

  {/* Email */}
  <input
    type="email"
    placeholder="Email Address"
    value={email}
    onChange={(e) => setEmail(e.target.value)}
    style={{
      width: "100%",
      padding: "15px",
      borderRadius: 18,
      border: "1px solid rgba(255,255,255,0.15)",
      background: "rgba(255,255,255,0.08)",
      color: "white",
      outline: "none"
    }}
  />

  <input
    type="password"
    placeholder="Password"
    value={password}
    onChange={(e) => setPassword(e.target.value)}
    style={{
      width: "100%",
      padding: "15px",
      borderRadius: 18,
      border: "1px solid rgba(255,255,255,0.15)",
      background: "rgba(255,255,255,0.08)",
      color: "white",
      outline: "none"
    }}
  />
<div
  style={{
    textAlign: "right",
    marginTop: 4,
    marginBottom: 8
  }}
>
  <button
    onClick={() => {
  if (!email.trim()) {
    alert(
      "Please enter your email first."
    );
    return;
  }

  onForgotPassword(email);
}}
    style={{
      background: "transparent",
      border: "none",
      color: T.teal,
      cursor: "pointer",
      fontSize: 13
    }}
  >
    Forgot Password?
  </button>
</div>
  <button
  disabled={!email || !password}
  onClick={() => onEmailLogin(email, password)}
  style={{
    width: "100%",
    padding: "15px",
    borderRadius: 18,
    border: "none",
    background: T.teal,
    color: "white",
    cursor: !email || !password ? "not-allowed" : "pointer",
    opacity: !email || !password ? 0.5 : 1,
    ...heading
  }}
>
    Sign In
  </button>
  
  <div
    style={{
      textAlign: "center",
      color: "rgba(255,255,255,0.6)",
      fontSize: 14
    }}
  >
    Don't have an account?
  </div>

  <button
    onClick={() => setShowSignup(true)}
    style={{
      width: "100%",
      padding: "15px",
      borderRadius: 18,
      border: "1px solid rgba(255,255,255,0.15)",
      background: "transparent",
      color: "white",
      cursor: "pointer",
      ...heading
    }}
  >
    Create Account
  </button>

  <div
    style={{
      textAlign: "center",
      color: "rgba(255,255,255,0.3)",
      margin: "4px 0"
    }}
  >
    ──────── OR ────────
  </div>

  {/* Phone */}
  <button
    onClick={onPhoneLogin}
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 12,
      width: "100%",
      padding: "15px 20px",
      borderRadius: 18,
      cursor: "pointer",
      background: "rgba(255,255,255,0.08)",
      border: "1.5px solid rgba(255,255,255,0.16)",
      color: "white",
      ...heading,
      fontSize: 15
    }}
  >
    <Phone size={20} />
    Continue with Phone
  </button>
</>
</div>
{error ? (
  <p
    style={{
      ...body,
      fontSize: 12,
      color: T.red,
      textAlign: "center",
      marginBottom: 16
    }}
  >
    {error}
  </p>
) : null}

<div id="recaptcha-container" />

<div
  style={{
    display: "flex",
    alignItems: "center",
    gap: 12,
    marginBottom: 20
  }}
>
  <div
    style={{
      flex: 1,
      height: 1,
      background: "rgba(255,255,255,0.08)"
    }}
  />

  <span
    style={{
      ...body,
      fontSize: 12,
      color: "rgba(255,255,255,0.25)"
    }}
  >
    protected by TripLens Trust
  </span>

  <div
    style={{
      flex: 1,
      height: 1,
      background: "rgba(255,255,255,0.08)"
    }}
  />
</div>

<div style={{ display: "flex", justifyContent: "center", gap: 20 }}>
  {[
    { icon: <Shield size={14} />, text: "Privacy First" },
    { icon: <Eye size={14} />, text: "No Data Selling" },
    { icon: <Zap size={14} />, text: "Instant Access" }
  ].map((item, i) => (
    <div
      key={i}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 5,
        color: "rgba(255,255,255,0.3)"
      }}
    >
      {item.icon}
      <span style={{ ...body, fontSize: 11 }}>{item.text}</span>
    </div>
  ))}
</div>
{showSignup && (
  <div
    style={{
      position: "fixed",
      inset: 0,
      background: "rgba(0,0,0,0.75)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 9999
    }}
  >
    <div
      style={{
        width: "90%",
        maxWidth: 420,
        background: "#0F172A",
        borderRadius: 24,
        padding: 24,
        border: "1px solid rgba(255,255,255,0.1)"
      }}
    >
      <h2
        style={{
          color: "white",
          textAlign: "center",
          marginBottom: 20
        }}
      >
        Create Account
      </h2>

      <input
        placeholder="Full Name"
        value={signupName}
        onChange={(e) =>
          setSignupName(e.target.value)
        }
        style={inputStyle}
      />

      <input
        type="email"
        placeholder="Email Address"
        value={signupEmail}
        onChange={(e) =>
          setSignupEmail(e.target.value)
        }
        style={inputStyle}
      />

      <input
        type="password"
        placeholder="Password"
        value={signupPassword}
        onChange={(e) =>
          setSignupPassword(e.target.value)
        }
        style={inputStyle}
      />

      <input
        type="password"
        placeholder="Confirm Password"
        value={confirmPassword}
        onChange={(e) =>
          setConfirmPassword(e.target.value)
        }
        style={inputStyle}
      />

     <button
  disabled={!canCreateAccount}
  onClick={async () => {
    if (
      signupPassword !==
      confirmPassword
    ) {
      alert(
        "Passwords do not match"
      );
      return;
    }

    if (
      !signupName.trim() ||
      !signupEmail.trim() ||
      !signupPassword.trim()
    ) {
      alert("Please fill all fields");
      return;
    }
    const emailRegex =
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

if (!emailRegex.test(signupEmail)) {
  alert("Please enter a valid email");
  return;
}

    await onEmailSignup(
      signupName,
      signupEmail,
      signupPassword
    );
    setSignupName("");
setSignupEmail("");
setSignupPassword("");
setConfirmPassword("");

    setShowSignup(false);
  }}
  style={{
    width: "100%",
    padding: "15px",
    borderRadius: 18,
    border: "none",
    background: T.teal,
    color: "white",
    cursor: !canCreateAccount
      ? "not-allowed"
      : "pointer",
    opacity: !canCreateAccount
      ? 0.5
      : 1,
    marginTop: 12
  }}
>
  Create Account
</button>
      <button
        onClick={() =>
          setShowSignup(false)
        }
        style={{
          width: "100%",
          padding: "15px",
          marginTop: 10,
          borderRadius: 18,
          border:
            "1px solid rgba(255,255,255,0.15)",
          background: "transparent",
          color: "white",
          cursor: "pointer"
        }}
      >
        Cancel
      </button>
    </div>
  </div>
)}

      </div>
    </div>
  );
}
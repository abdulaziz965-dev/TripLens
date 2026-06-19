
import { Phone, Mail, Shield, Eye, Zap } from "lucide-react";
import { T, display, body, heading, label, IMG } from "../theme";
import { LogoMark, StatusBar } from "../components/SharedComponents";
import React, { useState } from "react";

export function LoginScreen({
  onLogin,
  onPhoneLogin,
  onEmailSignup,
  loading,
  error
}: {
  onLogin: () => void;
  onPhoneLogin: () => void;
  onEmailSignup: (email:string, password:string) => void;
  loading?: boolean;
  error?: string | null;
}) {
  const [authMode, setAuthMode] = useState<"social" | "email">("social");
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

      <StatusBar light />

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
          bottom: 0,
          left: 0,
          right: 0,
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
  {authMode === "social" ? (
    <>
      {/* Google */}
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

      {/* Email */}
      <button
        onClick={() => setAuthMode("email")}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 12,
          width: "100%",
          padding: "15px 20px",
          borderRadius: 18,
          cursor: "pointer",
          background: "rgba(20,184,166,0.12)",
          border: `1.5px solid ${T.teal}`,
          color: "white",
          ...heading,
          fontSize: 15
        }}
      >
        <Mail size={20} />
        Continue with Email
      </button>
    </>
  ) : (
    <>
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

      <button
        onClick={() => onEmailSignup(email, password)}
        style={{
          width: "100%",
          padding: "15px",
          borderRadius: 18,
          border: "none",
          background: T.teal,
          color: "white",
          cursor: "pointer",
          ...heading
        }}
      >
        Create Account
      </button>

      <button
        onClick={() => setAuthMode("social")}
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
        ← Back
      </button>
    </>
  )}
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

      </div>
    </div>
  );
}
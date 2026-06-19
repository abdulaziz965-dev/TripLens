import React from "react";
import { Phone, Shield, Eye, Zap } from "lucide-react";
import { T, display, body, heading, label, IMG } from "../theme";
import { LogoMark, StatusBar } from "../components/SharedComponents";

export function LoginScreen({ onLogin, loading, error }: { onLogin: () => void; loading?: boolean; error?: string | null }) {
  return (
    <div style={{ position: "relative", width: "100%", minHeight: "100dvh", overflow: "hidden" }}>
      {/* BG */}
      <div style={{ position: "absolute", inset: 0, background: T.navy }} />
      <img src={IMG.loginBg} alt="Silhouette couple standing on scenic hilltop"
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 20%" }} />
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(15,23,42,0.22) 0%, rgba(15,23,42,0.65) 38%, rgba(15,23,42,0.95) 65%, #0F172A 85%)" }} />

      {/* Top brand */}
      <StatusBar light />
      <div style={{ position: "absolute", top: 70, left: 22, display: "flex", alignItems: "center", gap: 8 }}>
        <LogoMark size={32} />
        <span style={{ ...heading, fontSize: 18, color: "white" }}>TripLens</span>
      </div>

      {/* Glass card */}
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0,
        padding: "28px 22px 40px",
        background: "rgba(15,23,42,0.97)",
        borderTop: "1px solid rgba(255,255,255,0.07)",
      }}>
        {/* Heading */}
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <p style={{ ...label, fontSize: 11, color: T.teal, marginBottom: 8 }}>Step into smart travel</p>
          <h2 style={{ ...display, fontSize: 28, color: "white", letterSpacing: -0.5, marginBottom: 8 }}>
            Welcome Back
          </h2>
          <p style={{ ...body, fontSize: 14, color: "rgba(255,255,255,0.42)", lineHeight: 1.6 }}>
            Sign in to plan your next reality-checked adventure
          </p>
        </div>

        {/* Auth buttons */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 20 }}>
          {/* Google */}
          <button onClick={onLogin} disabled={loading} style={{
            display: "flex", alignItems: "center", justifyContent: "center", gap: 12,
            width: "100%", padding: "15px 20px", borderRadius: 18, border: "none", cursor: "pointer",
            background: "white", boxShadow: "0 4px 24px rgba(0,0,0,0.4)",
            opacity: loading ? 0.7 : 1,
            ...heading, fontSize: 15, color: T.navy,
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            {loading ? "Signing in…" : "Continue with Google"}
          </button>

          {/* Phone */}
          <button disabled style={{
            display: "flex", alignItems: "center", justifyContent: "center", gap: 12,
            width: "100%", padding: "15px 20px", borderRadius: 18, cursor: "pointer",
            background: "rgba(255,255,255,0.08)", backdropFilter: "blur(12px)",
            border: "1.5px solid rgba(255,255,255,0.16)",
            opacity: 0.6,
            ...heading, fontSize: 15, color: "white",
          }}>
            <Phone size={20} />
            Phone sign-in not configured
          </button>
        </div>

        {error ? (
          <p style={{ ...body, fontSize: 12, color: T.red, textAlign: "center", marginBottom: 16, lineHeight: 1.6 }}>
            {error}
          </p>
        ) : null}

        {/* Divider */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
          <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.08)" }} />
          <span style={{ ...body, fontSize: 12, color: "rgba(255,255,255,0.25)" }}>protected by TripLens Trust</span>
          <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.08)" }} />
        </div>

        {/* Trust row */}
        <div style={{ display: "flex", justifyContent: "center", gap: 20 }}>
          {[
            { icon: <Shield size={14}/>, text: "Privacy First" },
            { icon: <Eye size={14}/>, text: "No Data Selling" },
            { icon: <Zap size={14}/>, text: "Instant Access" },
          ].map((item, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 5, color: "rgba(255,255,255,0.3)" }}>
              {item.icon}
              <span style={{ ...body, fontSize: 11 }}>{item.text}</span>
            </div>
          ))}
        </div>

        <p style={{ ...body, fontSize: 11, color: "rgba(255,255,255,0.2)", textAlign: "center", marginTop: 16, lineHeight: 1.7 }}>
          By continuing you agree to our{" "}
          <span style={{ color: "rgba(255,255,255,0.4)" }}>Terms of Service</span>
          {" "}&amp;{" "}
          <span style={{ color: "rgba(255,255,255,0.4)" }}>Privacy Policy</span>
        </p>
      </div>
    </div>
  );
}

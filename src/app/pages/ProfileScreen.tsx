import React from "react";
import { Settings, BadgeCheck, Wallet, ChevronRight, LogOut } from "lucide-react";
import { type User as FirebaseUser } from "firebase/auth";
import { T, display, body, heading } from "../theme";
import {  SectionCard, BottomTabBar, Chip } from "../components/SharedComponents";

const PROFILE_SETTINGS = [
  { icon: <Settings size={16} />, label: "Settings", desc: "Preferences, notifications, and privacy" },
  { icon: <BadgeCheck size={16} />, label: "Traveler Verification", desc: "Identity and trust profile" },
  { icon: <Wallet size={16} />, label: "Payment Methods", desc: "Cards, wallets, and billing details" },
];

export function ProfileScreen({ user, onLogout }: { user: FirebaseUser | null; onLogout: () => void }) {
  const email = user?.email || "traveler@triplens.com";

  const displayName =
    user?.displayName ||
    email.split("@")[0].charAt(0).toUpperCase() +
    email.split("@")[0].slice(1);

  const avatarText = displayName.charAt(0).toUpperCase();
  const [activeModal, setActiveModal] = React.useState<string | null>(null);

  return (
    <div style={{ position: "relative", width: "100%", minHeight: "100dvh", display: "flex", flexDirection: "column", background: T.bg }}>
      <div style={{ flex: 1, overflowY: "auto", scrollbarWidth: "none", paddingBottom: 82 }}>
        <div style={{ background: `linear-gradient(160deg, ${T.navy} 0%, #1d3556 100%)`, paddingBottom: 22, borderRadius: "0 0 28px 28px", boxShadow: "0 8px 32px rgba(15,23,42,0.18)" }}>
          
          <div style={{ padding: "6px 20px 0" }}>
            <p style={{ ...body, fontSize: 13, color: "rgba(255,255,255,0.5)", marginBottom: 4 }}>Profile</p>
            <h1 style={{ ...display, fontSize: 28, color: "white", letterSpacing: -0.7, lineHeight: 1.1 }}>Your account</h1>
            <p style={{ ...body, fontSize: 12, color: "rgba(255,255,255,0.35)", marginTop: 4 }}>Manage your TripLens profile and settings.</p>
          </div>
        </div>

        <div style={{ padding: "18px 20px 0" }}>
          <SectionCard style={{ padding: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ width: 64, height: 64, borderRadius: "50%", background: `linear-gradient(135deg, ${T.teal}, #0891B2)`, display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: 28, boxShadow: "0 16px 36px rgba(20,184,166,0.3)" }}>
                {avatarText}
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ ...heading, fontSize: 20, color: T.navy, marginBottom: 4 }}>{displayName}</p>
                <p style={{ ...body, fontSize: 13, color: T.slate, marginBottom: 10 }}>{email}</p>
                <Chip color={T.green} bg="rgba(16,185,129,0.08)" border="rgba(16,185,129,0.18)">Verified Traveler</Chip>
              </div>
            </div>
          </SectionCard>
        </div>
        <div style={{ padding: "18px 20px 0" }}>
  <SectionCard style={{ padding: 16 }}>
    <p
      style={{
        ...heading,
        fontSize: 18,
        color: T.navy,
        marginBottom: 12
      }}
    >
      Travel Stats
    </p>

    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 16
      }}
    >
      <div>
        <p style={{ ...heading, fontSize: 24 }}>8</p>
        <p style={{ ...body, fontSize: 12 }}>
          Trips Planned
        </p>
      </div>

      <div>
        <p style={{ ...heading, fontSize: 24 }}>
          ₹42K
        </p>
        <p style={{ ...body, fontSize: 12 }}>
          Budget Managed
        </p>
      </div>

      <div>
        <p style={{ ...heading, fontSize: 24 }}>12</p>
        <p style={{ ...body, fontSize: 12 }}>
          Hotels Viewed
        </p>
      </div>

      <div>
        <p style={{ ...heading, fontSize: 24 }}>5</p>
        <p style={{ ...body, fontSize: 12 }}>
          Destinations
        </p>
      </div>
    </div>
  </SectionCard>
</div>

        <div style={{ padding: "18px 20px 0" }}>
          <p style={{ ...heading, fontSize: 19, color: T.navy, marginBottom: 12 }}>Settings</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {PROFILE_SETTINGS.map(item => (
              <SectionCard
                key={item.label}
                style={{
                padding: 16,
                cursor: "pointer"
              }}
              onClick={() => setActiveModal(item.label)}
>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 38, height: 38, borderRadius: 12, background: "rgba(20,184,166,0.08)", border: "1px solid rgba(20,184,166,0.12)", display: "flex", alignItems: "center", justifyContent: "center", color: T.teal, flexShrink: 0 }}>
                    {item.icon}
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ ...heading, fontWeight: 700, fontSize: 14, color: T.navy, marginBottom: 3 }}>{item.label}</p>
                    <p style={{ ...body, fontSize: 12, color: T.slate, lineHeight: 1.45 }}>{item.desc}</p>
                  </div>
                  <ChevronRight size={16} color={T.slateL} />
                </div>
              </SectionCard>
            ))}
          </div>
        </div>

        <div style={{ padding: "18px 20px 0" }}>
          <button onClick={onLogout} style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "14px 0", borderRadius: 16, border: `1px solid rgba(239,68,68,0.18)`, background: "rgba(239,68,68,0.06)", color: T.red, cursor: "pointer", ...heading, fontSize: 15 }}>
            <LogOut size={18} /> Logout
          </button>
        </div>
      </div>
      {activeModal === "Settings" && (
  <div
    style={{
      position: "fixed",
      inset: 0,
      background: "rgba(0,0,0,0.6)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 9999
    }}
  >
    <SectionCard
      style={{
        width: "90%",
        maxWidth: 400,
        padding: 20
      }}
    >
      <h3>Settings</h3>

      <p>🔔 Notifications: Enabled</p>
      <p>🌙 Theme: Light</p>
      <p>💱 Currency: INR</p>

      <button
        onClick={() => setActiveModal(null)}
      >
        Close
      </button>
    </SectionCard>
  </div>
)}
{activeModal === "Traveler Verification" && (
  <div
    style={{
      position: "fixed",
      inset: 0,
      background: "rgba(0,0,0,0.6)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 9999
    }}
  >
    <SectionCard
      style={{
        width: "90%",
        maxWidth: 400,
        padding: 20
      }}
    >
      <h3>Traveler Verification</h3>

      <p>✅ Email Verified</p>
      <p>✅ Account Active</p>
      <p>✅ Trusted Traveler</p>

      <Chip
        color={T.green}
        bg="rgba(16,185,129,0.08)"
        border="rgba(16,185,129,0.18)"
      >
        VERIFIED
      </Chip>

      <div style={{ marginTop: 20 }}>
        <button onClick={() => setActiveModal(null)}>
          Close
        </button>
      </div>
    </SectionCard>
  </div>
)}
{activeModal === "Payment Methods" && (
  <div
    style={{
      position: "fixed",
      inset: 0,
      background: "rgba(0,0,0,0.6)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 9999
    }}
  >
    <SectionCard
      style={{
        width: "90%",
        maxWidth: 400,
        padding: 20
      }}
    >
      <h3>Payment Methods</h3>

      <p>💳 No cards added</p>
      <p>🏦 UPI Supported</p>
      <p>💰 Wallet Ready</p>

      <button
        onClick={() => setActiveModal(null)}
      >
        Close
      </button>
    </SectionCard>
  </div>
)}

      <BottomTabBar />
    </div>
  );
}

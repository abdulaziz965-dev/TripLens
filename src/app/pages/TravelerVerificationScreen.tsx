import React from "react";
import { auth } from "../../firebase/config";
import { ArrowLeft, BadgeCheck, Mail, Calendar, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { T, display, body, heading } from "../theme";
import { SectionCard, Chip } from "../components/SharedComponents";
import { sendEmailVerification } from "firebase/auth";
export function TravelerVerificationScreen() {
  const navigate = useNavigate();
  const user = auth.currentUser;
  const [sending, setSending] = React.useState(false);
  const provider =
    user?.providerData?.[0]?.providerId ?? "Unknown";
  const sendVerification = async () => {
  if (!user) return;

  try {
    setSending(true);

    await sendEmailVerification(user);

    alert(
      "Verification email sent! Please check your inbox."
    );
  } catch (err) {
    console.error(err);
    alert("Failed to send verification email.");
  }

  setSending(false);
};
const refreshVerification = async () => {
  await user?.reload();
  const referencedUser = auth.currentUser;
  if (auth.currentUser?.emailVerified) {
    alert(
      "🎉 Email verified successfully!"
    );

    window.location.reload();
  } else {
    alert(
      "Email is still not verified."
    );
  }
};
  return (
    <div
      style={{
        minHeight: "100dvh",
        background: T.bg,
      }}
    >
      <div
        style={{
          background: `linear-gradient(160deg, ${T.navy} 0%, #1d3556 100%)`,
          padding: "24px 20px 28px",
          borderRadius: "0 0 28px 28px",
        }}
      >
        <button
          onClick={() => navigate("/profile")}
          style={{
            background: "transparent",
            border: "none",
            color: "white",
            cursor: "pointer",
            marginBottom: 12,
          }}
        >
          <ArrowLeft />
        </button>

        <h1
          style={{
            ...display,
            color: "white",
            fontSize: 28,
          }}
        >
          Traveler Verification
        </h1>

        <p
          style={{
            ...body,
            color: "rgba(255,255,255,0.5)",
          }}
        >
          Your account verification status
        </p>
      </div>

      <div
        style={{
          padding: 20,
          display: "flex",
          flexDirection: "column",
          gap: 16,
        }}
      >
        <SectionCard style={{ padding: 18 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Mail size={18} />
            <p style={{ ...heading }}>Email Verification</p>
          </div>

          <div style={{ marginTop: 10 }}>
  {user?.emailVerified ? (
    <p>✅ Verified</p>
  ) : (
    <>
      <p>❌ Not Verified</p>

      <button
        onClick={sendVerification}
        disabled={sending}
        style={{
          marginTop: 10,
          padding: "10px 16px",
          borderRadius: 12,
          border: "none",
          background: T.teal,
          color: "white",
          cursor: "pointer"
        }}
      >
        {sending
          ? "Sending..."
          : "Verify Email"}
      </button>
      <button
  onClick={refreshVerification}
  style={{
    marginTop: 10,
    marginLeft: 10,
    padding: "10px 16px",
    borderRadius: 12,
    border: "1px solid #ddd",
    background: "white",
    cursor: "pointer"
  }}
>
  Refresh Status
</button>
    </>
  )}
</div>
        </SectionCard>

        <SectionCard style={{ padding: 18 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Calendar size={18} />
            <p style={{ ...heading }}>Member Since</p>
          </div>

          <p style={{ marginTop: 10 }}>
            {user?.metadata.creationTime ?? "Unknown"}
          </p>
        </SectionCard>

        <SectionCard style={{ padding: 18 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Shield size={18} />
            <p style={{ ...heading }}>Last Login</p>
          </div>

          <p style={{ marginTop: 10 }}>
            {user?.metadata.lastSignInTime ?? "Unknown"}
          </p>
        </SectionCard>

        <SectionCard style={{ padding: 18 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <BadgeCheck size={18} />
            <p style={{ ...heading }}>Authentication Provider</p>
          </div>

          <p style={{ marginTop: 10 }}>
            {provider}
          </p>
        </SectionCard>

        <Chip
  color={user?.emailVerified ? T.green : T.red}
  bg={
    user?.emailVerified
      ? "rgba(16,185,129,0.08)"
      : "rgba(239,68,68,0.08)"
  }
  border={
    user?.emailVerified
      ? "rgba(16,185,129,0.18)"
      : "rgba(239,68,68,0.18)"
  }
>
  {user?.emailVerified
    ? "VERIFIED TRAVELER"
    : "UNVERIFIED TRAVELER"}
</Chip>
      </div>
    </div>
  );
}
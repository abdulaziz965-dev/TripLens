import React, { useEffect, useState } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "../../firebase/config";
import { ArrowLeft, User, Save } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { T, display, body, heading } from "../theme";
import { SectionCard } from "../components/SharedComponents";

export function EditProfileScreen() {
  const navigate = useNavigate();

  const [displayName, setDisplayName] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    const user = auth.currentUser;
    if (!user) return;

    const snap = await getDoc(
      doc(db, "users", user.uid)
    );

    if (snap.exists()) {
      const data = snap.data();

      setDisplayName(
        data.displayName ||
        user.displayName ||
        user.email?.split("@")[0] ||
        ""
      );
    }
  };

  const saveProfile = async () => {
    const user = auth.currentUser;
    if (!user) return;

    if (!displayName.trim()) {
      alert("Display name cannot be empty");
      return;
    }

    setSaving(true);

    try {
      await updateDoc(
        doc(db, "users", user.uid),
        {
          displayName: displayName.trim(),
        }
      );

      alert("✅ Profile updated successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to update profile");
    }

    setSaving(false);
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
          Edit Profile
        </h1>

        <p
          style={{
            ...body,
            color: "rgba(255,255,255,0.5)",
          }}
        >
          Update your display name
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
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginBottom: 12,
            }}
          >
            <User size={18} />
            <p style={{ ...heading }}>
              Display Name
            </p>
          </div>

          <input
            type="text"
            value={displayName}
            onChange={(e) =>
              setDisplayName(e.target.value)
            }
            placeholder="Enter display name"
            style={{
              width: "100%",
              padding: 12,
              borderRadius: 12,
              border: "1px solid #ddd",
              fontSize: 15,
            }}
          />
        </SectionCard>

        <button
          onClick={saveProfile}
          disabled={saving}
          style={{
            width: "100%",
            padding: 16,
            border: "none",
            borderRadius: 18,
            background: T.teal,
            color: "white",
            cursor: "pointer",
            ...heading,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 8,
          }}
        >
          <Save size={18} />
          {saving
            ? "Saving..."
            : "Save Profile"}
        </button>
      </div>
    </div>
  );
}
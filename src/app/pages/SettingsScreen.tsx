import { useEffect, useState } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "../../firebase/config";
import { ArrowLeft, Bell, Globe, MapPinned, Save } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { T, display, body, heading } from "../theme";
import { SectionCard } from "../components/SharedComponents";
import { toast } from "react-hot-toast";
export function SettingsScreen() {
  const [notifications, setNotifications] = useState(true);
  const [currency, setCurrency] = useState("INR");
  const [distanceUnit, setDistanceUnit] = useState("km");
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    const user = auth.currentUser;
    if (!user) return;

    const snap = await getDoc(doc(db, "users", user.uid));

    if (snap.exists()) {
      const data = snap.data();

      setNotifications(data.notifications ?? true);
      setCurrency(data.currency ?? "INR");
      setDistanceUnit(data.distanceUnit ?? "km");
    }
  };

  const saveSettings = async () => {
    const user = auth.currentUser;
    if (!user) return;

    setSaving(true);

    try {
      await updateDoc(doc(db, "users", user.uid), {
        notifications,
        currency,
        distanceUnit,
      });

      toast.success("Settings saved successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to save settings");
    }

    setSaving(false);
  };

return (
  <div
    style={{
      minHeight: "100dvh",
      background: T.bg,
      display: "flex",
      flexDirection: "column"
    }}
  >
    {/* Header */}
    <div
      style={{
        background: `linear-gradient(160deg, ${T.navy} 0%, #1d3556 100%)`,
        padding: "24px 20px 28px",
        borderRadius: "0 0 28px 28px"
      }}
    >
      <button
        onClick={() => navigate("/profile")}
        style={{
          background: "transparent",
          border: "none",
          color: "white",
          cursor: "pointer",
          marginBottom: 12
        }}
      >
        <ArrowLeft />
      </button>

      <h1
        style={{
          ...display,
          color: "white",
          fontSize: 28,
          marginBottom: 4
        }}
      >
        Settings
      </h1>

      <p
        style={{
          ...body,
          color: "rgba(255,255,255,0.5)"
        }}
      >
        Customize your TripLens experience
      </p>
    </div>

    <div
      style={{
        padding: 20,
        display: "flex",
        flexDirection: "column",
        gap: 16
      }}
    >
      {/* Notifications */}
      <SectionCard style={{ padding: 18 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
          }}
        >
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8
              }}
            >
              <Bell size={18} />
              <p style={{ ...heading }}>Notifications</p>
            </div>

            <p
              style={{
                ...body,
                fontSize: 12,
                marginTop: 4
              }}
            >
              Receive trip updates and alerts
            </p>
          </div>

          <input
            type="checkbox"
            checked={notifications}
            onChange={(e) =>
              setNotifications(e.target.checked)
            }
          />
        </div>
      </SectionCard>

      {/* Currency */}
      <SectionCard style={{ padding: 18 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginBottom: 12
          }}
        >
          <Globe size={18} />
          <p style={{ ...heading }}>Currency</p>
        </div>

        <select
          value={currency}
          onChange={(e) =>
            setCurrency(e.target.value)
          }
          style={{
            width: "100%",
            padding: 12,
            borderRadius: 12
          }}
        >
          <option value="INR">Indian Rupee (₹)</option>
          <option value="USD">US Dollar ($)</option>
          <option value="EUR">Euro (€)</option>
        </select>
      </SectionCard>

      {/* Distance */}
      <SectionCard style={{ padding: 18 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginBottom: 12
          }}
        >
          <MapPinned size={18} />
          <p style={{ ...heading }}>Distance Unit</p>
        </div>

        <select
          value={distanceUnit}
          onChange={(e) =>
            setDistanceUnit(e.target.value)
          }
          style={{
            width: "100%",
            padding: 12,
            borderRadius: 12
          }}
        >
          <option value="km">Kilometers</option>
          <option value="miles">Miles</option>
        </select>
      </SectionCard>

      {/* Save */}
      <button
        onClick={saveSettings}
        disabled={saving}
        style={{
          marginTop: 8,
          width: "100%",
          padding: "16px",
          border: "none",
          borderRadius: 18,
          background: T.teal,
          color: "white",
          cursor: "pointer",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 8,
          ...heading
        }}
      >
        <Save size={18} />
        {saving ? "Saving..." : "Save Settings"}
      </button>
    </div>
  </div>
);
}
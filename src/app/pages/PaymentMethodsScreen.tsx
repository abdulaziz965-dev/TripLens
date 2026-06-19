import React, { useEffect, useState } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "../../firebase/config";
import { ArrowLeft, CreditCard, Save } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { T, display, body, heading } from "../theme";
import { SectionCard } from "../components/SharedComponents";

export function PaymentMethodsScreen() {
  const navigate = useNavigate();

  const [upiId, setUpiId] = useState("");
  const [preferredPayment, setPreferredPayment] = useState("UPI");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadPaymentInfo();
  }, []);

  const loadPaymentInfo = async () => {
    const user = auth.currentUser;
    if (!user) return;

    const snap = await getDoc(doc(db, "users", user.uid));

    if (snap.exists()) {
      const data = snap.data();

      setUpiId(data.upiId ?? "");
      setPreferredPayment(data.preferredPayment ?? "UPI");
    }
  };

  const savePaymentInfo = async () => {
    const user = auth.currentUser;
    if (!user) return;

    setSaving(true);

    try {
      await updateDoc(doc(db, "users", user.uid), {
        upiId,
        preferredPayment,
      });

      alert("Payment methods saved!");
    } catch (err) {
      console.error(err);
      alert("Failed to save payment methods");
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
          Payment Methods
        </h1>

        <p
          style={{
            ...body,
            color: "rgba(255,255,255,0.5)",
          }}
        >
          Manage your payment preferences
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
            <CreditCard size={18} />
            <p style={{ ...heading }}>UPI ID</p>
          </div>

          <input
            type="text"
            placeholder="example@paytm"
            value={upiId}
            onChange={(e) => setUpiId(e.target.value)}
            style={{
              width: "100%",
              padding: 12,
              borderRadius: 12,
              border: "1px solid #ddd",
            }}
          />
        </SectionCard>

        <SectionCard style={{ padding: 18 }}>
          <p
            style={{
              ...heading,
              marginBottom: 12,
            }}
          >
            Preferred Payment Method
          </p>

          <select
            value={preferredPayment}
            onChange={(e) =>
              setPreferredPayment(e.target.value)
            }
            style={{
              width: "100%",
              padding: 12,
              borderRadius: 12,
            }}
          >
            <option value="UPI">UPI</option>
            <option value="Card">Card</option>
            <option value="Wallet">Wallet</option>
          </select>
        </SectionCard>

        <button
          onClick={savePaymentInfo}
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
          }}
        >
          <Save size={18} />
          {" "}
          {saving ? "Saving..." : "Save Payment Methods"}
        </button>
      </div>
    </div>
  );
}
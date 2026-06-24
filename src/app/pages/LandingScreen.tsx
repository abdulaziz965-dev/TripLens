import { Bed, Car, CreditCard, ArrowRight, ChevronRight } from "lucide-react";
import { T, display, body, heading, label, bodyMed, IMG, subhead } from "../theme";
import { LogoMark } from "../components/SharedComponents";

export function LandingScreen({ onStart, onSignIn }: { onStart: () => void; onSignIn: () => void }) {
  const FEATURES = [
    {
      icon: <Bed size={24} />,
      color: T.teal, bg: "#F0FDFA",
      title: "Reality Checked Stays",
      desc: "Know if your family actually fits comfortably — beds, bathrooms, and real room sizes.",
    },
    {
      icon: <Car size={24} />,
      color: "#6366F1", bg: "#EEF2FF",
      title: "Door-To-Door Costs",
      desc: "Understand every rupee from airport transfers, bus stands, hotels to attractions.",
    },
    {
      icon: <CreditCard size={24} />,
      color: "#10B981", bg: "#F0FDF4",
      title: "No Hidden Costs",
      desc: "See resort fees, service charges, and extra levies before you commit your money.",
    },
  ];

  const STATS = [
  { val: "Hotels", label: "Reality Checked" },
  { val: "Transport", label: "Door-To-Door" },
  { val: "Activities", label: "Budget Planned" },
];

  return (
    <div style={{ width: "100%", minHeight: "100dvh", overflowY: "auto", scrollbarWidth: "none", background: T.bg }}>
      {/* ── Hero ──────────────────────────────────────────────────── */}
      <div style={{ position: "relative", height: 530 }}>
        <div style={{ position: "absolute", inset: 0, background: "#0a1628" }} />
        <img src={IMG.hero} alt="Couple on hanging bridge adventure travel"
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 35%" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(0,0,0,0.12) 0%, rgba(10,22,40,0.55) 48%, rgba(10,22,40,0.97) 100%)" }} />

        {/* Header bar */}
        
        <div style={{ position: "absolute", top: 70, left: 20, right: 20, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <LogoMark size={34} />
            <span style={{ ...heading, fontSize: 24, color: "white" }}>TripLens</span>
          </div>
          <button onClick={onSignIn} style={{
            ...bodyMed, fontSize: 13, color: "white",
            background: "rgba(255,255,255,0.14)", backdropFilter: "blur(12px)",
            border: "1px solid rgba(255,255,255,0.22)", borderRadius: 99, padding: "7px 18px",
          }}>Sign In</button>
        </div>
<div
  style={{
    position: "absolute",
    top: 140,
    left: 20,
    right: 20,
    background: "rgba(255,255,255,0.12)",
    backdropFilter: "blur(12px)",
    border: "1px solid rgba(255,255,255,0.18)",
    borderRadius: 20,
    padding: 16,
  }}
>
  <p
    style={{
      color: "white",
      fontSize: 15,
      fontWeight: 700,
      marginBottom: 6,
    }}
  >
    Reality-First Travel Planning
  </p>

  <p
    style={{
      color: "rgba(255,255,255,0.75)",
      fontSize: 12,
      lineHeight: 1.5,
    }}
  >
    Real hotel capacity • Real transport costs • No hidden fees
  </p>
</div>

        {/* Hero copy */}
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "0 22px 24px" }}>
          {/* Badge */}
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            background: "rgba(20,184,166,0.22)", backdropFilter: "blur(8px)",
            border: "1px solid rgba(20,184,166,0.45)", borderRadius: 99,
            padding: "5px 12px", marginBottom: 14,
          }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: T.teal }} />
            <span style={{ ...label, fontSize: 10, color: T.teal }}>Travel Reality Planner</span>
          </div>

          <h1 style={{ ...display, fontSize: 38, color: "white", lineHeight: 1.08, letterSpacing: -1, marginBottom: 12 }}>
            Travel Without<br />Surprises
          </h1>
          <p style={{ ...body, fontSize: 14, color: "rgba(255,255,255,0.6)", lineHeight: 1.65, marginBottom: 22 }}>
            See real costs, room arrangements, transport details,
            and hidden expenses before you book.
          </p>

          {/* Primary CTA */}
          <button onClick={onStart} style={{
            width: "100%", padding: "16px 0", borderRadius: 18, display: "flex",
            alignItems: "center", justifyContent: "center", gap: 8,
            background:
  "linear-gradient(135deg,#14B8A6,#0EA5E9)", color: "white", border: "none", cursor: "pointer",
            ...heading, fontSize: 16,
           boxShadow:
  "0 12px 40px rgba(20,184,166,0.35)",
            marginBottom: 11,
          }}>
            Plan My Trip <ArrowRight size={18} />
          </button>
        </div>
      </div>

      {/* ── Stats band ───────────────────────────────────────────── */}
      <div style={{
        display: "flex", justifyContent: "space-around", alignItems: "center",
        padding: "22px 24px",
background:
  "linear-gradient(135deg,#0F172A,#1E293B)",
      }}>
        {STATS.map((s, i) => (
          <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <span style={{ ...display, fontSize: 24, color: "white" }}>{s.val}</span>
            <span style={{ ...body, fontSize: 11, color: "rgba(255,255,255,0.4)", marginTop: 2 }}>{s.label}</span>
          </div>
        ))}
      </div>

      {/* ── Feature cards ────────────────────────────────────────── */}
      <div style={{ padding: "24px 20px 32px" }}>
        <p style={{ ...heading, fontSize: 24, color: T.navy, marginBottom: 4 }}>What TripLens reveals</p>
        <p style={{ ...body, fontSize: 13, color: T.slateL, marginBottom: 18, lineHeight: 1.6 }}>
          The truth traditional apps hide from you.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {FEATURES.map((f, i) => (
            <div
  key={i}
  onMouseEnter={(e) => {
    e.currentTarget.style.transform =
      "translateY(-3px)";
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.transform =
      "translateY(0)";
  }}
  style={{
    display: "flex",
    alignItems: "flex-start",
    gap: 14,
    background: "white",
    borderRadius: 20,
    padding: "16px 16px",
    boxShadow:
      "0 8px 24px rgba(15,23,42,0.08)",
    border: `1px solid ${T.border}`,
    transition: "all 0.25s ease",
    cursor: "pointer",
  }}
>
              <div style={{
                width: 52, height: 52, borderRadius: 14, flexShrink: 0,
                background: f.bg, color: f.color,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>{f.icon}</div>
              <div style={{ flex: 1 }}>
                <p style={{ ...subhead, fontSize: 14, color: T.navy, marginBottom: 4 }}>{f.title}</p>
                <p style={{ ...body, fontSize: 13, color: T.slate, lineHeight: 1.55 }}>{f.desc}</p>
              </div>
              <ChevronRight size={16} style={{ color: T.slateL, flexShrink: 0, marginTop: 6 }} />
            </div>
          ))}
        </div>
        <div
  style={{
    marginTop: 18,
    background: "white",
    borderRadius: 18,
    padding: 18,
    border: `1px solid ${T.border}`,
  }}
>
  <p
    style={{
      ...heading,
      fontSize: 16,
      marginBottom: 10,
    }}
  >
    Why TripLens?
  </p>

  <p
    style={{
      ...body,
      color: T.slate,
      lineHeight: 1.6,
    }}
  >
    Most travel apps show prices.
    TripLens shows reality.
    Know actual room capacity,
    transport costs, hidden fees,
    and realistic budgets before
    spending your money.
  </p>
</div>

        {/* Trust bar */}
        <div style={{
          marginTop: 20, padding: "16px", borderRadius: 16, textAlign: "center",
          background: "linear-gradient(135deg, rgba(20,184,166,0.07), rgba(20,184,166,0.02))",
          border: "1px solid rgba(20,184,166,0.15)",
        }}>
          <p style={{ ...bodyMed, fontSize: 13, color: T.teal }}>
            🌟 Join smart travelers who plan with reality, not illusions.
          </p>
        </div>
      </div>
    </div>
  );
}

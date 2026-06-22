import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Home, Briefcase, DollarSign, User, Plus, Minus } from "lucide-react";
import { T, bodyMed, body, subhead, display } from "../theme";

// ─────────────────────────────────────────────────────────────────────────────
// Shared micro-components
// ─────────────────────────────────────────────────────────────────────────────
export function Chip({ children, color = T.teal, bg, border }: {
  children: React.ReactNode; color?: string; bg?: string; border?: string;
}) {
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      padding: "4px 10px", borderRadius: 99,
      background: bg ?? `${color}18`,
      border: `1px solid ${border ?? `${color}30`}`,
      color, ...bodyMed, fontSize: 11,
    }}>{children}</span>
  );
}

export function Divider() {
  return <div style={{ height: 1, background: T.border, margin: "4px 0" }} />;
}

// ─────────────────────────────────────────────────────────────────────────────
// Dynamic Island + Status Bar
// ─────────────────────────────────────────────────────────────────────────────
export function Island() {
  return (
    <div style={{
      position: "absolute", top: 14, left: "50%", transform: "translateX(-50%)",
      width: 126, height: 36, background: "#000", borderRadius: 24, zIndex: 60,
      display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
    }}>
      <div style={{ width: 9, height: 9, borderRadius: "50%", background: "#1c1c1e" }} />
      <div style={{ width: 15, height: 15, borderRadius: "50%", background: "#111", border: "1px solid #2a2a2a" }} />
    </div>
  );
}

export function StatusBar({ light }: { light?: boolean }) {
  const c = light ? "rgba(255,255,255,0.9)" : T.navy;
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center",
      padding: "60px 26px 6px", color: c }}>
      <span style={{ ...bodyMed, fontSize: 13 }}>9:41</span>
      <div style={{ display: "flex", alignItems: "center", gap: 6, opacity: 0.85 }}>
        <svg width="17" height="11" viewBox="0 0 17 11" fill={c}>
          <rect x="0" y="5" width="3" height="6" rx="1"/>
          <rect x="4.5" y="3" width="3" height="8" rx="1"/>
          <rect x="9" y="1" width="3" height="10" rx="1"/>
          <rect x="13.5" y="0" width="3" height="11" rx="1" fillOpacity="0.4"/>
        </svg>
        <svg width="16" height="12" viewBox="0 0 16 12" fill={c}>
          <path d="M8 2.2C10.2 2.2 12.2 3.1 13.7 4.6L15 3.3C13.2 1.3 10.7 0 8 0S2.8 1.3 1 3.3L2.3 4.6C3.8 3.1 5.8 2.2 8 2.2Z"/>
          <path d="M8 5.8C9.6 5.8 11.1 6.5 12.2 7.6L13.5 6.3C12.1 4.9 10.1 4 8 4S3.9 4.9 2.5 6.3L3.8 7.6C4.9 6.5 6.4 5.8 8 5.8Z"/>
          <circle cx="8" cy="10.5" r="1.5"/>
        </svg>
        <div style={{ display: "flex", alignItems: "center" }}>
          <div style={{ width: 25, height: 12, borderRadius: 3.5, border: `1.5px solid ${c}`, padding: "2px", display: "flex" }}>
            <div style={{ width: "78%", height: "100%", borderRadius: 1.5, background: c }} />
          </div>
          <div style={{ width: 2, height: 5, background: c, opacity: 0.5, borderRadius: "0 1px 1px 0", marginLeft: 1 }} />
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// TravelLens Lens Logo Mark
// ─────────────────────────────────────────────────────────────────────────────
export function LogoMark({ size = 48, bg = T.teal }: { size?: number; bg?: string }) {
  return (
    <div style={{
      width: size, height: size,
      borderRadius: size * 0.28,
      background: bg,
      display: "flex", alignItems: "center", justifyContent: "center",
      boxShadow: `0 16px 48px ${T.teal}50`,
    }}>
      <svg width={size * 0.56} height={size * 0.56} viewBox="0 0 28 28" fill="none">
        <circle cx="13" cy="13" r="8.5" stroke="white" strokeWidth="2"/>
        <circle cx="13" cy="13" r="4.5" stroke="white" strokeWidth="1.8"/>
        <circle cx="13" cy="13" r="1.8" fill="white"/>
        <line x1="19.5" y1="19.5" x2="25" y2="25" stroke="white" strokeWidth="2.4" strokeLinecap="round"/>
        <circle cx="8" cy="7.5" r="1.1" fill="white" fillOpacity="0.45"/>
      </svg>
    </div>
  );
}

export function AppViewport({ children, background = T.bg }: { children: React.ReactNode; background?: string }) {
  return (
    <div style={{ minHeight: "100dvh", width: "100%", background, overflow: "hidden" }}>
      {children}
    </div>
  );
}

const NAV = [
  { id: "home", path: "/home", icon: <Home size={22} />, label: "Home" },
  { id: "trips", path: "/trips", icon: <Briefcase size={22} />, label: "Trips" },
  { id: "expenses", path: "/expenses", icon: <DollarSign size={22} />, label: "Expenses" },
  { id: "profile", path: "/profile", icon: <User size={22} />, label: "Profile" },
] as const;

export function BottomTabBar() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div style={{
      position: "absolute", bottom: 0, left: 0, right: 0,
      background: "white", borderTop: `1px solid ${T.border}`,
      display: "flex", justifyContent: "space-around", alignItems: "center",
      paddingTop: 10, paddingBottom: 18,
      boxShadow: "0 -8px 32px rgba(15,23,42,0.07)",
    }}>
      {NAV.map(t => {
        const active = location.pathname === t.path || (t.id === "trips" && location.pathname.startsWith("/trip/"));
        return (
          <button key={t.id} onClick={() => navigate(t.path)} style={{
            display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
            padding: "2px 12px", background: "none", border: "none", cursor: "pointer",
            color: active ? T.teal : T.slateL,
            transition: "color .15s",
          }}>
            <div style={{ transform: active ? "scale(1.12)" : "scale(1)", transition: "transform .15s" }}>{t.icon}</div>
            <span style={{ ...bodyMed, fontSize: 10, letterSpacing: "0.02em", fontWeight: active ? 700 : 500 }}>{t.label}</span>
            {active && <div style={{ width: 4, height: 4, borderRadius: "50%", background: T.teal }} />}
          </button>
        );
      })}
    </div>
  );
}

export function SectionCard({ children, style, onClick }: { children: React.ReactNode; style?: React.CSSProperties; onClick?: () => void }) {
  return (
    <div
      onClick={onClick}
      style={{
        borderRadius: 20,
        background: "white",
        border: `1px solid ${T.border}`,
        boxShadow: "0 4px 28px rgba(15,23,42,0.08)",
        ...style,
      }}>
      {children}
    </div>
  );
}

export function AmountPill({ value, subtle }: { value: string; subtle?: boolean }) {
  return (
    <span style={{
      ...subhead,
      fontSize: 13,
      color: subtle ? T.slate : T.navy,
      background: subtle ? T.bg : "rgba(20,184,166,0.08)",
      border: `1px solid ${subtle ? T.border : "rgba(20,184,166,0.16)"}`,
      borderRadius: 99,
      padding: "6px 10px",
      whiteSpace: "nowrap",
    }}>{value}</span>
  );
}

export function GuestCounter({ label: lbl, sub, value, onChange, last }: {
  label: string; sub: string; value: number; onChange: (v: number) => void; last?: boolean;
}) {
  return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 0",
      borderBottom: last ? "none" : `1px solid ${T.border}`,
    }}>
      <div>
        <p style={{ ...subhead, fontSize: 14, color: T.navy }}>{lbl}</p>
        <p style={{ ...body, fontSize: 11, color: T.slateL, marginTop: 2 }}>{sub}</p>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <button onClick={() => onChange(Math.max(0, value - 1))} style={{
          width: 34, height: 34, borderRadius: "50%", border: "none", cursor: "pointer",
          background: value === 0 ? T.bg : T.navy, color: value === 0 ? T.slateL : "white",
          display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
          transition: "all .15s",
        }}><Minus size={14} /></button>
        <span style={{ ...display, fontSize: 18, color: T.navy, minWidth: 28, textAlign: "center" }}>{value}</span>
        <button onClick={() => onChange(value + 1)} style={{
          width: 34, height: 34, borderRadius: "50%", border: "none", cursor: "pointer",
          background: T.teal, color: "white",
          display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
          boxShadow: `0 4px 14px rgba(20,184,166,0.38)`,
        }}><Plus size={14} /></button>
      </div>
    </div>
  );
}

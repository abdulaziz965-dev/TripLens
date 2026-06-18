import { useState, useEffect } from "react";
import { BrowserRouter, Navigate, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import {
  Search, Home, Compass, Briefcase, DollarSign, User,
  ArrowRight, MapPin, Calendar, AlertTriangle, CheckCircle,
  ChevronLeft, Plus, Minus, Phone, Car, CreditCard,
  Eye, Shield, TrendingUp, Clock, Star, ChevronRight,
  Bed, Wallet, Info, Zap,
} from "lucide-react";

// ─────────────────────────────────────────────────────────────────────────────
// Image registry
// ─────────────────────────────────────────────────────────────────────────────
const IMG = {
  splash:   "https://images.unsplash.com/photo-1774979131447-525875465c2a?w=800&h=1000&fit=crop&auto=format",
  hero:     "https://images.unsplash.com/photo-1566759996874-04d713cc224a?w=800&h=700&fit=crop&auto=format",
  loginBg:  "https://images.unsplash.com/photo-1529305068150-201f3ded72c5?w=800&h=1000&fit=crop&auto=format",
  ooty:     "https://images.unsplash.com/photo-1603640979625-251bd448907d?w=500&h=400&fit=crop&auto=format",
  munnar:   "https://images.unsplash.com/photo-1742106854508-3b9172e52545?w=500&h=400&fit=crop&auto=format",
  goa:      "https://images.unsplash.com/photo-1642922835816-e2ac68db5c42?w=500&h=400&fit=crop&auto=format",
  coorg:    "https://images.unsplash.com/photo-1616388969587-8196f32388b4?w=500&h=400&fit=crop&auto=format",
  rajasthan:"https://images.unsplash.com/photo-1673115955449-4e50a5e78c9c?w=500&h=400&fit=crop&auto=format",
};

// ─────────────────────────────────────────────────────────────────────────────
// Design tokens
// ─────────────────────────────────────────────────────────────────────────────
const T = {
  navy:    "#0F172A",
  teal:    "#14B8A6",
  slate:   "#64748B",
  slateL:  "#94A3B8",
  bg:      "#F8FAFC",
  white:   "#FFFFFF",
  amber:   "#F59E0B",
  green:   "#10B981",
  red:     "#EF4444",
  card:    "#FFFFFF",
  border:  "rgba(15,23,42,0.07)",
};

// ─────────────────────────────────────────────────────────────────────────────
// Typography helpers
// ─────────────────────────────────────────────────────────────────────────────
const FK = { fontFamily: "'Plus Jakarta Sans', sans-serif" } as const;
const FI = { fontFamily: "'Inter', sans-serif" } as const;
const display  = { ...FK, fontWeight: 900 } as React.CSSProperties;
const heading  = { ...FK, fontWeight: 800 } as React.CSSProperties;
const subhead  = { ...FK, fontWeight: 700 } as React.CSSProperties;
const body     = { ...FI, fontWeight: 400 } as React.CSSProperties;
const bodyMed  = { ...FI, fontWeight: 600 } as React.CSSProperties;
const label    = { ...FI, fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase" as const };

// ─────────────────────────────────────────────────────────────────────────────
// Shared micro-components
// ─────────────────────────────────────────────────────────────────────────────
function Chip({ children, color = T.teal, bg, border }: {
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

function Divider() {
  return <div style={{ height: 1, background: T.border, margin: "4px 0" }} />;
}

// ─────────────────────────────────────────────────────────────────────────────
// Dynamic Island + Status Bar
// ─────────────────────────────────────────────────────────────────────────────
function Island() {
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

function StatusBar({ light }: { light?: boolean }) {
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
// TripLens Lens Logo Mark
// ─────────────────────────────────────────────────────────────────────────────
function LogoMark({ size = 48, bg = T.teal }: { size?: number; bg?: string }) {
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

const NAV = [
  { id: "home", path: "/home", icon: <Home size={22} />, label: "Home" },
  { id: "trips", path: "/trips", icon: <Briefcase size={22} />, label: "Trips" },
  { id: "expenses", path: "/expenses", icon: <DollarSign size={22} />, label: "Expenses" },
  { id: "profile", path: "/profile", icon: <User size={22} />, label: "Profile" },
] as const;

function AppViewport({ children, background = T.bg }: { children: React.ReactNode; background?: string }) {
  return (
    <div style={{ minHeight: "100dvh", width: "100%", background, overflow: "hidden" }}>
      {children}
    </div>
  );
}

function BottomTabBar() {
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
        const active = location.pathname === t.path;
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

function SplashRoute() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = window.setTimeout(() => navigate("/landing", { replace: true }), 3400);
    return () => window.clearTimeout(timer);
  }, [navigate]);

  return (
    <AppViewport background="#05090f">
      <SplashScreen onDone={() => navigate("/landing", { replace: true })} />
    </AppViewport>
  );
}

function LandingRoute() {
  const navigate = useNavigate();
  return (
    <AppViewport>
      <LandingScreen onStart={() => navigate("/login")} onSignIn={() => navigate("/login")} />
    </AppViewport>
  );
}

function LoginRoute() {
  const navigate = useNavigate();
  return (
    <AppViewport background={T.navy}>
      <LoginScreen onLogin={() => navigate("/home")} />
    </AppViewport>
  );
}

function HomeRoute() {
  const navigate = useNavigate();
  return (
    <AppViewport>
      <HomeScreen onCreateTrip={() => navigate("/create-trip")} />
    </AppViewport>
  );
}

function CreateTripRoute() {
  const navigate = useNavigate();
  return (
    <AppViewport>
      <CreateTripScreen onBack={() => navigate("/home")} onDone={() => navigate("/home")} />
    </AppViewport>
  );
}

function PlaceholderRoute({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <AppViewport>
      <div style={{ minHeight: "100dvh", display: "flex", flexDirection: "column", background: T.bg, position: "relative" }}>
        <div style={{ padding: "24px 20px 90px" }}>
          <StatusBar />
          <div style={{ marginTop: 20, borderRadius: 24, background: "white", border: `1px solid ${T.border}`, padding: 24, boxShadow: "0 8px 32px rgba(15,23,42,0.08)" }}>
            <p style={{ ...label, fontSize: 11, color: T.teal, marginBottom: 8 }}>Coming Soon</p>
            <h1 style={{ ...display, fontSize: 28, color: T.navy, letterSpacing: -0.6, marginBottom: 8 }}>{title}</h1>
            <p style={{ ...body, fontSize: 14, color: T.slate, lineHeight: 1.7 }}>{subtitle}</p>
          </div>
        </div>
        <BottomTabBar />
      </div>
    </AppViewport>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SplashRoute />} />
        <Route path="/landing" element={<LandingRoute />} />
        <Route path="/login" element={<LoginRoute />} />
        <Route path="/home" element={<HomeRoute />} />
        <Route path="/create-trip" element={<CreateTripRoute />} />
        <Route path="/trips" element={<PlaceholderRoute title="Trips" subtitle="Saved trips, trip history, and planning details will live here." />} />
        <Route path="/expenses" element={<PlaceholderRoute title="Expenses" subtitle="Budget tracking and shared expense reconciliation will appear here." />} />
        <Route path="/profile" element={<PlaceholderRoute title="Profile" subtitle="Account settings, preferences, and traveler details belong here." />} />
        <Route path="*" element={<Navigate to="/landing" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SCREEN 1 — Splash
// ─────────────────────────────────────────────────────────────────────────────
function SplashScreen({ onDone }: { onDone: () => void }) {
  const [pct, setPct] = useState(0);

  useEffect(() => {
    const start = Date.now();
    const dur = 3200;
    const raf = () => {
      const p = Math.min(100, ((Date.now() - start) / dur) * 100);
      setPct(Math.round(p));
      if (p < 100) requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);
  }, []);

  return (
    <div onClick={onDone} style={{ position: "relative", width: "100%", minHeight: "100dvh", cursor: "pointer" }}>
      {/* BG */}
      <div style={{ position: "absolute", inset: 0, background: "#030810" }} />
      <img src={IMG.splash} alt="Misty mountain valley at dawn" style={{
        position: "absolute", inset: 0, width: "100%", height: "100%",
        objectFit: "cover", objectPosition: "center 40%",
      }} />
      {/* Layered overlays */}
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(3,8,16,.55) 0%, rgba(3,8,16,.25) 40%, rgba(3,8,16,.7) 70%, rgba(3,8,16,.98) 100%)" }} />

      {/* Animated rings behind logo */}
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
        {[1,2,3].map(i => (
          <div key={i} style={{
            position: "absolute",
            width: 90 + i * 58, height: 90 + i * 58,
            borderRadius: "50%",
            border: `1px solid ${T.teal}`,
            animation: `pulseRing ${1.6 + i * 0.3}s ease-in-out ${i * 0.2}s infinite`,
          }} />
        ))}
      </div>

      {/* Center content */}
      <div style={{
        position: "absolute", inset: 0,
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        paddingBottom: 60,
      }}>
        <LogoMark size={82} />
        <h1 style={{ ...display, fontSize: 46, color: "white", letterSpacing: -1.5, margin: "20px 0 10px" }}>
          TripLens
        </h1>
        <p style={{ ...body, fontSize: 13, color: "rgba(255,255,255,0.45)", letterSpacing: "0.12em", textTransform: "uppercase", textAlign: "center", lineHeight: 1.8 }}>
          Know The Trip<br />Before You Take It
        </p>
      </div>

      {/* Bottom loading area */}
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0,
        padding: "0 40px 52px",
        display: "flex", flexDirection: "column", alignItems: "center", gap: 12,
      }}>
        {/* Percentage */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 5, height: 5, borderRadius: "50%", background: T.teal, opacity: 0.8 }} />
          <span style={{ ...body, fontSize: 12, color: "rgba(255,255,255,0.3)" }}>Loading intelligence… {pct}%</span>
        </div>
        {/* Bar */}
        <div style={{ width: "100%", height: 2, borderRadius: 99, background: "rgba(255,255,255,0.08)", overflow: "hidden" }}>
          <div style={{
            height: "100%", borderRadius: 99,
            background: `linear-gradient(90deg, ${T.teal}, #22D3EE)`,
            animation: "splashBar 3.4s ease-in-out forwards",
          }} />
        </div>
        {/* Tap hint */}
        <span style={{ ...body, fontSize: 11, color: "rgba(255,255,255,0.18)", letterSpacing: "0.06em" }}>Tap anywhere to skip</span>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SCREEN 2 — Landing
// ─────────────────────────────────────────────────────────────────────────────
function LandingScreen({ onStart, onSignIn }: { onStart: () => void; onSignIn: () => void }) {
  const FEATURES = [
    {
      icon: <Bed size={20} />,
      color: T.teal, bg: "#F0FDFA",
      title: "Reality Checked Stays",
      desc: "Know if your family actually fits comfortably — beds, bathrooms, and real room sizes.",
    },
    {
      icon: <Car size={20} />,
      color: "#6366F1", bg: "#EEF2FF",
      title: "Door-To-Door Costs",
      desc: "Understand every rupee from airport transfers, bus stands, hotels to attractions.",
    },
    {
      icon: <CreditCard size={20} />,
      color: "#10B981", bg: "#F0FDF4",
      title: "No Hidden Costs",
      desc: "See resort fees, service charges, and extra levies before you commit your money.",
    },
  ];

  const STATS = [
    { val: "50K+", label: "Trips planned" },
    { val: "4.9★", label: "App Store" },
    { val: "₹0", label: "Hidden surprises" },
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
        <StatusBar light />
        <div style={{ position: "absolute", top: 70, left: 20, right: 20, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <LogoMark size={34} />
            <span style={{ ...heading, fontSize: 20, color: "white" }}>TripLens</span>
          </div>
          <button onClick={onSignIn} style={{
            ...bodyMed, fontSize: 13, color: "white",
            background: "rgba(255,255,255,0.14)", backdropFilter: "blur(12px)",
            border: "1px solid rgba(255,255,255,0.22)", borderRadius: 99, padding: "7px 18px",
          }}>Sign In</button>
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
            background: T.teal, color: "white", border: "none", cursor: "pointer",
            ...heading, fontSize: 16,
            boxShadow: `0 14px 48px rgba(20,184,166,0.48)`,
            marginBottom: 11,
          }}>
            Start Planning <ArrowRight size={18} />
          </button>
        </div>
      </div>

      {/* ── Stats band ───────────────────────────────────────────── */}
      <div style={{
        display: "flex", justifyContent: "space-around", alignItems: "center",
        padding: "18px 24px", background: T.navy,
      }}>
        {STATS.map((s, i) => (
          <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <span style={{ ...display, fontSize: 20, color: "white" }}>{s.val}</span>
            <span style={{ ...body, fontSize: 11, color: "rgba(255,255,255,0.4)", marginTop: 2 }}>{s.label}</span>
          </div>
        ))}
      </div>

      {/* ── Feature cards ────────────────────────────────────────── */}
      <div style={{ padding: "24px 20px 32px" }}>
        <p style={{ ...heading, fontSize: 20, color: T.navy, marginBottom: 4 }}>What TripLens reveals</p>
        <p style={{ ...body, fontSize: 13, color: T.slateL, marginBottom: 18, lineHeight: 1.6 }}>
          The truth traditional apps hide from you.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {FEATURES.map((f, i) => (
            <div key={i} style={{
              display: "flex", alignItems: "flex-start", gap: 14,
              background: "white", borderRadius: 20, padding: "16px 16px",
              boxShadow: "0 2px 20px rgba(15,23,42,0.06)",
              border: `1px solid ${T.border}`,
            }}>
              <div style={{
                width: 46, height: 46, borderRadius: 14, flexShrink: 0,
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

        {/* Trust bar */}
        <div style={{
          marginTop: 20, padding: "16px", borderRadius: 16, textAlign: "center",
          background: "linear-gradient(135deg, rgba(20,184,166,0.07), rgba(20,184,166,0.02))",
          border: "1px solid rgba(20,184,166,0.15)",
        }}>
          <p style={{ ...bodyMed, fontSize: 13, color: T.teal }}>
            🌟 Join 50,000+ smart travelers who plan with reality, not illusions.
          </p>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SCREEN 3 — Login
// ─────────────────────────────────────────────────────────────────────────────
function LoginScreen({ onLogin }: { onLogin: () => void }) {
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
          <button onClick={onLogin} style={{
            display: "flex", alignItems: "center", justifyContent: "center", gap: 12,
            width: "100%", padding: "15px 20px", borderRadius: 18, border: "none", cursor: "pointer",
            background: "white", boxShadow: "0 4px 24px rgba(0,0,0,0.4)",
            ...subhead, fontSize: 15, color: T.navy,
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>

          {/* Phone */}
          <button onClick={onLogin} style={{
            display: "flex", alignItems: "center", justifyContent: "center", gap: 12,
            width: "100%", padding: "15px 20px", borderRadius: 18, cursor: "pointer",
            background: "rgba(255,255,255,0.08)", backdropFilter: "blur(12px)",
            border: "1.5px solid rgba(255,255,255,0.16)",
            ...subhead, fontSize: 15, color: "white",
          }}>
            <Phone size={20} />
            Continue with Phone Number
          </button>
        </div>

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

// ─────────────────────────────────────────────────────────────────────────────
// SCREEN 4 — Home
// ─────────────────────────────────────────────────────────────────────────────
const DESTINATIONS = [
  { name: "Ooty", sub: "Tamil Nadu", tag: "Hill Station", temp: "18°C", from: "₹3,200", img: IMG.ooty, rating: 4.8, hrs: "6h drive" },
  { name: "Munnar", sub: "Kerala", tag: "Tea Gardens", temp: "16°C", from: "₹4,100", img: IMG.munnar, rating: 4.9, hrs: "4h drive" },
  { name: "Goa", sub: "West Coast", tag: "Beach Town", temp: "29°C", from: "₹6,800", img: IMG.goa, rating: 4.7, hrs: "Fly 1.5h" },
  { name: "Coorg", sub: "Karnataka", tag: "Coffee Hills", temp: "20°C", from: "₹2,900", img: IMG.coorg, rating: 4.6, hrs: "5h drive" },
  { name: "Rajasthan", sub: "Heritage", tag: "Royal Culture", temp: "32°C", from: "₹9,500", img: IMG.rajasthan, rating: 4.8, hrs: "Fly 2h" },
];

const REALITY_INSIGHTS = [
  { icon: "🛏️", text: "Hotels advertising 5-person rooms may only provide 4 beds. Always call ahead.", type: "warn" },
  { icon: "🚕", text: "Goa taxi fares aren't metered — always negotiate before you get in.", type: "warn" },
  { icon: "🍽️", text: "Most hill station resorts charge for meals separately. Budget ₹500–800/day.", type: "info" },
  { icon: "🔒", text: "Homestays in Munnar often share bathrooms between multiple families.", type: "warn" },
];

function HomeScreen({
  onCreateTrip,
}: { onCreateTrip: () => void }) {
  const [insightIdx, setInsightIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setInsightIdx(i => (i + 1) % REALITY_INSIGHTS.length), 4000);
    return () => clearInterval(t);
  }, []);

  const insight = REALITY_INSIGHTS[insightIdx];

  return (
    <div style={{ position: "relative", width: "100%", minHeight: "100dvh", display: "flex", flexDirection: "column", background: T.bg }}>
      {/* Scrollable body */}
      <div style={{ flex: 1, overflowY: "auto", scrollbarWidth: "none", paddingBottom: 82 }}>

        {/* ── Header ──────────────────────────────────────────────── */}
        <div style={{
          background: `linear-gradient(160deg, ${T.navy} 0%, #1e3a5f 100%)`,
          paddingBottom: 24, borderRadius: "0 0 28px 28px",
          boxShadow: "0 8px 32px rgba(15,23,42,0.18)",
        }}>
          <StatusBar light />
          <div style={{ padding: "6px 20px 0", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <p style={{ ...body, fontSize: 13, color: "rgba(255,255,255,0.5)", marginBottom: 4 }}>Good Morning ☀️</p>
              <h1 style={{ ...display, fontSize: 27, color: "white", letterSpacing: -0.6, lineHeight: 1.1 }}>
                Alex
              </h1>
              <p style={{ ...body, fontSize: 12, color: "rgba(255,255,255,0.35)", marginTop: 4 }}>
                Your next adventure awaits
              </p>
            </div>
            {/* Avatar */}
            <div style={{
              width: 48, height: 48, borderRadius: "50%",
              background: `linear-gradient(135deg, ${T.teal}, #0891B2)`,
              border: `2.5px solid ${T.teal}`,
              boxShadow: `0 0 0 3px rgba(20,184,166,0.2)`,
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24,
            }}>👤</div>
          </div>

          {/* Search */}
          <div style={{ margin: "18px 20px 0" }}>
            <div style={{
              display: "flex", alignItems: "center", gap: 12,
              background: "rgba(255,255,255,0.1)", backdropFilter: "blur(10px)",
              borderRadius: 16, padding: "13px 16px",
              border: "1.5px solid rgba(255,255,255,0.14)",
            }}>
              <Search size={18} style={{ color: "rgba(255,255,255,0.5)", flexShrink: 0 }} />
              <span style={{ ...body, fontSize: 14, color: "rgba(255,255,255,0.45)", flex: 1 }}>
                Where do you want to go?
              </span>
              <div style={{
                display: "flex", alignItems: "center", gap: 4,
                background: "rgba(20,184,166,0.25)", borderRadius: 99, padding: "4px 10px",
              }}>
                <MapPin size={12} style={{ color: T.teal }} />
                <span style={{ ...bodyMed, fontSize: 11, color: T.teal }}>Nearby</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Reality Check (rotating) ──────────────────────────── */}
        <div style={{ padding: "18px 20px 0" }}>
          <div style={{
            display: "flex", gap: 12, alignItems: "flex-start",
            background: insight.type === "warn"
              ? "linear-gradient(135deg, #FFFBEB, #FEF3C7)"
              : "linear-gradient(135deg, #EFF6FF, #DBEAFE)",
            borderRadius: 18, padding: "14px 16px",
            border: `1px solid ${insight.type === "warn" ? "rgba(245,158,11,0.25)" : "rgba(59,130,246,0.2)"}`,
          }}>
            <div style={{
              width: 40, height: 40, borderRadius: 12, flexShrink: 0,
              background: insight.type === "warn" ? T.amber : "#3B82F6",
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18,
              boxShadow: `0 6px 18px ${insight.type === "warn" ? "rgba(245,158,11,0.35)" : "rgba(59,130,246,0.3)"}`,
            }}>{insight.icon}</div>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 5 }}>
                <p style={{ ...subhead, fontSize: 12, color: insight.type === "warn" ? "#92400E" : "#1E40AF" }}>
                  Reality Check
                </p>
                <Chip color={insight.type === "warn" ? T.amber : "#3B82F6"}>
                  #{insightIdx + 1} of {REALITY_INSIGHTS.length}
                </Chip>
              </div>
              <p style={{ ...body, fontSize: 13, color: insight.type === "warn" ? "#78350F" : "#1E3A8A", lineHeight: 1.6 }}>
                {insight.text}
              </p>
            </div>
          </div>
        </div>

        {/* ── Seasonal Picks ────────────────────────────────────── */}
        <div style={{ paddingTop: 22 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 20px", marginBottom: 14 }}>
            <div>
              <p style={{ ...heading, fontSize: 19, color: T.navy }}>Seasonal Picks</p>
              <p style={{ ...body, fontSize: 12, color: T.slateL, marginTop: 2 }}>Best for June–August</p>
            </div>
            <span style={{ ...bodyMed, fontSize: 13, color: T.teal }}>See all</span>
          </div>

          <div style={{ display: "flex", gap: 14, overflowX: "auto", scrollbarWidth: "none", padding: "0 20px" }}>
            {DESTINATIONS.map(d => (
              <div key={d.name} style={{
                flexShrink: 0, width: 186, borderRadius: 20, overflow: "hidden",
                background: T.navy,
                boxShadow: "0 8px 32px rgba(15,23,42,0.16)",
              }}>
                {/* Photo */}
                <div style={{ position: "relative", height: 140 }}>
                  <img src={d.img} alt={d.name}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(0,0,0,0) 25%, rgba(15,23,42,0.88) 100%)" }} />
                  {/* Tag */}
                  <div style={{
                    position: "absolute", top: 9, left: 9,
                    background: "rgba(20,184,166,0.9)", backdropFilter: "blur(6px)",
                    borderRadius: 99, padding: "3px 9px",
                  }}>
                    <span style={{ ...label, fontSize: 9, color: "white" }}>{d.tag}</span>
                  </div>
                  {/* Rating */}
                  <div style={{
                    position: "absolute", top: 9, right: 9, display: "flex", alignItems: "center", gap: 3,
                    background: "rgba(0,0,0,0.45)", backdropFilter: "blur(4px)", borderRadius: 99, padding: "3px 8px",
                  }}>
                    <Star size={9} fill="#FCD34D" stroke="none" />
                    <span style={{ ...bodyMed, fontSize: 10, color: "white" }}>{d.rating}</span>
                  </div>
                  {/* Destination info */}
                  <div style={{ position: "absolute", bottom: 8, left: 10, right: 10 }}>
                    <p style={{ ...display, fontSize: 17, color: "white", letterSpacing: -0.3 }}>{d.name}</p>
                    <p style={{ ...body, fontSize: 11, color: "rgba(255,255,255,0.6)" }}>{d.sub} · {d.temp}</p>
                  </div>
                </div>
                {/* Cost row */}
                <div style={{ padding: "10px 12px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <p style={{ ...body, fontSize: 10, color: "rgba(255,255,255,0.38)" }}>From per night</p>
                    <p style={{ ...subhead, fontSize: 14, color: "white" }}>{d.from}</p>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 4, background: "rgba(255,255,255,0.08)", borderRadius: 99, padding: "4px 9px" }}>
                    <Clock size={10} style={{ color: "rgba(255,255,255,0.45)" }} />
                    <span style={{ ...body, fontSize: 10, color: "rgba(255,255,255,0.5)" }}>{d.hrs}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Continue Planning ─────────────────────────────────── */}
        <div style={{ padding: "22px 20px 0" }}>
          <p style={{ ...heading, fontSize: 19, color: T.navy, marginBottom: 14 }}>Continue Planning</p>
          <div style={{
            borderRadius: 20, overflow: "hidden", background: "white",
            boxShadow: "0 4px 28px rgba(15,23,42,0.1)",
            border: `1px solid ${T.border}`,
          }}>
            {/* Trip hero image */}
            <div style={{ position: "relative", height: 116 }}>
              <img src={IMG.goa} alt="Goa trip" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              <div style={{ position: "absolute", inset: 0, background: "rgba(15,23,42,0.62)" }} />
              <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 16px" }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 5 }}>
                    <span style={{
                      ...label, fontSize: 9, color: T.teal,
                      background: "rgba(20,184,166,0.2)", border: "1px solid rgba(20,184,166,0.35)",
                      borderRadius: 99, padding: "2px 8px",
                    }}>In Progress</span>
                  </div>
                  <p style={{ ...display, fontSize: 18, color: "white", letterSpacing: -0.3 }}>Goa Family Trip</p>
                  <p style={{ ...body, fontSize: 12, color: "rgba(255,255,255,0.6)", marginTop: 2 }}>
                    Dec 20–27, 2024 · 4 Adults, 2 Kids
                  </p>
                </div>
                <div style={{
                  width: 38, height: 38, borderRadius: "50%", background: T.teal,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  boxShadow: `0 4px 16px rgba(20,184,166,0.45)`,
                }}>
                  <ArrowRight size={16} color="white" />
                </div>
              </div>
            </div>

            {/* Progress bar */}
            <div style={{ padding: "12px 16px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ ...body, fontSize: 12, color: T.slate }}>Planning progress</span>
                <span style={{ ...bodyMed, fontSize: 12, color: T.teal }}>65%</span>
              </div>
              <div style={{ height: 5, background: T.bg, borderRadius: 99, overflow: "hidden" }}>
                <div style={{ width: "65%", height: "100%", background: `linear-gradient(90deg, ${T.teal}, #22D3EE)`, borderRadius: 99 }} />
              </div>
              <div style={{ display: "flex", gap: 16, marginTop: 10 }}>
                {[
                  { icon: <CheckCircle size={13}/>, text: "Hotels reviewed", ok: true },
                  { icon: <AlertTriangle size={13}/>, text: "Costs pending", ok: false },
                  { icon: <Info size={13}/>, text: "Transport open", ok: false },
                ].map((item, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 4,
                    color: item.ok ? T.green : T.amber }}>
                    {item.icon}
                    <span style={{ ...bodyMed, fontSize: 11 }}>{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── Quick Budget Insight ─────────────────────────────── */}
        <div style={{ padding: "18px 20px 0" }}>
          <div style={{
            background: T.navy, borderRadius: 20, padding: "16px",
            display: "flex", alignItems: "center", gap: 14,
          }}>
            <div style={{
              width: 44, height: 44, borderRadius: 14,
              background: "rgba(20,184,166,0.15)", border: "1px solid rgba(20,184,166,0.25)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <TrendingUp size={20} style={{ color: T.teal }} />
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ ...subhead, fontSize: 14, color: "white" }}>Goa Trip Estimate</p>
              <p style={{ ...body, fontSize: 12, color: "rgba(255,255,255,0.45)", marginTop: 2 }}>6 people · 7 nights</p>
            </div>
            <div style={{ textAlign: "right" }}>
              <p style={{ ...display, fontSize: 18, color: T.teal }}>₹48,500</p>
              <p style={{ ...body, fontSize: 11, color: "rgba(255,255,255,0.35)" }}>full budget</p>
            </div>
          </div>
        </div>

        {/* ── Plan new trip CTA ─────────────────────────────────── */}
        <div style={{ padding: "16px 20px 0" }}>
          <button onClick={onCreateTrip} style={{
            width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            borderRadius: 18, padding: "15px 0", border: `1.5px solid ${T.teal}`,
            background: "rgba(20,184,166,0.07)", cursor: "pointer",
            ...subhead, fontSize: 15, color: T.teal,
          }}>
            <Plus size={18} /> Plan a New Trip
          </button>
        </div>
      </div>

      <BottomTabBar />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Guest Counter (standalone component)
// ─────────────────────────────────────────────────────────────────────────────
function GuestCounter({ label: lbl, sub, value, onChange, last }: {
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

// ─────────────────────────────────────────────────────────────────────────────
// SCREEN 5 — Create Trip
// ─────────────────────────────────────────────────────────────────────────────
const TRIP_TYPES = [
  { id: "family",    icon: "👨‍👩‍👧‍👦", label: "Family"    },
  { id: "adventure", icon: "🏔️",      label: "Adventure" },
  { id: "romantic",  icon: "💑",      label: "Romantic"  },
  { id: "solo",      icon: "🎒",      label: "Solo"      },
];

function CreateTripScreen({ onBack, onDone }: { onBack: () => void; onDone: () => void }) {
  const [tripType, setTripType] = useState("family");
  const [tripName, setTripName] = useState("");
  const [destination, setDestination] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [seniors, setSeniors] = useState(0);

  const totalTravelers = adults + children + seniors;

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "13px 16px", borderRadius: 14,
    border: `1.5px solid ${T.border}`, background: "white", outline: "none",
    ...body, fontSize: 15, color: T.navy, boxSizing: "border-box",
    boxShadow: "0 2px 10px rgba(15,23,42,0.04)",
  };

  const fieldLabel = (text: string) => (
    <p style={{ ...label, fontSize: 11, color: T.slate, marginBottom: 8 }}>{text}</p>
  );

  return (
    <div style={{ width: "100%", minHeight: "100dvh", display: "flex", flexDirection: "column", background: T.bg }}>
      {/* Header */}
      <div style={{
        background: "white", borderBottom: `1px solid ${T.border}`,
        padding: "0 20px 16px",
      }}>
        <StatusBar />
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 4 }}>
          <button onClick={onBack} style={{
            width: 38, height: 38, borderRadius: "50%", border: `1px solid ${T.border}`,
            background: T.bg, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <ChevronLeft size={20} color={T.navy} />
          </button>
          <div>
            <h1 style={{ ...display, fontSize: 22, color: T.navy, letterSpacing: -0.5 }}>Create Trip</h1>
            <p style={{ ...body, fontSize: 12, color: T.slateL }}>Plan your reality-checked journey</p>
          </div>
        </div>
      </div>

      {/* Scrollable form */}
      <div style={{ flex: 1, overflowY: "auto", scrollbarWidth: "none", padding: "20px 20px" }}>

        {/* Trip type chips */}
        <div style={{ marginBottom: 20 }}>
          {fieldLabel("Trip Type")}
          <div style={{ display: "flex", gap: 9 }}>
            {TRIP_TYPES.map(t => (
              <button key={t.id} onClick={() => setTripType(t.id)} style={{
                flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 5,
                padding: "11px 6px", borderRadius: 14, cursor: "pointer",
                border: `1.5px solid ${tripType === t.id ? T.teal : T.border}`,
                background: tripType === t.id ? "rgba(20,184,166,0.07)" : "white",
                transition: "all .15s",
              }}>
                <span style={{ fontSize: 22 }}>{t.icon}</span>
                <span style={{ ...bodyMed, fontSize: 11, color: tripType === t.id ? T.teal : T.slate }}>{t.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Trip Name */}
        <div style={{ marginBottom: 16 }}>
          {fieldLabel("Trip Name")}
          <input type="text" value={tripName} onChange={e => setTripName(e.target.value)}
            placeholder="e.g. Family Goa Trip 2025" style={inputStyle} />
        </div>

        {/* Destination */}
        <div style={{ marginBottom: 16 }}>
          {fieldLabel("Destination")}
          <div style={{ position: "relative" }}>
            <MapPin size={16} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: T.teal, zIndex: 1 }} />
            <input type="text" value={destination} onChange={e => setDestination(e.target.value)}
              placeholder="e.g. Goa, India" style={{ ...inputStyle, paddingLeft: 40 }} />
          </div>
        </div>

        {/* Date range */}
        <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
          <div style={{ flex: 1 }}>
            {fieldLabel("Start Date")}
            <div style={{ position: "relative" }}>
              <Calendar size={14} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: T.teal, zIndex: 1 }} />
              <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)}
                style={{ ...inputStyle, paddingLeft: 36, fontSize: 13 }} />
            </div>
          </div>
          <div style={{ flex: 1 }}>
            {fieldLabel("End Date")}
            <div style={{ position: "relative" }}>
              <Calendar size={14} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: T.teal, zIndex: 1 }} />
              <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)}
                style={{ ...inputStyle, paddingLeft: 36, fontSize: 13 }} />
            </div>
          </div>
        </div>

        {/* Guests */}
        <div style={{ marginBottom: 16 }}>
          {fieldLabel("Travelers")}
          <div style={{
            background: "white", borderRadius: 18, padding: "4px 16px",
            boxShadow: "0 2px 20px rgba(15,23,42,0.07)", border: `1px solid ${T.border}`,
          }}>
            <GuestCounter label="Adults" sub="Age 18 and above" value={adults} onChange={setAdults} />
            <GuestCounter label="Children" sub="Age 2 to 17 years" value={children} onChange={setChildren} />
            <GuestCounter label="Seniors" sub="Age 60 and above" value={seniors} onChange={setSeniors} last />
          </div>
        </div>

        {/* Traveler summary chip */}
        {totalTravelers > 0 && (
          <div style={{
            display: "flex", alignItems: "center", gap: 8, marginBottom: 16,
            padding: "11px 14px", borderRadius: 14,
            background: "rgba(20,184,166,0.07)", border: "1px solid rgba(20,184,166,0.2)",
          }}>
            <CheckCircle size={15} style={{ color: T.teal, flexShrink: 0 }} />
            <p style={{ ...bodyMed, fontSize: 13, color: T.teal }}>
              {totalTravelers} traveler{totalTravelers > 1 ? "s" : ""}
              {adults > 0 && ` · ${adults} Adult${adults > 1 ? "s" : ""}`}
              {children > 0 && ` · ${children} Child${children > 1 ? "ren" : ""}`}
              {seniors > 0 && ` · ${seniors} Senior${seniors > 1 ? "s" : ""}`}
            </p>
          </div>
        )}

        {/* Reality preview note */}
        <div style={{
          display: "flex", gap: 12, alignItems: "flex-start", marginBottom: 24,
          padding: "14px 16px", borderRadius: 16,
          background: "#F0FDFA", border: "1px solid rgba(20,184,166,0.18)",
        }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10, background: T.teal, flexShrink: 0,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <Eye size={17} color="white" />
          </div>
          <p style={{ ...body, fontSize: 12, color: "#0D9488", lineHeight: 1.65 }}>
            <strong style={subhead}>TripLens will instantly analyse</strong> sleeping arrangements,
            real transport costs, and hidden expenses for your group once you create this trip.
          </p>
        </div>

        {/* CTA */}
        <button onClick={onDone} style={{
          width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 9,
          borderRadius: 18, padding: "16px 0", border: "none", cursor: "pointer",
          background: T.teal, color: "white",
          boxShadow: `0 14px 48px rgba(20,184,166,0.45)`,
          ...display, fontSize: 16, letterSpacing: -0.2,
        }}>
          Create Trip <ArrowRight size={19} />
        </button>

        <div style={{ height: 8 }} />
      </div>
    </div>
  );
}

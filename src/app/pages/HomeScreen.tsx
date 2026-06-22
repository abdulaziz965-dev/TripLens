import { useState, useEffect } from "react";
import { Search, MapPin, Star, Clock, ArrowRight, CheckCircle, AlertTriangle, Info, TrendingUp, Plus } from "lucide-react";
import { type User as FirebaseUser } from "firebase/auth";
import { T, display, body, heading, label, bodyMed, IMG } from "../theme";
import { Chip, BottomTabBar } from "../components/SharedComponents";
import { useInsights, useTrips } from "../hooks/useRealtime";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase/config";

// ─────────────────────────────────────────────────────────────────────────────
// Global Trends / Seasonal Logic
// ─────────────────────────────────────────────────────────────────────────────

const ALL_DESTINATIONS = [
  { id: "ooty", name: "Ooty", sub: "Tamil Nadu", tag: "Hill Station", temp: "18°C", from: "₹3,200", img: IMG.ooty, rating: 4.8, hrs: "6h drive", months: [3, 4, 5, 6] },
  { id: "munnar", name: "Munnar", sub: "Kerala", tag: "Tea Gardens", temp: "16°C", from: "₹4,100", img: IMG.munnar, rating: 4.9, hrs: "4h drive", months: [8, 9, 10, 11] },
  { id: "goa", name: "Goa", sub: "West Coast", tag: "Beach Town", temp: "29°C", from: "₹6,800", img: IMG.goa, rating: 4.7, hrs: "Fly 1.5h", months: [10, 11, 0, 1] },
  { id: "coorg", name: "Coorg", sub: "Karnataka", tag: "Coffee Hills", temp: "20°C", from: "₹2,900", img: IMG.coorg, rating: 4.6, hrs: "5h drive", months: [9, 10, 11, 0] },
  { id: "rajasthan", name: "Rajasthan", sub: "Heritage", tag: "Royal Culture", temp: "32°C", from: "₹9,500", img: IMG.rajasthan, rating: 4.8, hrs: "Fly 2h", months: [10, 11, 0, 1] },
  { id: "ladakh", name: "Ladakh", sub: "High Altitude", tag: "Adventure", temp: "12°C", from: "₹12,500", img: "https://images.unsplash.com/photo-1581791534721-e599df4417f7?w=500&h=400&fit=crop", rating: 4.9, hrs: "Fly 3h", months: [5, 6, 7, 8] },
  { id: "manali", name: "Manali", sub: "Himachal Pradesh", tag: "Snow Peaks", temp: "8°C", from: "₹5,400", img: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=500&h=400&fit=crop", rating: 4.7, hrs: "12h drive", months: [11, 0, 1, 2, 4, 5] },
  { id: "pondicherry", name: "Pondicherry", sub: "French Colony", tag: "Coastal", temp: "28°C", from: "₹3,800", img: "https://images.unsplash.com/photo-1589793413303-68d2ca07849e?w=500&h=400&fit=crop", rating: 4.6, hrs: "3h drive", months: [9, 10, 11, 0, 1] },
];

function getSeasonalDestinations() {
  const currentMonth = new Date().getMonth(); // 0-11
  // Filter destinations that are best for this month, always ensure we show at least 6
  const filtered = ALL_DESTINATIONS.filter(d => d.months.includes(currentMonth));
  if (filtered.length >= 6) return filtered;
  
  // If fewer than 6, add more from the main list that aren't already included
  const others = ALL_DESTINATIONS.filter(d => !filtered.find(f => f.id === d.id));
  return [...filtered, ...others].slice(0, 8);
}

function getSeasonalRangeText() {
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const now = new Date();
  const next2 = new Date();
  next2.setMonth(now.getMonth() + 2);
  return `${monthNames[now.getMonth()]}–${monthNames[next2.getMonth()]}`;
}

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────

export function HomeScreen({
  onCreateTrip,
  onOpenTrip,
  user,
}: { onCreateTrip: (location?: string) => void; onOpenTrip: (tripId: string) => void; user?: FirebaseUser | null }) {
  const { data: insights } = useInsights();
  const { data: trips } = useTrips(user?.uid);

  const [insightIdx, setInsightIdx] = useState(0);
const [displayName, setDisplayName] = useState("Traveler");

  const destinations = getSeasonalDestinations();
  const seasonalText = getSeasonalRangeText();
  useEffect(() => {
  const loadProfile = async () => {
    if (!user) return;

    try {
      const snap = await getDoc(
        doc(db, "users", user.uid)
      );

      if (snap.exists()) {
        const data = snap.data();

        setDisplayName(
          data.displayName ||
          user.displayName ||
          user.email?.split("@")[0] ||
          "Traveler"
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  loadProfile();
}, [user]);

  useEffect(() => {
    if (insights.length === 0) return;
    const t = setInterval(() => setInsightIdx(i => (i + 1) % insights.length), 4000);
    return () => clearInterval(t);
  }, [insights.length]);

  const insight = insights[insightIdx];
  const activeTrip = trips.find(t => t.status === "Planning" || t.status === "Confirmed");

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
          
          <div style={{ padding: "6px 20px 0", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <p style={{ ...body, fontSize: 13, color: "rgba(255,255,255,0.5)", marginBottom: 4 }}>Good Morning ☀️</p>
              <h1 style={{ ...display, fontSize: 27, color: "white", letterSpacing: -0.6, lineHeight: 1.1 }}>
                {displayName}
              </h1>
              <p style={{ ...body, fontSize: 12, color: "rgba(255,255,255,0.35)", marginTop: 4 }}>
                Your next adventure awaits
              </p>
            </div>
            {/* Avatar */}
            {user?.photoURL ? (
              <img src={user.photoURL} alt={displayName} style={{
                width: 48, height: 48, borderRadius: "50%",
                border: `2.5px solid ${T.teal}`,
                boxShadow: `0 0 0 3px rgba(20,184,166,0.2)`,
                objectFit: "cover"
              }} />
            ) : (
              <div style={{
                width: 48, height: 48, borderRadius: "50%",
                background: `linear-gradient(135deg, ${T.teal}, #0891B2)`,
                border: `2.5px solid ${T.teal}`,
                boxShadow: `0 0 0 3px rgba(20,184,166,0.2)`,
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24,
              }}>👤</div>
            )}
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
              <input type="text" placeholder="Where do you want to go?" style={{
                background: "transparent", border: "none", outline: "none",
                ...body, fontSize: 14, color: "white", flex: 1,
              }} onFocus={() => onCreateTrip()} />
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
        {insight && (
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
                  <p style={{ ...heading, fontSize: 12, color: insight.type === "warn" ? "#92400E" : "#1E40AF" }}>
                    Reality Check
                  </p>
                  <Chip color={insight.type === "warn" ? T.amber : "#3B82F6"}>
                    #{insightIdx + 1} of {insights.length}
                  </Chip>
                </div>
                <p style={{ ...body, fontSize: 13, color: insight.type === "warn" ? "#78350F" : "#1E3A8A", lineHeight: 1.6 }}>
                  {insight.text}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ── Seasonal Picks ────────────────────────────────────── */}
        <div style={{ paddingTop: 22 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 20px", marginBottom: 14 }}>
            <div>
              <p style={{ ...heading, fontSize: 19, color: T.navy }}>Seasonal Picks</p>
              <p style={{ ...body, fontSize: 12, color: T.slateL, marginTop: 2 }}>Best for {seasonalText}</p>
            </div>
            <span style={{ ...bodyMed, fontSize: 13, color: T.teal }}>See all</span>
          </div>

          <div style={{ display: "flex", gap: 14, overflowX: "auto", scrollbarWidth: "none", padding: "0 20px" }}>
            {destinations.map(d => (
              <div key={d.id} onClick={() => onCreateTrip(d.name)} style={{
                flexShrink: 0, width: 186, borderRadius: 20, overflow: "hidden",
                background: T.navy, cursor: "pointer",
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
                    <p style={{ ...heading, fontSize: 14, color: "white" }}>{d.from}</p>
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
        {activeTrip && (
          <div style={{ padding: "22px 20px 0" }}>
            <p style={{ ...heading, fontSize: 19, color: T.navy, marginBottom: 14 }}>Continue Planning</p>
            <div
              onClick={() => onOpenTrip(activeTrip.id)}
              style={{
              borderRadius: 20, overflow: "hidden", background: "white",
              boxShadow: "0 4px 28px rgba(15,23,42,0.1)",
              border: `1px solid ${T.border}`,
              cursor: "pointer",
            }}>
              {/* Trip hero image */}
              <div style={{ position: "relative", height: 116 }}>
                <img src={IMG.goa} alt={activeTrip.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                <div style={{ position: "absolute", inset: 0, background: "rgba(15,23,42,0.62)" }} />
                <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 16px" }}>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 5 }}>
                      <span style={{
                        ...label, fontSize: 9, color: T.teal,
                        background: "rgba(20,184,166,0.2)", border: "1px solid rgba(20,184,166,0.35)",
                        borderRadius: 99, padding: "2px 8px",
                      }}>{activeTrip.status}</span>
                    </div>
                    <p style={{ ...display, fontSize: 18, color: "white", letterSpacing: -0.3 }}>{activeTrip.name}</p>
                    <p style={{ ...body, fontSize: 12, color: "rgba(255,255,255,0.6)", marginTop: 2 }}>
                      {activeTrip.startDate} · {activeTrip.adults + activeTrip.children + activeTrip.seniors} Travelers
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
                  <span style={{ ...bodyMed, fontSize: 12, color: T.teal }}>{activeTrip.progress}%</span>
                </div>
                <div style={{ height: 5, background: T.bg, borderRadius: 99, overflow: "hidden" }}>
                  <div style={{ width: `${activeTrip.progress}%`, height: "100%", background: `linear-gradient(90deg, ${T.teal}, #22D3EE)`, borderRadius: 99 }} />
                </div>
                <div style={{ display: "flex", gap: 16, marginTop: 10 }}>
                  {[
                    { icon: <CheckCircle size={13}/>, text: "Hotels reviewed", ok: activeTrip.progress > 50 },
                    { icon: <AlertTriangle size={13}/>, text: "Costs pending", ok: activeTrip.progress > 80 },
                    { icon: <Info size={13}/>, text: "Transport open", ok: activeTrip.progress > 90 },
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
        )}

        {/* ── Quick Budget Insight ─────────────────────────────── */}
        {activeTrip && (
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
                <p style={{ ...heading, fontSize: 14, color: "white" }}>{activeTrip.name} Estimate</p>
                <p style={{ ...body, fontSize: 12, color: "rgba(255,255,255,0.45)", marginTop: 2 }}>
                  {activeTrip.adults + activeTrip.children + activeTrip.seniors} people
                </p>
              </div>
              <div style={{ textAlign: "right" }}>
                <p style={{ ...display, fontSize: 18, color: T.teal }}>{activeTrip.cost}</p>
                <p style={{ ...body, fontSize: 11, color: "rgba(255,255,255,0.35)" }}>full budget</p>
              </div>
            </div>
          </div>
        )}

        {/* ── Plan new trip CTA ─────────────────────────────────── */}
        <div style={{ padding: "16px 20px 0" }}>
          <button onClick={() => onCreateTrip()} style={{
            width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            borderRadius: 18, padding: "15px 0", border: `1.5px solid ${T.teal}`,
            background: "rgba(20,184,166,0.07)", cursor: "pointer",
            ...heading, fontSize: 15, color: T.teal,
          }}>
            <Plus size={18} /> Plan a New Trip
          </button>
        </div>
      </div>

      <BottomTabBar />
    </div>
  );
}

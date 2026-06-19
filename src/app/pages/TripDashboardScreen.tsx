import React, { useMemo, useState } from "react";
import {
  ChevronLeft, MapPin, Calendar, Users, Hotel, Car, Wallet, FileWarning,
  Star, CheckCircle, AlertTriangle, Plus, X,
} from "lucide-react";
import { auth } from "../../firebase/config";
import { T, display, body, heading, label, bodyMed, subhead } from "../theme";
import { StatusBar, Chip, SectionCard, AmountPill } from "../components/SharedComponents";
import { useTrip, useTripExpenses } from "../hooks/useRealtime";
import { addExpense } from "../../services/dataService";
import {
  getHotelsForTrip,
  getTransportForTrip,
  getRealityReportForTrip,
  getTripDurationLabel,
  type HotelRecommendation,
} from "../../data/tripIntelligence";

type DashboardTab = "hotels" | "transport" | "expenses" | "reality";

const TABS: { id: DashboardTab; label: string; icon: React.ReactNode }[] = [
  { id: "hotels", label: "Hotels", icon: <Hotel size={16} /> },
  { id: "transport", label: "Transport", icon: <Car size={16} /> },
  { id: "expenses", label: "Expenses", icon: <Wallet size={16} /> },
  { id: "reality", label: "Reality", icon: <FileWarning size={16} /> },
];

const MANUAL_TYPES = [
  { id: "food", label: "Food" },
  { id: "shopping", label: "Shopping" },
  { id: "activities", label: "Activities" },
  { id: "miscellaneous", label: "Miscellaneous" },
] as const;

function ConvenienceStars({ rating }: { rating: number }) {
  return (
    <div style={{ display: "flex", gap: 2 }}>
      {[1, 2, 3, 4, 5].map(i => (
        <Star
          key={i}
          size={12}
          fill={i <= rating ? T.teal : "transparent"}
          color={i <= rating ? T.teal : T.slateL}
        />
      ))}
    </div>
  );
}

function HotelCard({
  hotel,
  nights,
  onBook,
  booking,
}: {
  hotel: HotelRecommendation;
  nights: number;
  onBook: () => void;
  booking: boolean;
}) {
  const total = hotel.pricePerNight * hotel.roomsRequired * nights;

  return (
    <SectionCard style={{ overflow: "hidden" }}>
      <div style={{ position: "relative", height: 140 }}>
        <img src={hotel.photos[0]} alt={hotel.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(15,23,42,0.75), transparent)" }} />
        <div style={{ position: "absolute", top: 10, left: 10 }}>
          <Chip color="white" bg="rgba(15,23,42,0.55)" border="rgba(255,255,255,0.2)">
            Score {hotel.familyScore}
          </Chip>
        </div>
        <div style={{ position: "absolute", bottom: 10, left: 12, right: 12 }}>
          <p style={{ ...heading, fontSize: 16, color: "white", marginBottom: 4 }}>{hotel.name}</p>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <span style={{ ...body, fontSize: 11, color: "rgba(255,255,255,0.75)" }}>
              <Star size={10} fill="#FCD34D" color="#FCD34D" style={{ display: "inline", marginRight: 4 }} />
              {hotel.rating}
            </span>
            <span style={{ ...body, fontSize: 11, color: "rgba(255,255,255,0.65)" }}>{hotel.distance}</span>
          </div>
        </div>
      </div>

      <div style={{ padding: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
          <div>
            <p style={{ ...label, fontSize: 10, color: T.slateL, marginBottom: 4 }}>Per night</p>
            <p style={{ ...heading, fontSize: 18, color: T.navy }}>₹{hotel.pricePerNight.toLocaleString("en-IN")}</p>
          </div>
          <div style={{ textAlign: "right" }}>
            <p style={{ ...label, fontSize: 10, color: T.slateL, marginBottom: 4 }}>{nights} nights est.</p>
            <p style={{ ...bodyMed, fontSize: 14, color: T.teal }}>₹{total.toLocaleString("en-IN")}</p>
          </div>
        </div>

        <div style={{
          padding: "12px 14px", borderRadius: 14, marginBottom: 12,
          background: hotel.suitable ? "rgba(16,185,129,0.06)" : "rgba(245,158,11,0.08)",
          border: `1px solid ${hotel.suitable ? "rgba(16,185,129,0.2)" : "rgba(245,158,11,0.25)"}`,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            {hotel.suitable ? <CheckCircle size={16} color={T.green} /> : <AlertTriangle size={16} color={T.amber} />}
            <span style={{ ...bodyMed, fontSize: 13, color: hotel.suitable ? "#065F46" : "#92400E" }}>
              {hotel.suitable ? "Suitable for your group" : "Review sleeping arrangements"}
            </span>
          </div>
          {hotel.mattressWarning && (
            <p style={{ ...body, fontSize: 12, color: T.amber, marginBottom: 4 }}>⚠ {hotel.mattressWarning}</p>
          )}
          {hotel.extraCostRange && (
            <p style={{ ...body, fontSize: 12, color: T.slate }}>Estimated extra: {hotel.extraCostRange}</p>
          )}
        </div>

        <div style={{ marginBottom: 14 }}>
          <p style={{ ...label, fontSize: 10, color: T.slateL, marginBottom: 8 }}>Family analysis</p>
          {hotel.analysis.map(line => (
            <p key={line} style={{ ...body, fontSize: 12, color: T.slate, lineHeight: 1.6, marginBottom: 4 }}>• {line}</p>
          ))}
        </div>

        <button
          onClick={onBook}
          disabled={booking}
          style={{
            width: "100%", padding: "14px 0", borderRadius: 14, border: "none", cursor: "pointer",
            background: T.navy, color: "white", ...heading, fontSize: 14,
            opacity: booking ? 0.7 : 1,
          }}
        >
          {booking ? "Adding…" : "Booked This"}
        </button>
      </div>
    </SectionCard>
  );
}

export function TripDashboardScreen({ tripId, onBack }: { tripId: string; onBack: () => void }) {
  const { data: trip, loading } = useTrip(tripId);
  const { data: expenses } = useTripExpenses(tripId, auth.currentUser?.uid);
  const [tab, setTab] = useState<DashboardTab>("hotels");
  const [bookingId, setBookingId] = useState<string | null>(null);
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [expenseTitle, setExpenseTitle] = useState("");
  const [expenseAmount, setExpenseAmount] = useState("");
  const [expenseType, setExpenseType] = useState<(typeof MANUAL_TYPES)[number]["id"]>("food");
  const [savingExpense, setSavingExpense] = useState(false);

  const hotels = useMemo(() => (trip ? getHotelsForTrip(trip) : []), [trip]);
  const transport = useMemo(() => (trip ? getTransportForTrip(trip) : []), [trip]);
  const report = useMemo(() => (trip ? getRealityReportForTrip(trip) : null), [trip]);

  const nights = useMemo(() => {
    if (!trip?.startDate || !trip?.endDate) return 3;
    const n = Math.round((new Date(trip.endDate).getTime() - new Date(trip.startDate).getTime()) / 86400000);
    return Math.max(1, n);
  }, [trip]);

  const totalTravelers = trip ? trip.adults + trip.children + trip.seniors : 0;
  const confirmed = expenses.filter(e => e.category === "Confirmed");
  const manual = expenses.filter(e => e.category === "Manual");
  const totalSpend = expenses.reduce((acc, e) => acc + (parseInt(e.amount.replace(/[₹,]/g, ""), 10) || 0), 0);

  const handleBookHotel = async (hotel: HotelRecommendation) => {
    if (!trip || !auth.currentUser) return;
    setBookingId(hotel.id);
    try {
      const amount = hotel.pricePerNight * hotel.roomsRequired * nights;
      await addExpense({
        tripId: trip.id,
        userId: auth.currentUser.uid,
        label: `${hotel.name} (${hotel.roomsRequired} room${hotel.roomsRequired > 1 ? "s" : ""})`,
        amount: `₹${amount.toLocaleString("en-IN")}`,
        category: "Confirmed",
        expenseType: "hotel",
      });
      setTab("expenses");
    } catch (err) {
      console.error("[TripLens] Failed to add hotel expense:", err);
      alert("Could not save expense. Check Firestore rules and try again.");
    } finally {
      setBookingId(null);
    }
  };

  const handleAddManualExpense = async () => {
    if (!trip || !auth.currentUser || !expenseTitle || !expenseAmount) return;
    setSavingExpense(true);
    try {
      const amount = expenseAmount.startsWith("₹") ? expenseAmount : `₹${parseInt(expenseAmount, 10).toLocaleString("en-IN")}`;
      await addExpense({
        tripId: trip.id,
        userId: auth.currentUser.uid,
        label: expenseTitle,
        amount,
        category: "Manual",
        expenseType,
      });
      setExpenseTitle("");
      setExpenseAmount("");
      setShowAddExpense(false);
    } catch (err) {
      console.error("[TripLens] Failed to add manual expense:", err);
      alert("Could not save expense. Check Firestore rules and try again.");
    } finally {
      setSavingExpense(false);
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: "100dvh", display: "flex", alignItems: "center", justifyContent: "center", background: T.bg }}>
        <p style={{ ...body, color: T.slate }}>Loading trip…</p>
      </div>
    );
  }

  if (!trip) {
    return (
      <div style={{ minHeight: "100dvh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: T.bg, padding: 24 }}>
        <p style={{ ...heading, fontSize: 18, color: T.navy, marginBottom: 12 }}>Trip not found</p>
        <button onClick={onBack} style={{ padding: "12px 24px", borderRadius: 12, border: "none", background: T.teal, color: "white", cursor: "pointer", ...bodyMed }}>
          Go back
        </button>
      </div>
    );
  }

  return (
    <div style={{ width: "100%", minHeight: "100dvh", display: "flex", flexDirection: "column", background: T.bg }}>
      <div style={{
        background: `linear-gradient(160deg, ${T.navy} 0%, #1e3a5f 100%)`,
        paddingBottom: 16, borderRadius: "0 0 28px 28px",
        boxShadow: "0 8px 32px rgba(15,23,42,0.18)",
      }}>
        <StatusBar light />
        <div style={{ padding: "4px 20px 0", display: "flex", alignItems: "center", gap: 12 }}>
          <button onClick={onBack} style={{
            width: 38, height: 38, borderRadius: "50%", border: "1px solid rgba(255,255,255,0.15)",
            background: "rgba(255,255,255,0.1)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <ChevronLeft size={20} color="white" />
          </button>
          <div style={{ flex: 1 }}>
            <h1 style={{ ...display, fontSize: 22, color: "white", letterSpacing: -0.5 }}>{trip.name}</h1>
            <p style={{ ...body, fontSize: 12, color: "rgba(255,255,255,0.45)" }}>Trip Dashboard</p>
          </div>
          <Chip color={T.teal} bg="rgba(20,184,166,0.15)" border="rgba(20,184,166,0.3)">{trip.status}</Chip>
        </div>

        <div style={{
          margin: "16px 20px 0", background: "white", borderRadius: 20, padding: "16px 18px",
          display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12,
          boxShadow: "0 12px 40px rgba(0,0,0,0.15)",
        }}>
          {[
            { icon: <MapPin size={14} color={T.teal} />, label: trip.destination },
            { icon: <Calendar size={14} color={T.teal} />, label: getTripDurationLabel(trip) },
            { icon: <Users size={14} color={T.teal} />, label: `${totalTravelers} travelers` },
            { icon: <Wallet size={14} color={T.teal} />, label: trip.cost || `₹${totalSpend.toLocaleString("en-IN")}` },
          ].map(item => (
            <div key={item.label} style={{ display: "flex", alignItems: "center", gap: 8 }}>
              {item.icon}
              <span style={{ ...body, fontSize: 13, color: T.navy }}>{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{
        display: "flex", gap: 6, padding: "14px 16px 0", overflowX: "auto", scrollbarWidth: "none",
      }}>
        {TABS.map(t => {
          const active = tab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              style={{
                flexShrink: 0, display: "flex", alignItems: "center", gap: 6,
                padding: "10px 14px", borderRadius: 99, border: "none", cursor: "pointer",
                background: active ? T.navy : "white",
                color: active ? "white" : T.slate,
                boxShadow: active ? "0 4px 16px rgba(15,23,42,0.2)" : "0 2px 8px rgba(15,23,42,0.06)",
                ...bodyMed, fontSize: 12,
              }}
            >
              {t.icon} {t.label}
            </button>
          );
        })}
      </div>

      <div style={{ flex: 1, overflowY: "auto", scrollbarWidth: "none", padding: "16px 20px 32px" }}>
        {tab === "hotels" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <p style={{ ...body, fontSize: 13, color: T.slate, lineHeight: 1.6 }}>
              Hotels analysed for {totalTravelers} travelers — room fit, mattress needs, and hidden charges included.
            </p>
            {hotels.map(h => (
              <HotelCard
                key={h.id}
                hotel={h}
                nights={nights}
                onBook={() => handleBookHotel(h)}
                booking={bookingId === h.id}
              />
            ))}
          </div>
        )}

        {tab === "transport" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <p style={{ ...body, fontSize: 13, color: T.slate, lineHeight: 1.6, marginBottom: 4 }}>
              Door-to-door transport realities for {trip.destination}.
            </p>
            {transport.map(route => (
              <SectionCard key={route.id} style={{ padding: 16 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                  <div>
                    <p style={{ ...label, fontSize: 9, color: T.teal, marginBottom: 4 }}>{route.from} → {route.to}</p>
                    <p style={{ ...heading, fontSize: 15, color: T.navy }}>{route.duration}</p>
                  </div>
                  <AmountPill value={route.taxiCost} />
                </div>
                <p style={{ ...body, fontSize: 12, color: T.slate, marginBottom: 8, lineHeight: 1.55 }}>{route.publicTransport}</p>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <p style={{ ...label, fontSize: 9, color: T.slateL, marginBottom: 4 }}>Convenience</p>
                    <ConvenienceStars rating={route.convenience} />
                  </div>
                </div>
                <p style={{ ...body, fontSize: 11, color: T.slateL, marginTop: 10, lineHeight: 1.5, fontStyle: "italic" }}>{route.note}</p>
              </SectionCard>
            ))}
          </div>
        )}

        {tab === "expenses" && (
          <div>
            <SectionCard style={{ padding: 16, marginBottom: 16, background: "linear-gradient(135deg, rgba(20,184,166,0.08), rgba(20,184,166,0.02))" }}>
              <p style={{ ...label, fontSize: 10, color: T.teal, marginBottom: 6 }}>Total Spend</p>
              <p style={{ ...display, fontSize: 28, color: T.navy }}>₹{totalSpend.toLocaleString("en-IN")}</p>
              <p style={{ ...body, fontSize: 12, color: T.slate, marginTop: 4 }}>
                {confirmed.length} confirmed · {manual.length} manual
              </p>
            </SectionCard>

            <button
              onClick={() => setShowAddExpense(v => !v)}
              style={{
                width: "100%", marginBottom: 16, padding: "13px 0", borderRadius: 14,
                border: `1.5px solid ${T.teal}`, background: "rgba(20,184,166,0.07)",
                color: T.teal, cursor: "pointer", ...bodyMed, fontSize: 14,
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              }}
            >
              {showAddExpense ? <X size={16} /> : <Plus size={16} />}
              {showAddExpense ? "Cancel" : "Add Manual Expense"}
            </button>

            {showAddExpense && (
              <SectionCard style={{ padding: 16, marginBottom: 16 }}>
                <input
                  type="text"
                  placeholder="Title (e.g. Lunch at beach shack)"
                  value={expenseTitle}
                  onChange={e => setExpenseTitle(e.target.value)}
                  style={{ width: "100%", padding: "12px 14px", borderRadius: 12, border: `1px solid ${T.border}`, marginBottom: 10, ...body, fontSize: 14 }}
                />
                <input
                  type="number"
                  placeholder="Amount (e.g. 850)"
                  value={expenseAmount}
                  onChange={e => setExpenseAmount(e.target.value)}
                  style={{ width: "100%", padding: "12px 14px", borderRadius: 12, border: `1px solid ${T.border}`, marginBottom: 12, ...body, fontSize: 14 }}
                />
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 14 }}>
                  {MANUAL_TYPES.map(t => (
                    <button
                      key={t.id}
                      onClick={() => setExpenseType(t.id)}
                      style={{
                        padding: "6px 12px", borderRadius: 99, cursor: "pointer",
                        border: `1px solid ${expenseType === t.id ? T.teal : T.border}`,
                        background: expenseType === t.id ? "rgba(20,184,166,0.1)" : "white",
                        color: expenseType === t.id ? T.teal : T.slate,
                        ...body, fontSize: 12,
                      }}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
                <button
                  onClick={handleAddManualExpense}
                  disabled={savingExpense || !expenseTitle || !expenseAmount}
                  style={{
                    width: "100%", padding: "13px 0", borderRadius: 12, border: "none",
                    background: T.teal, color: "white", cursor: "pointer", ...bodyMed,
                    opacity: savingExpense || !expenseTitle || !expenseAmount ? 0.6 : 1,
                  }}
                >
                  {savingExpense ? "Saving…" : "Save Expense"}
                </button>
              </SectionCard>
            )}

            {confirmed.length > 0 && (
              <div style={{ marginBottom: 20 }}>
                <p style={{ ...heading, fontSize: 16, color: T.navy, marginBottom: 10 }}>Confirmed</p>
                {confirmed.map(e => (
                  <SectionCard key={e.id} style={{ padding: 14, marginBottom: 8 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                      <p style={{ ...bodyMed, fontSize: 14, color: T.navy }}>{e.label}</p>
                      <AmountPill value={e.amount} />
                    </div>
                  </SectionCard>
                ))}
              </div>
            )}

            {manual.length > 0 && (
              <div>
                <p style={{ ...heading, fontSize: 16, color: T.navy, marginBottom: 10 }}>Manual</p>
                {manual.map(e => (
                  <SectionCard key={e.id} style={{ padding: 14, marginBottom: 8 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                      <div>
                        <p style={{ ...bodyMed, fontSize: 14, color: T.navy }}>{e.label}</p>
                        {e.expenseType && (
                          <p style={{ ...body, fontSize: 11, color: T.slateL, marginTop: 2 }}>{e.expenseType}</p>
                        )}
                      </div>
                      <AmountPill value={e.amount} subtle />
                    </div>
                  </SectionCard>
                ))}
              </div>
            )}

            {expenses.length === 0 && (
              <p style={{ ...body, fontSize: 13, color: T.slate, textAlign: "center", padding: "24px 0" }}>
                No expenses yet. Book a hotel or add a manual estimate.
              </p>
            )}
          </div>
        )}

        {tab === "reality" && report && (
          <div>
            <SectionCard style={{
              padding: 16, marginBottom: 16,
              background: "linear-gradient(135deg, #FFFBEB, #FEF3C7)",
              border: "1px solid rgba(245,158,11,0.25)",
            }}>
              <p style={{ ...label, fontSize: 10, color: "#92400E", marginBottom: 6 }}>Estimated Extra Spending</p>
              <p style={{ ...heading, fontSize: 17, color: "#78350F", lineHeight: 1.4 }}>{report.estimatedExtraSpend}</p>
            </SectionCard>

            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {report.items.map(item => {
                const colors =
                  item.kind === "warning"
                    ? { bg: "rgba(245,158,11,0.08)", border: "rgba(245,158,11,0.2)", title: "#92400E", text: "#78350F" }
                    : item.kind === "cost"
                      ? { bg: "rgba(239,68,68,0.06)", border: "rgba(239,68,68,0.15)", title: "#991B1B", text: "#7F1D1D" }
                      : { bg: "rgba(20,184,166,0.06)", border: "rgba(20,184,166,0.15)", title: "#0F766E", text: "#0D9488" };

                return (
                  <SectionCard key={item.id} style={{ padding: 14, background: colors.bg, border: `1px solid ${colors.border}` }}>
                    <div style={{ display: "flex", gap: 12 }}>
                      <span style={{ fontSize: 20 }}>{item.icon}</span>
                      <div>
                        <p style={{ ...bodyMed, fontSize: 14, color: colors.title, marginBottom: 4 }}>{item.title}</p>
                        <p style={{ ...body, fontSize: 12, color: colors.text, lineHeight: 1.6 }}>{item.detail}</p>
                      </div>
                    </div>
                  </SectionCard>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

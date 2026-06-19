import React from "react";
import { Briefcase, Plus } from "lucide-react";
import { auth } from "../../firebase/config";
import { T, display, body, heading, bodyMed } from "../theme";
import { StatusBar, SectionCard, BottomTabBar, Chip, AmountPill } from "../components/SharedComponents";
import { useTrips } from "../hooks/useRealtime";

export function TripsScreen({ onCreateTrip, onSelectTrip }: { onCreateTrip: () => void; onSelectTrip: (trip: any) => void }) {
  const { data: trips } = useTrips(auth.currentUser?.uid);

  return (
    <div style={{ position: "relative", width: "100%", minHeight: "100dvh", display: "flex", flexDirection: "column", background: T.bg }}>
      <div style={{ flex: 1, overflowY: "auto", scrollbarWidth: "none", paddingBottom: 82 }}>
        <div style={{ background: `linear-gradient(160deg, ${T.navy} 0%, #16304f 100%)`, paddingBottom: 22, borderRadius: "0 0 28px 28px", boxShadow: "0 8px 32px rgba(15,23,42,0.18)" }}>
          <StatusBar light />
          <div style={{ padding: "6px 20px 0" }}>
            <p style={{ ...body, fontSize: 13, color: "rgba(255,255,255,0.5)", marginBottom: 4 }}>Your Trips</p>
            <h1 style={{ ...display, fontSize: 28, color: "white", letterSpacing: -0.7, lineHeight: 1.1 }}>Trip planning</h1>
            <p style={{ ...body, fontSize: 12, color: "rgba(255,255,255,0.35)", marginTop: 4 }}>Track future adventures and start new ones.</p>
          </div>
        </div>

        {trips.length === 0 ? (
          <div style={{ padding: "18px 20px 0" }}>
            <SectionCard style={{ padding: 20 }}>
              <div style={{ width: 52, height: 52, borderRadius: 16, background: "rgba(20,184,166,0.08)", border: "1px solid rgba(20,184,166,0.14)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14 }}>
                <Briefcase size={22} style={{ color: T.teal }} />
              </div>
              <p style={{ ...heading, fontSize: 20, color: T.navy, marginBottom: 6 }}>No Trips Yet</p>
              <p style={{ ...body, fontSize: 13, color: T.slate, lineHeight: 1.65, marginBottom: 16 }}>
                Start by creating your first reality-checked itinerary. TripLens will help you compare stays, transport, and costs before you book.
              </p>
              <button onClick={onCreateTrip} style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, borderRadius: 16, padding: "14px 0", border: "none", cursor: "pointer", background: T.teal, color: "white", boxShadow: "0 14px 48px rgba(20,184,166,0.42)", ...heading, fontSize: 15 }}>
                <Plus size={18} /> Create Trip
              </button>
            </SectionCard>
          </div>
        ) : (
          <div style={{ padding: "18px 20px 0" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
              <div>
                <p style={{ ...heading, fontSize: 19, color: T.navy }}>All Trips</p>
                <p style={{ ...body, fontSize: 12, color: T.slateL, marginTop: 2 }}>Upcoming itineraries at a glance</p>
              </div>
              <button onClick={onCreateTrip} style={{ background: "transparent", border: "none", color: T.teal, ...bodyMed, fontSize: 13, cursor: "pointer" }}>Create Trip</button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {trips.map(trip => (
                <SectionCard key={trip.id} style={{ overflow: "hidden", cursor: "pointer" }} onClick={() => onSelectTrip(trip)}>
                  <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 12 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                          <Chip color={trip.status === "Confirmed" ? T.green : T.amber} bg={trip.status === "Confirmed" ? "rgba(16,185,129,0.08)" : "rgba(245,158,11,0.08)"} border={trip.status === "Confirmed" ? "rgba(16,185,129,0.2)" : "rgba(245,158,11,0.2)"}>{trip.status}</Chip>
                        </div>
                        <p style={{ ...heading, fontWeight: 700, fontSize: 16, color: T.navy, marginBottom: 4 }}>{trip.name}</p>
                        <p style={{ ...body, fontSize: 13, color: T.slate, lineHeight: 1.5 }}>{trip.destination}</p>
                      </div>
                      <AmountPill value={trip.cost} />
                    </div>

                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                      <Chip color={T.slate} bg={T.bg} border={T.border}>{trip.startDate}</Chip>
                      <Chip color={T.slate} bg={T.bg} border={T.border}>{trip.adults + trip.children + trip.seniors} Travelers</Chip>
                    </div>

                    <div>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                        <span style={{ ...body, fontSize: 12, color: T.slate }}>Planning progress</span>
                        <span style={{ ...bodyMed, fontSize: 12, color: T.teal }}>{trip.progress}%</span>
                      </div>
                      <div style={{ height: 5, background: T.bg, borderRadius: 99, overflow: "hidden" }}>
                        <div style={{ width: `${trip.progress}%`, height: "100%", background: `linear-gradient(90deg, ${T.teal}, #22D3EE)`, borderRadius: 99 }} />
                      </div>
                    </div>
                  </div>
                </SectionCard>
              ))}
            </div>
          </div>
        )}
      </div>

      <BottomTabBar />
    </div>
  );
}

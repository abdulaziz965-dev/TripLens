import React from "react";
import { ChevronLeft, MapPin, Calendar, Car, Hotel, Coffee, Info, ArrowUpRight, CheckCircle, Navigation } from "lucide-react";
import { T, display, body, heading, label, bodyMed } from "../theme";
import { StatusBar, Chip } from "../components/SharedComponents";

interface DetailItemProps {
  icon: React.ReactNode;
  time: string;
  title: string;
  desc: string;
  cost?: string;
  isLast?: boolean;
}

function DetailItem({ icon, time, title, desc, cost, isLast }: DetailItemProps) {
  return (
    <div style={{ display: "flex", gap: 16 }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div style={{
          width: 32, height: 32, borderRadius: 10, background: "white",
          border: `1px solid ${T.border}`, display: "flex", alignItems: "center", justifyContent: "center",
          color: T.teal, zIndex: 1, boxShadow: "0 2px 8px rgba(0,0,0,0.03)"
        }}>
          {icon}
        </div>
        {!isLast && <div style={{ flex: 1, width: 1.5, background: `linear-gradient(to bottom, ${T.border}, transparent)`, margin: "4px 0" }} />}
      </div>
      <div style={{ flex: 1, paddingBottom: isLast ? 0 : 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
          <span style={{ ...label, fontSize: 9, color: T.slateL }}>{time}</span>
          {cost && <span style={{ ...bodyMed, fontSize: 12, color: T.navy }}>{cost}</span>}
        </div>
        <p style={{ ...heading, fontSize: 15, color: T.navy, marginBottom: 2 }}>{title}</p>
        <p style={{ ...body, fontSize: 13, color: T.slate, lineHeight: 1.5 }}>{desc}</p>
      </div>
    </div>
  );
}

export function TripDetailScreen({ trip, onBack }: { trip: any; onBack: () => void }) {
  // Simulated minute details for the trip
  const timeline = [
    { icon: <Car size={16}/>, time: "05:30 AM", title: "Taxi to Airport / Station", desc: "Estimated wait time 12 mins. Includes ₹50 early morning surcharge.", cost: "₹450" },
    { icon: <Navigation size={16}/>, time: "07:00 AM", title: "Transit to Destination", desc: `Direct transit to ${trip.destination}. Carry light snacks.`, cost: "Included" },
    { icon: <Car size={16}/>, time: "11:30 AM", title: "Arrival Taxi to Hotel", desc: "Local prepaid taxi counter. Avoid individual touts for safety.", cost: "₹280" },
    { icon: <Hotel size={16}/>, time: "12:30 PM", title: "Hotel Check-in", desc: "Early check-in requested. Luggage storage available if room not ready.", cost: "₹0" },
    { icon: <Coffee size={16}/>, time: "02:00 PM", title: "Lunch at Local Cafe", desc: "Authentic local cuisine. Top rated for hygiene.", cost: "₹850" },
    { icon: <Navigation size={16}/>, time: "04:30 PM", title: "Evening Exploration", desc: "Walkable distance to main attractions.", cost: "₹0" },
  ];

  return (
    <div style={{ width: "100%", minHeight: "100dvh", display: "flex", flexDirection: "column", background: T.bg }}>
      {/* Header Area */}
      <div style={{
        background: `linear-gradient(to bottom, ${T.navy}, #1e293b)`,
        paddingBottom: 32, borderRadius: "0 0 32px 32px",
        boxShadow: "0 10px 40px rgba(0,0,0,0.15)"
      }}>
        
        <div style={{ padding: "8px 20px 0", display: "flex", alignItems: "center", gap: 12 }}>
          <button onClick={onBack} style={{
            width: 38, height: 38, borderRadius: "50%", border: "1px solid rgba(255,255,255,0.15)",
            background: "rgba(255,255,255,0.1)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <ChevronLeft size={20} color="white" />
          </button>
          <div>
            <h1 style={{ ...display, fontSize: 22, color: "white", letterSpacing: -0.5 }}>Trip Details</h1>
            <p style={{ ...body, fontSize: 12, color: "rgba(255,255,255,0.45)" }}>The reality-checked itinerary</p>
          </div>
        </div>

        {/* Hero Card */}
        <div style={{
          margin: "24px 20px 0", background: "white", borderRadius: 24, padding: "20px",
          display: "flex", justifyContent: "space-between", alignItems: "flex-end",
          boxShadow: "0 20px 50px rgba(0,0,0,0.2)"
        }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
              <Chip color={T.teal} bg="rgba(20,184,166,0.08)" border="rgba(20,184,166,0.15)">{trip.status}</Chip>
              <Chip color={T.slate} bg={T.bg} border={T.border}>{trip.type}</Chip>
            </div>
            <h2 style={{ ...display, fontSize: 24, color: T.navy, marginBottom: 6 }}>{trip.name}</h2>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <Calendar size={14} color={T.slate} />
                <span style={{ ...body, fontSize: 13, color: T.slate }}>{trip.startDate}</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <MapPin size={14} color={T.slate} />
                <span style={{ ...body, fontSize: 13, color: T.slate }}>{trip.destination}</span>
              </div>
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <p style={{ ...label, fontSize: 10, color: T.slateL, marginBottom: 4 }}>Full Budget</p>
            <p style={{ ...display, fontSize: 22, color: T.teal }}>{trip.cost}</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflowY: "auto", scrollbarWidth: "none", padding: "28px 20px" }}>
        
        {/* Reality Notification */}
        <div style={{
          background: "linear-gradient(135deg, #F0FDFA 0%, #E0F2F1 100%)",
          borderRadius: 20, padding: "16px", marginBottom: 28,
          border: "1px solid rgba(20,184,166,0.15)", display: "flex", gap: 14
        }}>
          <div style={{
            width: 44, height: 44, borderRadius: 12, background: T.teal,
            display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0
          }}>
            <Info size={20} color="white" />
          </div>
          <div>
            <p style={{ ...heading, fontSize: 14, color: "#0F766E", marginBottom: 2 }}>Reality-Check Active</p>
            <p style={{ ...body, fontSize: 12, color: "#0D9488", lineHeight: 1.6 }}>
              Every minute cost—from taxi tolls to hotel porter tips—is calculated into your {trip.cost} estimate.
            </p>
          </div>
        </div>

        {/* Itinerary Timeline */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <p style={{ ...heading, fontSize: 18, color: T.navy }}>Day 1 Breakdown</p>
            <div style={{ display: "flex", gap: 4, alignItems: "center", color: T.teal }}>
              <span style={{ ...bodyMed, fontSize: 12 }}>View Map</span>
              <ArrowUpRight size={14} />
            </div>
          </div>

          <div style={{ position: "relative" }}>
            {timeline.map((item, idx) => (
              <DetailItem 
                key={idx} 
                {...item} 
                isLast={idx === timeline.length - 1} 
              />
            ))}
          </div>
        </div>

        {/* Travelers Section */}
        <div style={{ marginBottom: 24 }}>
          <p style={{ ...heading, fontSize: 18, color: T.navy, marginBottom: 16 }}>Travel Group</p>
          <div style={{
            background: "white", borderRadius: 20, padding: "16px",
            border: `1px solid ${T.border}`, display: "flex", justifyContent: "space-around"
          }}>
            {[
              { label: "Adults", count: trip.adults },
              { label: "Children", count: trip.children },
              { label: "Seniors", count: trip.seniors },
            ].map(g => (
              <div key={g.label} style={{ textAlign: "center" }}>
                <p style={{ ...display, fontSize: 20, color: T.navy }}>{g.count}</p>
                <p style={{ ...body, fontSize: 11, color: T.slate }}>{g.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Action Button */}
        <button style={{
          width: "100%", padding: "18px 0", borderRadius: 20, border: "none",
          background: T.navy, color: "white", ...heading, fontSize: 16,
          display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
          boxShadow: `0 14px 40px rgba(15,23,42,0.25)`
        }}>
          Confirm This Itinerary <CheckCircle size={20} />
        </button>

        <div style={{ height: 20 }} />
      </div>
    </div>
  );
}

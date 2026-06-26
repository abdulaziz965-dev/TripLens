import React, { useState } from "react";
import { ChevronLeft, MapPin, Calendar, CheckCircle, Eye, ArrowRight } from "lucide-react";
import { useLocation } from "react-router-dom";
import { auth } from "../../firebase/config";
import { T, display, body, label, subhead } from "../theme";
import { StatusBar, GuestCounter } from "../components/SharedComponents";
import { createTrip } from "../../services/dataService";
import { INDIAN_CITIES } from "../../data/indianCities";
import { toast } from "react-hot-toast";
const TRIP_TYPES = [
  { id: "family",    icon: "👨‍👩‍👧‍👦", label: "Family"    },
  { id: "adventure", icon: "🏔️",      label: "Adventure" },
  { id: "friends",   icon: "🍻",      label: "Friends"   },
  { id: "solo",      icon: "🎒",      label: "Solo"      },
];

export function CreateTripScreen({ onBack, onDone }: { onBack: () => void; onDone: (tripId: string) => void }) {
  const routerLocation = useLocation();
  const initialLocation = routerLocation.state?.location || "";

  const [tripType, setTripType] = useState("family");
  const tripMode =
  routerLocation.state?.tripMode ?? "upcoming";
  const [tripName, setTripName] = useState("");
  const [destination, setDestination] = useState(initialLocation);
  const [showDropdown, setShowDropdown] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [seniors, setSeniors] = useState(0);
  const [loading, setLoading] = useState(false);
  React.useEffect(() => {
  if (tripType === "solo") {
    setAdults(1);
  }
}, [tripType]);

  const totalTravelers = adults + children + seniors;

  const filteredSuggestions = destination.length > 1 
    ? INDIAN_CITIES.filter(loc => 
        loc.toLowerCase().includes(destination.toLowerCase())
      ).slice(0, 8)
    : [];

  const handleCreate = async () => {
    if (!tripName || !destination || !auth.currentUser) return;

    setLoading(true);
    try {
      const docRef = await createTrip({
        userId: auth.currentUser?.uid,
        name: tripName,
        destination,
        startDate,
        endDate,
        adults,
        children,
        seniors,
        totalTravelers,
        status: "Planning",
        progress: 10,
        cost: "₹0",
        type: tripType,
        tripMode,
      });
      onDone(docRef.id);
    } catch (error) {
      console.error("Error creating trip:", error);
      toast.error("Failed to create trip. Please try again.");
    } finally {
      setLoading(false);
    }
  };

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
                <span style={{ ...body, fontWeight: 600, fontSize: 11, color: tripType === t.id ? T.teal : T.slate }}>{t.label}</span>
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

        {/* Destination with Dropdown */}
        <div style={{ marginBottom: 16, position: "relative" }}>
          {fieldLabel("Destination")}
          <div style={{ position: "relative" }}>
            <MapPin size={16} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: T.teal, zIndex: 1 }} />
            <input 
              type="text" 
              value={destination} 
              onChange={e => { setDestination(e.target.value); setShowDropdown(true); }}
              onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
              onFocus={() => setShowDropdown(true)}
              placeholder="e.g. Goa, India" 
              style={{ ...inputStyle, paddingLeft: 40 }} 
            />
          </div>
          
          {showDropdown && filteredSuggestions.length > 0 && (
            <div style={{
              position: "absolute", top: "100%", left: 0, right: 0, zIndex: 10,
              background: "white", borderRadius: 12, marginTop: 4,
              boxShadow: "0 10px 25px rgba(0,0,0,0.1)", border: `1px solid ${T.border}`,
              overflow: "hidden"
            }}>
              {filteredSuggestions.map(s => (
                <div key={s} onMouseDown={() => { setDestination(s); setShowDropdown(false); }} style={{
                  padding: "12px 16px", cursor: "pointer", borderBottom: `1px solid ${T.border}`,
                  ...body, fontSize: 14, color: T.navy, display: "flex", alignItems: "center", gap: 10
                }}>
                  <MapPin size={14} color={T.slateL} /> {s}
                </div>
              ))}
            </div>
          )}
        </div>


        {/* Date range */}
        {tripMode === "upcoming" ? (
  <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
    <div style={{ flex: 1 }}>
      {fieldLabel("Start Date")}
      <div style={{ position: "relative" }}>
        <Calendar
          size={14}
          style={{
            position: "absolute",
            left: 12,
            top: "50%",
            transform: "translateY(-50%)",
            color: T.teal,
            zIndex: 1,
          }}
        />
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          style={{ ...inputStyle, paddingLeft: 36, fontSize: 13 }}
        />
      </div>
    </div>

    <div style={{ flex: 1 }}>
      {fieldLabel("End Date")}
      <div style={{ position: "relative" }}>
        <Calendar
          size={14}
          style={{
            position: "absolute",
            left: 12,
            top: "50%",
            transform: "translateY(-50%)",
            color: T.teal,
            zIndex: 1,
          }}
        />
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          style={{ ...inputStyle, paddingLeft: 36, fontSize: 13 }}
        />
      </div>
    </div>
  </div>
) : (
  <div
    style={{
      marginBottom: 20,
      padding: 18,
      borderRadius: 16,
      background: "#F8FAFC",
      border: `1px solid ${T.border}`,
    }}
  >
    <h3
      style={{
        margin: 0,
        color: T.navy,
        fontSize: 18,
      }}
    >
      📅 Travel Dates
    </h3>

    <p
      style={{
        marginTop: 10,
        color: T.slate,
        lineHeight: 1.7,
      }}
    >
      Dream Trips don't need fixed travel dates yet.
      <br />
      You'll choose them when you're ready to convert this into an Upcoming Trip.
    </p>
  </div>
)}

        {/* Guests */}
        <div style={{ marginBottom: 16 }}>
          {fieldLabel("Travelers")}
          <div style={{
            background: "white", borderRadius: 18, padding: "4px 16px",
            boxShadow: "0 2px 20px rgba(15,23,42,0.07)", border: `1px solid ${T.border}`,
          }}>
            <GuestCounter
  label="Adults"
  sub={
    tripType === "solo"
      ? "Solo trip (locked to 1)"
      : "Age 18 and above"
  }
  value={adults}
  onChange={(value) => {
    if (tripType !== "solo") {
      setAdults(value);
    }
  }}
/>

<GuestCounter
  label="Children"
  sub="Age 2 to 17 years"
  value={children}
  onChange={setChildren}
/>

<GuestCounter
  label="Seniors"
  sub="Age 60 and above"
  value={seniors}
  onChange={setSeniors}
  last
/>
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
            <p style={{ ...body, fontWeight: 600, fontSize: 13, color: T.teal }}>
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
        <button onClick={handleCreate} disabled={loading} style={{
          width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 9,
          borderRadius: 18, padding: "16px 0", border: "none", cursor: "pointer",
          background: T.teal, color: "white",
          boxShadow: `0 14px 48px rgba(20,184,166,0.45)`,
          ...display, fontSize: 16, letterSpacing: -0.2,
          opacity: loading ? 0.7 : 1,
        }}>
          {loading
  ? "Creating..."
  : tripMode === "dream"
  ? "Create Dream Trip"
  : "Create Trip"} <ArrowRight size={19} />
        </button>

        <div style={{ height: 8 }} />
      </div>
    </div>
  );
}

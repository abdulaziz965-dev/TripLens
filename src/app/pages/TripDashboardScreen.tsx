import React, { useMemo, useState } from "react";
import {
  ChevronLeft, MapPin, Calendar, Users, Hotel, Car, Wallet,
  Star, CheckCircle, AlertTriangle, Plus, X, Trash2, Plane,
} from "lucide-react";
import {
  Timestamp,
  doc,
  getDoc
} from "firebase/firestore";
import { auth,db } from "../../firebase/config";
import { T, display, body, heading, label, bodyMed, subhead } from "../theme";
import { StatusBar, Chip, SectionCard, AmountPill } from "../components/SharedComponents";
import { useTrip, useTripExpenses } from "../hooks/useRealtime";
import { addExpense, deleteExpense, updateTrip } from "../../services/dataService";

import {
  getHotelsForTrip,
  getTransportForTrip,
  getTripDurationLabel,
  type HotelRecommendation,
} from "../../data/tripIntelligence";

type DashboardTab =
  | "transport"
  | "hotels"
  | "activities"
  | "transfers"
  | "expenses";

type TransportMode = "roadtrip" | "flight";

const TABS: { id: DashboardTab; label: string; icon: React.ReactNode }[] = [
  { id: "transport", label: "Transport", icon: <Car size={16} /> },
  { id: "hotels", label: "Hotels", icon: <Hotel size={16} /> },
  { id: "activities", label: "Activities", icon: <MapPin size={16} /> },
  { id: "transfers", label: "Transfers", icon: <Car size={16} /> },
  { id: "expenses", label: "Expenses", icon: <Wallet size={16} /> },
];


const TRANSPORT_MODES: { id: TransportMode; label: string; icon: React.ReactNode; description: string }[] = [
  {
    id: "roadtrip",
    label: "Road Trip",
    icon: <Car size={18} />,
    description: "Bus & Train options",
  },
  {
    id: "flight",
    label: "Flight",
    icon: <Plane size={18} />,
    description: "Air travel options",
  },
];
const activitiesByCity: Record<string, any[]> = {
  ooty: [
    {
      id: "tea",
      name: "Tea Museum",
      price: "₹200",
      duration: "90 Minutes",
      rating: "4.6",
      image:
        "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
      description:
        "Discover the history of tea cultivation and processing in the Nilgiris.",
    },
    {
      id: "boat",
      name: "Boat Ride",
      price: "₹350",
      duration: "1 Hour",
      rating: "4.8",
      image:
        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
      description:
        "Enjoy a peaceful boat ride surrounded by Ooty's scenic landscapes.",
    },
    {
      id: "peak",
      name: "Doddabetta Peak",
      price: "₹150",
      duration: "2 Hours",
      rating: "4.7",
      image:
        "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b",
      description:
        "Visit the highest peak in the Nilgiris and enjoy panoramic views.",
    },
    {
      id: "garden",
      name: "Botanical Garden",
      price: "₹100",
      duration: "2 Hours",
      rating: "4.5",
      image:
        "https://images.unsplash.com/photo-1441974231531-c6227db76b6e",
      description:
        "Explore Ooty's famous botanical gardens featuring rare plants and flowers.",
    },
  ],

  goa: [
    {
      id: "scuba",
      name: "Scuba Diving",
      price: "₹2500",
      duration: "3 Hours",
      rating: "4.9",
      image:
        "https://images.unsplash.com/photo-1544551763-46a013bb70d5",
      description:
        "Explore vibrant marine life beneath Goa's crystal-clear waters.",
    },
    {
      id: "parasailing",
      name: "Parasailing",
      price: "₹1800",
      duration: "30 Minutes",
      rating: "4.8",
      image:
        "https://images.unsplash.com/photo-1500375592092-40eb2168fd21",
      description:
        "Experience breathtaking aerial views of Goa's beaches.",
    },
    {
      id: "dudhsagar",
      name: "Dudhsagar Falls",
      price: "₹1200",
      duration: "Half Day",
      rating: "4.9",
      image:
        "https://images.unsplash.com/photo-1439066615861-d1af74d74000",
      description:
        "Visit one of India's tallest and most spectacular waterfalls.",
    },
    {
      id: "cruise",
      name: "Sunset Cruise",
      price: "₹900",
      duration: "2 Hours",
      rating: "4.6",
      image:
        "https://images.unsplash.com/photo-1500375592092-40eb2168fd21",
      description:
        "Enjoy music, food, and beautiful sunset views over the Arabian Sea.",
    },
  ],

  hyderabad: [
    {
      id: "charminar",
      name: "Charminar",
      price: "₹100",
      duration: "2 Hours",
      rating: "4.7",
      image:
        "https://images.unsplash.com/photo-1599661046289-e31897846e41",
      description:
        "Explore Hyderabad's iconic monument and surrounding markets.",
    },
    {
      id: "ramoji",
      name: "Ramoji Film City",
      price: "₹1350",
      duration: "Full Day",
      rating: "4.8",
      image:
        "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba",
      description:
        "Visit the world's largest integrated film studio complex.",
    },
    {
      id: "golconda",
      name: "Golconda Fort",
      price: "₹200",
      duration: "3 Hours",
      rating: "4.7",
      image:
        "https://images.unsplash.com/photo-1512453979798-5ea266f8880c",
      description:
        "Walk through centuries of history at Hyderabad's famous fort.",
    },
    {
      id: "hussain",
      name: "Hussain Sagar Boat Ride",
      price: "₹300",
      duration: "1 Hour",
      rating: "4.5",
      image:
        "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
      description:
        "Enjoy a relaxing boat ride to the Buddha statue in Hussain Sagar Lake.",
    },
  ],
};
const travelOptions = [
  // ✈️ FLIGHTS
  {
    id: "indigo-flight",
    type: "flight",
    title: "Economy Flight",
    provider: "IndiGo",
    label: "IndiGo Flight",
    amount: "₹5800",
    duration: "2h 15m",
    comfort: "★★★★☆",
    image:
      "https://images.unsplash.com/photo-1436491865332-7a61a109cc05",
    mode: "flight" as TransportMode,
    highlights: [
      "Fastest option",
      "Direct route",
      "In-flight service",
    ],
  },

  {
    id: "airindia-flight",
    type: "flight",
    title: "Premium Economy",
    provider: "Air India",
    label: "Air India Flight",
    amount: "₹6500",
    duration: "2h 30m",
    comfort: "★★★★★",
    image:
      "https://images.unsplash.com/photo-1517479149777-5f3b1511d5ad",
    mode: "flight" as TransportMode,
    highlights: [
      "Meal included",
      "Extra baggage",
      "Premium seating",
    ],
  },

  // 🚆 TRAINS
  {
    id: "train-sleeper",
    type: "train",
    title: "Sleeper Class",
    provider: "Goa Express",
    label: "Sleeper Class",
    amount: "₹850",
    duration: "14h",
    comfort: "★★★☆☆",
    image:
      "https://images.unsplash.com/photo-1474487548417-781cb71495f3",
    mode: "roadtrip" as TransportMode,
    highlights: [
      "Budget friendly",
      "Sleeping berths",
      "Scenic journey",
    ],
  },

  {
    id: "train-3a",
    type: "train",
    title: "AC 3 Tier",
    provider: "Goa Express",
    label: "AC 3 Tier",
    amount: "₹1650",
    duration: "14h",
    comfort: "★★★★☆",
    image:
      "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957",
    mode: "roadtrip" as TransportMode,
    highlights: [
      "Air conditioned",
      "Comfortable berths",
      "Popular choice",
    ],
  },

  {
    id: "train-2a",
    type: "train",
    title: "AC 2 Tier",
    provider: "Goa Express",
    label: "AC 2 Tier",
    amount: "₹2450",
    duration: "14h",
    comfort: "★★★★★",
    image:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee",
    mode: "roadtrip" as TransportMode,
    highlights: [
      "More privacy",
      "Spacious berths",
      "Premium comfort",
    ],
  },

  {
    id: "train-1a",
    type: "train",
    title: "First AC",
    provider: "Goa Express",
    label: "First AC",
    amount: "₹4200",
    duration: "14h",
    comfort: "★★★★★",
    image:
      "https://images.unsplash.com/photo-1514565131-fce0801e5785",
    mode: "roadtrip" as TransportMode,
    highlights: [
      "Luxury cabins",
      "Maximum privacy",
      "Premium service",
    ],
  },

  // 🚌 BUSES
  {
    id: "bus-seater",
    type: "bus",
    title: "Seater",
    provider: "Orange Travels",
    label: "Seater Bus",
    amount: "₹900",
    duration: "12h",
    comfort: "★★★☆☆",
    image:
      "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957",
    mode: "roadtrip" as TransportMode,
    highlights: [
      "Lowest fare",
      "Reclining seats",
      "Frequent departures",
    ],
  },

  {
    id: "bus-semisleeper",
    type: "bus",
    title: "Semi Sleeper",
    provider: "Orange Travels",
    label: "Semi Sleeper Bus",
    amount: "₹1200",
    duration: "12h",
    comfort: "★★★★☆",
    image:
      "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429",
    mode: "roadtrip" as TransportMode,
    highlights: [
      "Extra legroom",
      "Comfortable journey",
      "AC coach",
    ],
  },

  {
    id: "bus-sleeper",
    type: "bus",
    title: "Sleeper",
    provider: "Orange Travels",
    label: "Sleeper Bus",
    amount: "₹1600",
    duration: "12h",
    comfort: "★★★★☆",
    image:
      "https://images.unsplash.com/photo-1517760444937-f6397edcbbcd",
    mode: "roadtrip" as TransportMode,
    highlights: [
      "Sleeping berth",
      "Ideal for overnight travel",
      "AC coach",
    ],
  },

  {
    id: "bus-acsleeper",
    type: "bus",
    title: "AC Sleeper",
    provider: "VRL Travels",
    label: "AC Sleeper Bus",
    amount: "₹2200",
    duration: "12h",
    comfort: "★★★★★",
    image:
      "https://images.unsplash.com/photo-1489515217757-5fd1be406fef",
    mode: "roadtrip" as TransportMode,
    highlights: [
      "Premium comfort",
      "Blanket provided",
      "Less travel fatigue",
    ],
  },

  {
    id: "bus-volvo",
    type: "bus",
    title: "Volvo Multi-Axle",
    provider: "SRS Travels",
    label: "Volvo Sleeper",
    amount: "₹2800",
    duration: "11h",
    comfort: "★★★★★",
    image:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee",
    mode: "roadtrip" as TransportMode,
    highlights: [
      "Luxury coach",
      "Smooth ride",
      "Best bus experience",
    ],
  },
] as const;

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
        <img
          src={hotel.photos[0]}
          alt={hotel.name}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(to top, rgba(15,23,42,0.75), transparent)",
          }}
        />
        <div style={{ position: "absolute", top: 10, left: 10 }}>
          <Chip color="white" bg="rgba(15,23,42,0.55)" border="rgba(255,255,255,0.2)">
            Score {hotel.familyScore}
          </Chip>
        </div>
        <div style={{ position: "absolute", bottom: 10, left: 12, right: 12 }}>
          <p style={{ ...heading, fontSize: 16, color: "white", marginBottom: 4 }}>
            {hotel.name}
          </p>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <span style={{ ...body, fontSize: 11, color: "rgba(255,255,255,0.75)" }}>
              <Star
                size={10}
                fill="#FCD34D"
                color="#FCD34D"
                style={{ display: "inline", marginRight: 4 }}
              />
              {hotel.rating}
            </span>
            <span style={{ ...body, fontSize: 11, color: "rgba(255,255,255,0.65)" }}>
              {hotel.distance}
            </span>
          </div>
        </div>
      </div>
      <div style={{ padding: 16 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: 12,
          }}
        >
          <div>
            <p style={{ ...label, fontSize: 10, color: T.slateL, marginBottom: 4 }}>Per night</p>
            <p style={{ ...heading, fontSize: 18, color: T.navy }}>
              ₹{hotel.pricePerNight.toLocaleString("en-IN")}
            </p>
          </div>
          <div style={{ textAlign: "right" }}>
            <p style={{ ...label, fontSize: 10, color: T.slateL, marginBottom: 4 }}>
              {nights} nights est.
            </p>
            <p style={{ ...bodyMed, fontSize: 14, color: T.teal }}>
              ₹{total.toLocaleString("en-IN")}
            </p>
          </div>
        </div>
        <div
          style={{
            padding: "12px 14px",
            borderRadius: 14,
            marginBottom: 12,
            background: hotel.suitable ? "rgba(16,185,129,0.06)" : "rgba(245,158,11,0.08)",
            border: `1px solid ${
              hotel.suitable ? "rgba(16,185,129,0.2)" : "rgba(245,158,11,0.25)"
            }`,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            {hotel.suitable ? (
              <CheckCircle size={16} color={T.green} />
            ) : (
              <AlertTriangle size={16} color={T.amber} />
            )}
            <span
              style={{
                ...bodyMed,
                fontSize: 13,
                color: hotel.suitable ? "#065F46" : "#92400E",
              }}
            >
              {hotel.suitable ? "Suitable for your group" : "Review sleeping arrangements"}
            </span>
          </div>
          {hotel.mattressWarning && (
            <p style={{ ...body, fontSize: 12, color: T.amber, marginBottom: 4 }}>
              ⚠ {hotel.mattressWarning}
            </p>
          )}
          {hotel.extraCostRange && (
            <p style={{ ...body, fontSize: 12, color: T.slate }}>
              Estimated extra: {hotel.extraCostRange}
            </p>
          )}
        </div>
        <div style={{ marginBottom: 14 }}>
          <p style={{ ...label, fontSize: 10, color: T.slateL, marginBottom: 8 }}>
            Family analysis
          </p>
          {hotel.analysis.map(line => (
            <p
              key={line}
              style={{ ...body, fontSize: 12, color: T.slate, lineHeight: 1.6, marginBottom: 4 }}
            >
              • {line}
            </p>
          ))}
        </div>
        <button
          onClick={onBook}
          disabled={booking}
          style={{
            width: "100%",
            padding: "14px 0",
            borderRadius: 14,
            border: "none",
            cursor: "pointer",
            background: T.navy,
            color: "white",
            ...heading,
            fontSize: 14,
            opacity: booking ? 0.7 : 1,
          }}
        >
          {booking ? "Adding…" : "Booked This"}
        </button>
      </div>
    </SectionCard>
  );
}

export function TripDashboardScreen({
  tripId,
  onBack,
}: {
  tripId: string;
  onBack: () => void;
}) {
  const { data: trip, loading } = useTrip(tripId);
  const { data: expenses } = useTripExpenses(tripId, auth.currentUser?.uid);
  
  const [tab, setTab] = useState<DashboardTab>("transport");
  const [transportMode, setTransportMode] = useState<TransportMode>("roadtrip");
  
  const [bookingId, setBookingId] = useState<string | null>(null);
  const [selectedHotel, setSelectedHotel] = useState<HotelRecommendation | null>(null);
  const [selectedTransport, setSelectedTransport] =
  useState<(typeof travelOptions)[number] | null>(null);
  const [selectedActivity, setSelectedActivity] =
  useState<(typeof activities)[number] | null>(null);
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [expenseTitle, setExpenseTitle] = useState("");
  const [expenseAmount, setExpenseAmount] = useState("");
  const [confirmationMessage, setConfirmationMessage] = useState<string | null>(null);
  const [expenseType, setExpenseType] = useState<(typeof MANUAL_TYPES)[number]["id"]>("food");
  const [savingExpense, setSavingExpense] = useState(false);
  const [savingTrip, setSavingTrip] = useState(false);
  const [deletingExpenseId, setDeletingExpenseId] = useState<string | null>(null);
  const [displayName, setDisplayName] = useState("Traveler");

React.useEffect(() => {
  const loadProfile = async () => {
    const user = auth.currentUser;

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
}, []);

  const hotels = useMemo(() => (trip ? getHotelsForTrip(trip) : []), [trip]);
  
  const transfers = useMemo(() => (trip ? getTransportForTrip(trip) : []), [trip]);
  const activities = useMemo(() => {
  const city =
    trip?.destination?.toLowerCase() ?? "";

  return (
    activitiesByCity[city] ??
    activitiesByCity["ooty"]
  );
}, [trip]);

  const filteredTravelOptions = useMemo(
    () => travelOptions.filter(o => o.mode === transportMode),
    [transportMode]
  );

  const nights = useMemo(() => {
    if (!trip?.startDate || !trip?.endDate) return 3;
    const n = Math.round(
      (new Date(trip.endDate).getTime() - new Date(trip.startDate).getTime()) / 86400000
    );
    return Math.max(1, n);
  }, [trip]);

  const totalTravelers = trip ? trip.adults + trip.children + trip.seniors : 0;
  const confirmed = expenses.filter(e => e.category === "Confirmed");
  const manual = expenses.filter(e => e.category === "Manual");
  const parseAmount = (amount: string) => {
  const cleaned = amount.replace(/[^\d]/g, "");

  return cleaned ? Number(cleaned) : 0;
};

const savedTotalSpend = expenses.reduce(
  (acc, e) => acc + parseAmount(e.amount),
  0
);
  const savedTotalSpendLabel = `₹${savedTotalSpend.toLocaleString("en-IN")}`;
  const displayedTripCost = expenses.length > 0 ? savedTotalSpendLabel : trip?.cost || savedTotalSpendLabel;

  const formatExpenseDate = (createdAt?: { toDate?: () => Date }) => {
    const date = createdAt?.toDate?.();
    if (!date) return "Time pending";
    return new Intl.DateTimeFormat("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(date);
  };

  const handleBookHotel = async (hotel: HotelRecommendation) => {
  if (!trip || !auth.currentUser) return;

  setBookingId(hotel.id);

  try {
    const amount =
      hotel.pricePerNight *
      hotel.roomsRequired *
      nights;

    await addExpense({
      tripId: trip.id,
      userId: auth.currentUser.uid,
      label: `${hotel.name} (${hotel.roomsRequired} room${
        hotel.roomsRequired > 1 ? "s" : ""
      })`,
      amount: `₹${amount.toLocaleString("en-IN")}`,
      category: "Confirmed",
      expenseType: "hotel",
    });

    setConfirmationMessage(
      `🏨 ${hotel.name} has been successfully booked!\n\nTotal Amount: ₹${amount.toLocaleString(
        "en-IN"
      )}`
    );

  } catch (err) {
    console.error("[TripLens] Failed to add hotel expense:", err);

    alert(
      "Could not save expense. Check Firestore rules and try again."
    );
  } finally {
    setBookingId(null);
  }
};

 const handleBookTravelOption = async (
  option: (typeof travelOptions)[number]
) => {
  if (!trip || !auth.currentUser) return;

  setBookingId(option.id);

  try {
    await addExpense({
      tripId: trip.id,
      userId: auth.currentUser.uid,
      label: option.label,
      amount: option.amount,
      category: "Confirmed",
      expenseType: option.type,
    });

    setConfirmationMessage(
      `✈️ ${option.label} has been successfully booked!\n\nTotal Amount: ${option.amount}`
    );

  } catch (err) {
    console.error("[TripLens] Failed to add transport expense:", err);

    alert(
      "Could not save expense. Check Firestore rules and try again."
    );
  } finally {
    setBookingId(null);
  }
};
const handleBookActivity = async (
  activity: (typeof activities)[number]
) => {
  if (!trip || !auth.currentUser) return;

  try {
    await addExpense({
      tripId: trip.id,
      userId: auth.currentUser.uid,
      label: activity.name,
      amount: activity.price,
      category: "Confirmed",
      expenseType: "activity",
    });

    setConfirmationMessage(
      `🎉 Activity booked!\n\n${activity.name}`
    );
  } catch (err) {
    console.error(err);
  }
};

  const handleAddManualExpense = async () => {
    if (!trip || !auth.currentUser || !expenseTitle || !expenseAmount) return;
    setSavingExpense(true);
    try {
      const amount = expenseAmount.startsWith("₹")
        ? expenseAmount
        : `₹${parseInt(expenseAmount, 10).toLocaleString("en-IN")}`;
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
  const handleBookTransfer = async (
  transfer: (typeof transfers)[number]
) => {
  if (!trip || !auth.currentUser) return;

  try {
    const maxFare =
  Math.max(
    ...(transfer.taxiCost.match(/\d+/g) || [])
      .map(Number)
  );
    
    await addExpense({
      tripId: trip.id,
      userId: auth.currentUser.uid,
      label: `${transfer.from} → ${transfer.to}`,
      amount: `₹${maxFare}`,
      category: "Confirmed",
      expenseType: "transfer",
    });

    setConfirmationMessage(
  `🚕 Transfer Added Successfully!\n\n${transfer.from} → ${transfer.to}\n\nEstimated Cost: ₹${maxFare}`
);
  } catch (err) {
    console.error(err);
  }
};

  const handleSaveTrip = async () => {
    if (!trip || !auth.currentUser) return;
    setSavingTrip(true);
    try {
      await updateTrip(trip.id, {
        cost: savedTotalSpendLabel,
        status: "Confirmed",
        progress: 100,
        savedAt: Timestamp.now(),
      });
    } catch (err) {
      console.error("[TripLens] Failed to save trip:", err);
      alert("Could not save trip. Check Firestore rules and try again.");
    } finally {
      setSavingTrip(false);
    }
  };

  const handleDeleteExpense = async (expenseId: string) => {
  const confirmed = window.confirm(
    "Do you really want to delete this expense?"
  );

  if (!confirmed) return;

  setDeletingExpenseId(expenseId);

  try {
    await deleteExpense(expenseId);
  } catch (err) {
    console.error(
      "[TripLens] Failed to delete expense:",
      err
    );

    alert(
      "Could not delete expense."
    );
  } finally {
    setDeletingExpenseId(null);
  }
};

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100dvh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: T.bg,
        }}
      >
        <p style={{ ...body, color: T.slate }}>Loading trip…</p>
      </div>
    );
  }

  if (!trip) {
    return (
      <div
        style={{
          minHeight: "100dvh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: T.bg,
          padding: 24,
        }}
      >
        <p style={{ ...heading, fontSize: 18, color: T.navy, marginBottom: 12 }}>Trip not found</p>
        <button
          onClick={onBack}
          style={{
            padding: "12px 24px",
            borderRadius: 12,
            border: "none",
            background: T.teal,
            color: "white",
            cursor: "pointer",
            ...bodyMed,
          }}
        >
          Go back
        </button>
      </div>
    );
  }

  return (
    <div
      style={{
        width: "100%",
        minHeight: "100dvh",
        display: "flex",
        flexDirection: "column",
        background: T.bg,
      }}
    >
      {/* Header */}
      <div
        style={{
          background: `linear-gradient(160deg, ${T.navy} 0%, #1e3a5f 100%)`,
          paddingBottom: 16,
          borderRadius: "0 0 28px 28px",
          boxShadow: "0 8px 32px rgba(15,23,42,0.18)",
        }}
      >
        
        <div style={{ padding: "4px 20px 0", display: "flex", alignItems: "center", gap: 12 }}>
          <button
            onClick={onBack}
            style={{
              width: 38,
              height: 38,
              borderRadius: "50%",
              border: "1px solid rgba(255,255,255,0.15)",
              background: "rgba(255,255,255,0.1)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <ChevronLeft size={20} color="white" />
          </button>
          <div style={{ flex: 1 }}>
            <h1 style={{ ...display, fontSize: 22, color: "white", letterSpacing: -0.5 }}>
              {trip.name}
            </h1>
            <p style={{ ...body, fontSize: 12, color: "rgba(255,255,255,0.45)" }}>Trip Dashboard</p>
          </div>
          <Chip color={T.teal} bg="rgba(20,184,166,0.15)" border="rgba(20,184,166,0.3)">
            {trip.status}
          </Chip>
        </div>
        <div
          style={{
            margin: "16px 20px 0",
            background: "white",
            borderRadius: 20,
            padding: "16px 18px",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 12,
            boxShadow: "0 12px 40px rgba(0,0,0,0.15)",
          }}
        >
          {[
            { icon: <MapPin size={14} color={T.teal} />, label: trip.destination },
            { icon: <Calendar size={14} color={T.teal} />, label: getTripDurationLabel(trip) },
            { icon: <Users size={14} color={T.teal} />, label: `${totalTravelers} travelers` },
            { icon: <Wallet size={14} color={T.teal} />, label: displayedTripCost },
          ].map(item => (
            <div key={item.label} style={{ display: "flex", alignItems: "center", gap: 8 }}>
              {item.icon}
              <span style={{ ...body, fontSize: 13, color: T.navy }}>{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div
        style={{
          display: "flex",
          gap: 6,
          padding: "14px 16px 0",
          overflowX: "auto",
          scrollbarWidth: "none",
        }}
      >
        {TABS.map(t => {
          const active = tab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              style={{
                flexShrink: 0,
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "10px 14px",
                borderRadius: 99,
                border: "none",
                cursor: "pointer",
                background: active ? T.navy : "white",
                color: active ? "white" : T.slate,
                boxShadow: active
                  ? "0 4px 16px rgba(15,23,42,0.2)"
                  : "0 2px 8px rgba(15,23,42,0.06)",
                ...bodyMed,
                fontSize: 12,
              }}
            >
              {t.icon} {t.label}
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflowY: "auto", scrollbarWidth: "none", padding: "16px 20px 32px" }}>
        {/* ───── TRANSPORT TAB ───── */}
        {tab === "transport" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {/* Sub-heading */}
            <p style={{ ...body, fontSize: 13, color: T.slate, lineHeight: 1.6 }}>
              Choose how you want to travel to {trip.destination}.
            </p>

            {/* Transport Mode Selector — Road Trip vs Flight */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 12,
              }}
            >
              {TRANSPORT_MODES.map(mode => {
                const isActive = transportMode === mode.id;
                return (
                  <button
                    key={mode.id}
                    onClick={() => setTransportMode(mode.id)}
                    style={{
                      position: "relative",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 8,
                      padding: "20px 12px",
                      borderRadius: 18,
                      border: `2px solid ${isActive ? T.teal : T.border}`,
                      background: isActive
                        ? "rgba(20,184,166,0.08)"
                        : "white",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                      boxShadow: isActive
                        ? "0 4px 20px rgba(20,184,166,0.18)"
                        : "0 2px 8px rgba(15,23,42,0.05)",
                    }}
                  >
                    {/* Active indicator dot */}
                    {isActive && (
                      <div
                        style={{
                          position: "absolute",
                          top: 10,
                          right: 10,
                          width: 8,
                          height: 8,
                          borderRadius: "50%",
                          background: T.teal,
                          boxShadow: `0 0 0 3px rgba(20,184,166,0.2)`,
                        }}
                      />
                    )}
                    <div
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: 14,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background: isActive ? "rgba(20,184,166,0.12)" : "rgba(15,23,42,0.04)",
                        color: isActive ? T.teal : T.slate,
                      }}
                    >
                      {mode.icon}
                    </div>
                    <span
                      style={{
                        ...heading,
                        fontSize: 14,
                        color: isActive ? T.teal : T.navy,
                      }}
                    >
                      {mode.label}
                    </span>
                    <span
                      style={{
                        ...body,
                        fontSize: 11,
                        color: isActive ? T.teal : T.slateL,
                      }}
                    >
                      {mode.description}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Filtered Travel Options */}
            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 4 }}>
              {filteredTravelOptions.length === 0 && (
                <p
                  style={{
                    ...body,
                    fontSize: 13,
                    color: T.slateL,
                    textAlign: "center",
                    padding: "24px 0",
                  }}
                >
                  No options available for this mode.
                </p>
              )}
              {filteredTravelOptions.map(option => (
               <SectionCard
  onClick={() => setSelectedTransport(option)}
  style={{
    padding: 16,
    cursor: "pointer",
  }}
>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      marginBottom: 10,
                    }}
                  >
                    <div>
                      <p style={{ ...label, fontSize: 9, color: T.teal, marginBottom: 4 }}>
                        {option.title}
                      </p>
                      <p style={{ ...heading, fontSize: 15, color: T.navy }}>{option.provider}</p>
                    </div>
                    <AmountPill value={option.amount} />
                  </div>
                  <p
                    style={{
                      ...body,
                      fontSize: 12,
                      color: T.slate,
                      marginBottom: 12,
                      lineHeight: 1.55,
                    }}
                  >
                    Duration {option.duration}
                  </p>

                  {/* Highlights */}
                  {"highlights" in option && (option as any).highlights && (
                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 6,
                        marginBottom: 14,
                      }}
                    >
                      {((option as any).highlights as string[]).map(h => (
                        <span
                          key={h}
                          style={{
                            padding: "4px 10px",
                            borderRadius: 99,
                            background: "rgba(20,184,166,0.06)",
                            border: "1px solid rgba(20,184,166,0.15)",
                            ...body,
                            fontSize: 11,
                            color: T.teal,
                          }}
                        >
                          {h}
                        </span>
                      ))}
                    </div>
                  )}

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleBookTravelOption(option);
                    }}
                    disabled={bookingId === option.id}
                    style={{
                      width: "100%",
                      padding: "14px 0",
                      borderRadius: 14,
                      border: "none",
                      cursor: "pointer",
                      background: T.navy,
                      color: "white",
                      ...heading,
                      fontSize: 14,
                      opacity: bookingId === option.id ? 0.7 : 1,
                    }}
                  >
                    {bookingId === option.id ? "Adding…" : "Book This"}
                  </button>
                </SectionCard>
              ))}
            </div>
          </div>
        )}

        {/* ───── HOTELS TAB ───── */}
        {tab === "hotels" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <p style={{ ...body, fontSize: 13, color: T.slate, lineHeight: 1.6 }}>
              Hotels analysed for {totalTravelers} travelers — room fit, mattress needs, and hidden
              charges included.
            </p>
            {hotels.map(h => (
              <div
                key={h.id}
                onClick={() => setSelectedHotel(h)}
                style={{ cursor: "pointer" }}
              >
              <HotelCard
                hotel={h}
                nights={nights}
                onBook={() => handleBookHotel(h)}
                booking={bookingId === h.id}
              />
            </div>
        ))}
          </div>
        )}
        {tab === "activities" && (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      gap: 12
    }}
  >
    {activities.map(activity => (
      <SectionCard
  onClick={() => setSelectedActivity(activity)}
  style={{
    padding: 16,
    cursor: "pointer",
  }}
>
  <img
  src={activity.image}
  alt={activity.name}
  style={{
    width: "100%",
    height: 180,
    objectFit: "cover",
    borderRadius: 12,
    marginBottom: 12,
  }}
/>
        <p
          style={{
            ...heading,
            fontSize: 16
          }}
        >
          {activity.name}
          <p
  style={{
    ...body,
    color: "#f59e0b",
    marginTop: 4,
  }}
>
  ⭐ {activity.rating}
</p>
        </p>

        <p style={{ ...body }}>
          {activity.description}
        </p>

        <p
          style={{
            ...body,
            marginTop: 8
          }}
        >
          {activity.duration}
        </p>

        <AmountPill
          value={activity.price}
        />

        <button
          onClick={(e) => {
            e.stopPropagation();
            handleBookActivity(activity);
          }}
          style={{
            width: "100%",
            marginTop: 12,
            padding: 12,
            borderRadius: 12,
            border: "none",
            background: T.teal,
            color: "white",
            cursor: "pointer"
          }}
        >
          Add Activity
        </button>
      </SectionCard>
    ))}
  </div>
)}

        {/* ───── TRANSFERS TAB ───── */}
        {tab === "transfers" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <p style={{ ...body, fontSize: 13, color: T.slate, lineHeight: 1.6, marginBottom: 4 }}>
              Door-to-door transport realities for {trip.destination}.
            </p>
            {transfers.map(route => (
              <SectionCard key={route.id} style={{ padding: 16 }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    marginBottom: 10,
                  }}
                >
                  <div>
                    <p style={{ ...label, fontSize: 9, color: T.teal, marginBottom: 4 }}>
                      {route.from} → {route.to}
                    </p>
                    <p style={{ ...heading, fontSize: 15, color: T.navy }}>{route.duration}</p>
                  </div>
                  <AmountPill value={route.taxiCost} />
                </div>
                <p
                  style={{
                    ...body,
                    fontSize: 12,
                    color: T.slate,
                    marginBottom: 8,
                    lineHeight: 1.55,
                  }}
                >
                  {route.publicTransport}
                </p>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div>
                    <p style={{ ...label, fontSize: 9, color: T.slateL, marginBottom: 4 }}>
                      Convenience
                    </p>
                    <ConvenienceStars rating={route.convenience} />
                  </div>
                </div>
                <p
                  style={{
                    ...body,
                    fontSize: 11,
                    color: T.slateL,
                    marginTop: 10,
                    lineHeight: 1.5,
                    fontStyle: "italic",
                  }}
                >
                  {route.note}
                
                </p>
                <button
  onClick={() => handleBookTransfer(route)}
  style={{
    width: "100%",
    marginTop: 12,
    padding: 12,
    borderRadius: 12,
    border: "none",
    background: T.navy,
    color: "white",
    cursor: "pointer",
  }}
>
  Add Transfer Expense
</button>
                
              </SectionCard>
            ))}
          </div>
        )}

        {/* ───── EXPENSES TAB ───── */}
        {tab === "expenses" && (
          <div>
            <SectionCard
              style={{
                padding: 16,
                marginBottom: 16,
                background: "linear-gradient(135deg, rgba(20,184,166,0.08), rgba(20,184,166,0.02))",
              }}
            >
              <p style={{ ...label, fontSize: 10, color: T.teal, marginBottom: 6 }}>Total Spend</p>
              <p style={{ ...display, fontSize: 28, color: T.navy }}>{savedTotalSpendLabel}</p>
              <p style={{ ...body, fontSize: 12, color: T.slate, marginTop: 4 }}>
                {confirmed.length} confirmed · {manual.length} manual
              </p>
            </SectionCard>

            <button
              onClick={handleSaveTrip}
              disabled={savingTrip || savedTotalSpend === 0}
              style={{
                width: "100%",
                marginBottom: 16,
                padding: "13px 0",
                borderRadius: 14,
                border: "none",
                background: T.navy,
                color: "white",
                cursor: "pointer",
                ...bodyMed,
                fontSize: 14,
                opacity: savingTrip || savedTotalSpend === 0 ? 0.6 : 1,
              }}
            >
              {savingTrip ? "Saving Trip…" : `Save Trip (${savedTotalSpendLabel})`}
            </button>

            <button
              onClick={() => setShowAddExpense(v => !v)}
              style={{
                width: "100%",
                marginBottom: 16,
                padding: "13px 0",
                borderRadius: 14,
                border: `1.5px solid ${T.teal}`,
                background: "rgba(20,184,166,0.07)",
                color: T.teal,
                cursor: "pointer",
                ...bodyMed,
                fontSize: 14,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
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
                  style={{
                    width: "100%",
                    padding: "12px 14px",
                    borderRadius: 12,
                    border: `1px solid ${T.border}`,
                    marginBottom: 10,
                    ...body,
                    fontSize: 14,
                  }}
                />
                <input
                  type="number"
                  placeholder="Amount (e.g. 850)"
                  value={expenseAmount}
                  onChange={e => setExpenseAmount(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "12px 14px",
                    borderRadius: 12,
                    border: `1px solid ${T.border}`,
                    marginBottom: 12,
                    ...body,
                    fontSize: 14,
                  }}
                />
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 14 }}>
                  {MANUAL_TYPES.map(t => (
                    <button
                      key={t.id}
                      onClick={() => setExpenseType(t.id)}
                      style={{
                        padding: "6px 12px",
                        borderRadius: 99,
                        cursor: "pointer",
                        border: `1px solid ${expenseType === t.id ? T.teal : T.border}`,
                        background: expenseType === t.id ? "rgba(20,184,166,0.1)" : "white",
                        color: expenseType === t.id ? T.teal : T.slate,
                        ...body,
                        fontSize: 12,
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
                    width: "100%",
                    padding: "13px 0",
                    borderRadius: 12,
                    border: "none",
                    background: T.teal,
                    color: "white",
                    cursor: "pointer",
                    ...bodyMed,
                    opacity: savingExpense || !expenseTitle || !expenseAmount ? 0.6 : 1,
                  }}
                >
                  {savingExpense ? "Saving…" : "Save Expense"}
                </button>
              </SectionCard>
            )}

            {confirmed.length > 0 && (
              <div style={{ marginBottom: 20 }}>
                <p style={{ ...heading, fontSize: 16, color: T.navy, marginBottom: 10 }}>
                  Confirmed
                </p>
               {confirmed.map(e => (
  <SectionCard key={e.id} style={{ padding: 14, marginBottom: 8 }}>
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        gap: 12,
      }}
    >
      <div>
        <p
          style={{
            ...bodyMed,
            fontSize: 14,
            color: T.navy,
          }}
        >
          {e.label}
        </p>

        <p
          style={{
            ...body,
            fontSize: 11,
            color: T.slateL,
            marginTop: 4,
          }}
        >
          {formatExpenseDate(e.createdAt)}
        </p>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
          gap: 8,
        }}
      >
        <AmountPill value={e.amount} />

        <button
          onClick={() => handleDeleteExpense(e.id)}
          disabled={deletingExpenseId === e.id}
          style={{
            width: 34,
            height: 34,
            borderRadius: "50%",
            border: "1px solid rgba(239,68,68,0.18)",
            background: "rgba(239,68,68,0.06)",
            color: T.red,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            opacity: deletingExpenseId === e.id ? 0.6 : 1,
          }}
        >
          <Trash2 size={15} />
        </button>
      </div>
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
                          <p style={{ ...body, fontSize: 11, color: T.slateL, marginTop: 2 }}>
                            {e.expenseType}
                          </p>
                        )}
                        <p style={{ ...body, fontSize: 11, color: T.slateL, marginTop: 4 }}>
                          {formatExpenseDate(e.createdAt)}
                        </p>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "flex-end",
                          gap: 8,
                        }}
                      >
                        <AmountPill value={e.amount} subtle />
                        <button
                          onClick={() => handleDeleteExpense(e.id)}
                          disabled={deletingExpenseId === e.id}
                          style={{
                            width: 34,
                            height: 34,
                            borderRadius: "50%",
                            border: "1px solid rgba(239,68,68,0.18)",
                            background: "rgba(239,68,68,0.06)",
                            color: T.red,
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            opacity: deletingExpenseId === e.id ? 0.6 : 1,
                          }}
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>
                  </SectionCard>
                ))}
              </div>
            )}

            {expenses.length === 0 && (
              <p
                style={{
                  ...body,
                  fontSize: 13,
                  color: T.slate,
                  textAlign: "center",
                  padding: "24px 0",
                }}
              >
                No expenses yet. Book a hotel or add a manual estimate.
              </p>
            )}
          </div>
        )}
      </div>
      {selectedHotel && (
  <div
    onClick={() => setSelectedHotel(null)}
    style={{
      position: "fixed",
      inset: 0,
      background: "rgba(0,0,0,0.7)",
      zIndex: 9999,
      display: "flex",
      alignItems: "flex-end",
    }}
  >
    <div
      onClick={(e) => e.stopPropagation()}
      style={{
        width: "100%",
        maxHeight: "90vh",
        overflowY: "auto",
        background: "white",
        borderRadius: "24px 24px 0 0",
      }}
    >
      <img
        src={selectedHotel.photos[0]}
        alt={selectedHotel.name}
        style={{
          width: "100%",
          height: 240,
          objectFit: "cover",
        }}
      />

      <div style={{ padding: 20 }}>
        <h2
          style={{
            ...heading,
            fontSize: 24,
            color: T.navy,
            marginBottom: 8,
          }}
        >
          {selectedHotel.name}
        </h2>

        <p style={{ ...body, color: T.slate }}>
          ⭐ {selectedHotel.rating} • {selectedHotel.distance}
        </p>

        <div style={{ marginTop: 20 }}>
          <p style={{ ...heading, fontSize: 16 }}>
            About this Hotel
          </p>
          

          <p
            style={{
              ...body,
              color: T.slate,
              marginTop: 8,
              lineHeight: 1.7,
            }}
          >
            {selectedHotel.analysis.join(" ")}
          </p>
        </div>

        <div style={{ marginTop: 20 }}>
          <p style={{ ...heading, fontSize: 16 }}>
            Reviews
          </p>

          <p style={{ ...body, color: T.slate }}>
            "Excellent location and family friendly."
          </p>

          <p style={{ ...body, color: T.slate }}>
            "Clean rooms and good service."
          </p>

          <p style={{ ...body, color: T.slate }}>
            "Worth the price for groups."
          </p>
        </div>

        <div style={{ marginTop: 20 }}>
          <button
            style={{
              width: "100%",
              padding: 14,
              borderRadius: 14,
              border: "none",
              background: T.teal,
              color: "white",
              cursor: "pointer",
            }}
          >
            Open in Google Maps
          </button>
        </div>

        <button
          onClick={() => handleBookHotel(selectedHotel)}
          style={{
            width: "100%",
            marginTop: 12,
            padding: 14,
            borderRadius: 14,
            border: "none",
            background: T.navy,
            color: "white",
            cursor: "pointer",
          }}
        >
          Book This Hotel
        </button>
      </div>
    </div>
  </div>
)}
{selectedTransport && (
  <div
    onClick={() => setSelectedTransport(null)}
    style={{
      position: "fixed",
      inset: 0,
      background: "rgba(0,0,0,0.7)",
      zIndex: 9999,
      display: "flex",
      alignItems: "flex-end",
    }}
  >
    <div
      onClick={(e) => e.stopPropagation()}
      style={{
        width: "100%",
        maxHeight: "90vh",
        overflowY: "auto",
        background: "white",
        borderRadius: "24px 24px 0 0",
      }}
    >
      <img
        src={selectedTransport.image}
        alt={selectedTransport.title}
        style={{
          width: "100%",
          height: 240,
          objectFit: "cover",
        }}
      />

      <div style={{ padding: 20 }}>
        <h2
          style={{
            ...heading,
            fontSize: 24,
            color: T.navy,
            marginBottom: 8,
          }}
        >
          {selectedTransport.label}
        </h2>

        <p style={{ ...body, color: T.slate }}>
          {selectedTransport.provider}
        </p>

        <p
          style={{
            ...heading,
            fontSize: 20,
            color: T.teal,
            marginTop: 10,
          }}
        >
          {selectedTransport.amount}
        </p>

        <p style={{ ...body, color: T.slate }}>
          Duration: {selectedTransport.duration}
        </p>

        <p
          style={{
            marginTop: 12,
            fontSize: 18,
          }}
        >
          {selectedTransport.comfort}
        </p>

        <div style={{ marginTop: 20 }}>
          <p style={{ ...heading, fontSize: 16 }}>
            Highlights
          </p>

          {selectedTransport.highlights.map(item => (
            <p
              key={item}
              style={{
                ...body,
                color: T.slate,
                marginTop: 6,
              }}
            >
              • {item}
            </p>
          ))}
        </div>

        <button
          onClick={() =>
            handleBookTravelOption(selectedTransport)
          }
          style={{
            width: "100%",
            marginTop: 24,
            padding: 14,
            borderRadius: 14,
            border: "none",
            background: T.navy,
            color: "white",
            cursor: "pointer",
          }}
        >
          Book This Transport
        </button>
      </div>
    </div>
  </div>
)}
{selectedActivity && (
  <div
    onClick={() => setSelectedActivity(null)}
    style={{
      position: "fixed",
      inset: 0,
      background: "rgba(0,0,0,0.7)",
      zIndex: 9999,
      display: "flex",
      alignItems: "flex-end",
    }}
  >
    <div
      onClick={(e) => e.stopPropagation()}
      style={{
        width: "100%",
        maxHeight: "90vh",
        overflowY: "auto",
        background: "white",
        borderRadius: "24px 24px 0 0",
      }}
    >
      <img
  src={selectedActivity.image}
  alt={selectedActivity.name}
  style={{
    width: "100%",
    height: 240,
    objectFit: "cover",
  }}
/>
      <div style={{ padding: 24 }}>
        <h2
          style={{
            ...heading,
            fontSize: 24,
            color: T.navy,
          }}
        >
          {selectedActivity.name}
        </h2>

        <p
          style={{
            ...heading,
            color: T.teal,
            marginTop: 10,
          }}
        >
          {selectedActivity.price}
        </p>

        <p
  style={{
    ...body,
    marginTop: 8,
    color: T.slate,
  }}
>
  ⭐ {selectedActivity.rating}
</p>

<p
  style={{
    ...body,
    marginTop: 6,
    color: T.slate,
  }}
>
  Duration: {selectedActivity.duration}
</p>

        <div style={{ marginTop: 20 }}>
          <p
            style={{
              ...heading,
              marginBottom: 10,
            }}
          >
            About this Activity
          </p>

          <p
            style={{
              ...body,
              color: T.slate,
              lineHeight: 1.6,
            }}
          >
            {selectedActivity.description}
          </p>
        </div>

        <div
          style={{
            marginTop: 20,
            display: "flex",
            gap: 10,
            flexWrap: "wrap",
          }}
        >
          <Chip
            color={T.teal}
            bg="rgba(20,184,166,0.08)"
            border="rgba(20,184,166,0.18)"
          >
            📸 Great Photos
          </Chip>

          <Chip
            color={T.teal}
            bg="rgba(20,184,166,0.08)"
            border="rgba(20,184,166,0.18)"
          >
            ⭐ Popular
          </Chip>

          <Chip
            color={T.teal}
            bg="rgba(20,184,166,0.08)"
            border="rgba(20,184,166,0.18)"
          >
            🎟 Easy Booking
          </Chip>
        </div>

        <button
          onClick={() =>
            handleBookActivity(selectedActivity)
          }
          style={{
            width: "100%",
            marginTop: 24,
            padding: 14,
            borderRadius: 14,
            border: "none",
            background: T.navy,
            color: "white",
            cursor: "pointer",
          }}
        >
          Add Activity Expense
        </button>
      </div>
    </div>
  </div>
)}
{confirmationMessage && (
  <div
    style={{
      position: "fixed",
      inset: 0,
      background: "rgba(0,0,0,0.6)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 9999,
    }}
  >
    <div
      style={{
        background: "#fff",
        padding: 24,
        borderRadius: 20,
        width: "90%",
        maxWidth: 400,
        textAlign: "center",
      }}
    >
      <h3>Booking Confirmed 🎉</h3>

      <p style={{ whiteSpace: "pre-line" }}>
        {confirmationMessage}
      </p>

      <button
        onClick={() => setConfirmationMessage(null)}
      >
        Done
      </button>
    </div>
  </div>
)}
    </div>
  );
}
import type { Trip } from "../services/dataService";

export interface HotelRecommendation {
  id: string;
  name: string;
  photos: string[];
  rating: number;
  distance: string;
  pricePerNight: number;
  familyScore: number;
  roomsRequired: number;
  roomType: string;
  sleepingCapacity: number;
  suitable: boolean;
  mattressWarning?: string;
  extraCostRange?: string;
  analysis: string[];
}

export interface TransportRoute {
  id: string;
  from: string;
  to: string;
  taxiCost: string;
  publicTransport: string;
  duration: string;
  convenience: number;
  note: string;
}

export interface RealityReportItem {
  id: string;
  kind: "warning" | "cost" | "recommendation";
  icon: string;
  title: string;
  detail: string;
}

export interface RealityReport {
  items: RealityReportItem[];
  estimatedExtraSpend: string;
}

function totalTravelers(trip: Trip) {
  return trip.adults + trip.children + trip.seniors;
}

function tripNights(trip: Trip) {
  if (!trip.startDate || !trip.endDate) return 3;
  const start = new Date(trip.startDate);
  const end = new Date(trip.endDate);
  const nights = Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  return Math.max(1, nights);
}

function formatRupee(amount: number) {
  return `₹${amount.toLocaleString("en-IN")}`;
}

function analyzeFamilyFit(travelers: number, doubleRooms: number) {
  const capacity = doubleRooms * 2;
  const suitable = travelers <= capacity + 1;
  const mattressesNeeded = Math.max(0, travelers - capacity);
  return {
    capacity,
    suitable,
    mattressesNeeded,
    extraCostRange:
      mattressesNeeded > 0 ? `₹${400 + mattressesNeeded * 100}–₹${700 + mattressesNeeded * 150} per night` : undefined,
    mattressWarning:
      mattressesNeeded > 0
        ? `${mattressesNeeded} guest${mattressesNeeded > 1 ? "s" : ""} may require an additional mattress`
        : undefined,
  };
}

export function getHotelsForTrip(trip: Trip): HotelRecommendation[] {
  const travelers = totalTravelers(trip);
  const dest = trip.destination.split(",")[0].trim();

  const templates = [
    {
      id: "h1",
      name: `${dest} Heritage Stay`,
      photos: ["https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&h=400&fit=crop"],
      rating: 4.6,
      distance: "1.2 km from city center",
      pricePerNight: 4200,
      roomType: "Double Room",
    },
    {
      id: "h2",
      name: `${dest} Family Resort`,
      photos: ["https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&h=400&fit=crop"],
      rating: 4.8,
      distance: "3.5 km from city center",
      pricePerNight: 6800,
      roomType: "Family Suite",
    },
    {
      id: "h3",
      name: `${dest} Budget Inn`,
      photos: ["https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&h=400&fit=crop"],
      rating: 4.2,
      distance: "0.6 km from bus stand",
      pricePerNight: 2400,
      roomType: "Double Room",
    },
  ];

  return templates.map((t, i) => {
    const roomsRequired = t.roomType.includes("Suite") ? 1 : Math.max(1, Math.ceil(travelers / 2));
    const fit = analyzeFamilyFit(travelers, t.roomType.includes("Suite") ? 3 : roomsRequired);
    const familyScore = Math.min(98, Math.round(72 + t.rating * 4 - (fit.mattressesNeeded * 8)));

    return {
      ...t,
      roomsRequired,
      sleepingCapacity: fit.capacity,
      suitable: fit.suitable,
      familyScore,
      mattressWarning: fit.mattressWarning,
      extraCostRange: fit.extraCostRange,
      analysis: [
        `${roomsRequired} × ${t.roomType} recommended for ${travelers} travelers`,
        `Sleeping capacity: ${fit.capacity} standard beds`,
        fit.mattressWarning ?? "All guests fit without extra bedding",
        t.distance.includes("3.5") ? "Resort fee ~₹800/night not always shown upfront" : "Breakfast may cost extra (~₹350/person)",
      ],
      pricePerNight: t.pricePerNight + i * 200,
    };
  });
}

export function getTransportForTrip(trip: Trip): TransportRoute[] {
  const dest = trip.destination.split(",")[0].trim();
  return [
    {
      id: "t1",
      from: "Airport / Railway Station",
      to: `Hotel in ${dest}`,
      taxiCost: "₹450–₹650",
      publicTransport: "Prepaid taxi counter available; limited direct metro",
      duration: "35–55 min",
      convenience: 3,
      note: "Avoid individual touts at arrival. Prepaid counters are safer and fixed-rate.",
    },
    {
      id: "t2",
      from: `Hotel in ${dest}`,
      to: "Main attractions",
      taxiCost: "₹180–₹320",
      publicTransport: "Auto-rickshaw and local buses available",
      duration: "15–30 min",
      convenience: 4,
      note: "Peak hours (5–8 PM) can double travel time near tourist zones.",
    },
    {
      id: "t3",
      from: "Bus Stand",
      to: `Hotel in ${dest}`,
      taxiCost: "₹120–₹200",
      publicTransport: "Shared autos frequent during daytime",
      duration: "10–20 min",
      convenience: 4,
      note: "Late-night arrivals may require taxi only — shared transport stops early.",
    },
    {
      id: "t4",
      from: `Hotel in ${dest}`,
      to: "Airport (return)",
      taxiCost: "₹500–₹750",
      publicTransport: "Airport shuttle limited; taxi recommended with luggage",
      duration: "40–60 min",
      convenience: 3,
      note: "Early morning departures often include ₹50–₹100 surcharge.",
    },
  ];
}

export function getRealityReportForTrip(trip: Trip): RealityReport {
  const travelers = totalTravelers(trip);
  const nights = tripNights(trip);
  const dest = trip.destination.split(",")[0].trim();
  const month = trip.startDate ? new Date(trip.startDate).getMonth() : new Date().getMonth();
  const peakMonths = [10, 11, 0, 1, 4, 5];
  const isPeak = peakMonths.includes(month);

  const items: RealityReportItem[] = [
    {
      id: "r1",
      kind: "warning",
      icon: "⚠️",
      title: isPeak ? "Peak season pricing" : "Shoulder season — better rates",
      detail: isPeak
        ? `${dest} sees 20–35% higher hotel rates in this period. Book early or expect price jumps.`
        : "Rates are relatively stable now, but weekend surcharges may still apply.",
    },
    {
      id: "r2",
      kind: "warning",
      icon: "🛏️",
      title: travelers > 4 ? "Extra mattress may be required" : "Room fit looks comfortable",
      detail:
        travelers > 4
          ? `With ${travelers} travelers, standard double-room combos may leave 1 guest on an extra mattress (₹500–₹800/night).`
          : `Your group of ${travelers} fits standard room configurations without extra bedding.`,
    },
    {
      id: "r3",
      kind: "cost",
      icon: "🚕",
      title: "Taxi costs add up quickly",
      detail: `Airport transfers + daily local taxis for ${nights} nights can reach ₹${(nights * 800 + 600).toLocaleString("en-IN")}–₹${(nights * 1200 + 900).toLocaleString("en-IN")} beyond hotel quotes.`,
    },
    {
      id: "r4",
      kind: "cost",
      icon: "🏨",
      title: "Resort & service fees",
      detail: "Some properties charge resort fees, porter tips, and GST separately — often ₹600–₹1,200/night combined.",
    },
    {
      id: "r5",
      kind: "recommendation",
      icon: "☕",
      title: "Breakfast often not included",
      detail: `Budget ₹350–₹550 per person per day for breakfast near ${dest} tourist areas.`,
    },
    {
      id: "r6",
      kind: "recommendation",
      icon: "📍",
      title: "Stay near city center if walking matters",
      detail: "Properties 3+ km out save money but increase daily transport spend and travel time.",
    },
  ];

  const extraLow = nights * 1200 + (travelers > 4 ? nights * 500 : 0);
  const extraHigh = nights * 2200 + (travelers > 4 ? nights * 800 : 0);

  return {
    items,
    estimatedExtraSpend: `${formatRupee(extraLow)}–${formatRupee(extraHigh)} beyond base hotel quotes`,
  };
}

export function getTripDurationLabel(trip: Trip) {
  const nights = tripNights(trip);
  if (trip.startDate && trip.endDate) {
    return `${nights} night${nights !== 1 ? "s" : ""}`;
  }
  return `${nights} nights (estimated)`;
}

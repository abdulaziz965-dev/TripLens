import { ArrowRight, ChevronLeft } from "lucide-react";
import { T, display, body } from "../theme";

export function CreateTripModeScreen({
  onBack,
  onSelect,
}: {
  onBack: () => void;
  onSelect: (mode: "upcoming" | "dream") => void;
}) {
  const cardStyle = {
    background: "white",
    border: `1px solid ${T.border}`,
    borderRadius: 20,
    padding: 24,
    cursor: "pointer",
    transition: "0.2s",
    boxShadow: "0 6px 20px rgba(0,0,0,0.05)",
  } as React.CSSProperties;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: T.bg,
        padding: 24,
      }}
    >
      <button
        onClick={onBack}
        style={{
          border: "none",
          background: "transparent",
          cursor: "pointer",
          marginBottom: 24,
        }}
      >
        <ChevronLeft />
      </button>

      <h1
        style={{
          ...display,
          color: T.navy,
          fontSize: 30,
          marginBottom: 8,
        }}
      >
        Create a Journey
      </h1>

      <p
        style={{
          ...body,
          color: T.slate,
          marginBottom: 36,
        }}
      >
        Choose how you'd like to plan your next adventure.
      </p>

      <div
        onClick={() => onSelect("upcoming")}
        style={{
          ...cardStyle,
          marginBottom: 20,
        }}
      >
        <div style={{ fontSize: 42 }}>✈️</div>

        <h2 style={{ marginTop: 16 }}>
          Upcoming Trip
        </h2>

        <p style={{ color: T.slate }}>
          Plan a trip you'll be taking soon.
        </p>

        <ArrowRight />
      </div>

      <div
        onClick={() => onSelect("dream")}
        style={cardStyle}
      >
        <div style={{ fontSize: 42 }}>🌍</div>

        <h2 style={{ marginTop: 16 }}>
          Dream Trip
        </h2>

        <p style={{ color: T.slate }}>
          Save now and travel later.
        </p>

        <ArrowRight />
      </div>
    </div>
  );
}
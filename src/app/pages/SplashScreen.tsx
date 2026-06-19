import { useState, useEffect } from "react";
import { T, display, body, IMG } from "../theme";
import { LogoMark } from "../components/SharedComponents";

export function SplashScreen({ onDone }: { onDone: () => void }) {
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

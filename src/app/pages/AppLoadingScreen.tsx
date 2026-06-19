import { AppViewport, LogoMark } from "../components/SharedComponents";
import { heading, body } from "../theme";

export function AppLoadingScreen() {
  return (
    <AppViewport background="#05090f">
      <div style={{ minHeight: "100dvh", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
        <div style={{ textAlign: "center" }}>
          <LogoMark size={74} />
          <p style={{ ...heading, fontSize: 18, color: "white", marginTop: 18 }}>Loading TripLens</p>
          <p style={{ ...body, fontSize: 13, color: "rgba(255,255,255,0.42)", marginTop: 6 }}>Checking your Firebase session…</p>
        </div>
      </div>
    </AppViewport>
  );
}

import { useState, useEffect } from "react";
import { BrowserRouter, Navigate, Route, Routes, useNavigate, useParams } from "react-router-dom";
import { onAuthStateChanged, signOut, type User as FirebaseUser } from "firebase/auth";
import { auth } from "../firebase/config";
import { loginWithGoogle } from "../services/authService";

// Infrastructure
import { T } from "./theme";
import { AppViewport } from "./components/SharedComponents";


// Pages
import { SplashScreen } from "./pages/SplashScreen";
import { LandingScreen } from "./pages/LandingScreen";
import { LoginScreen } from "./pages/LoginScreen";
import { HomeScreen } from "./pages/HomeScreen";
import { CreateTripScreen } from "./pages/CreateTripScreen";
import { TripsScreen } from "./pages/TripsScreen";
import { TripDashboardScreen } from "./pages/TripDashboardScreen";
import { ExpensesScreen } from "./pages/ExpensesScreen";
import { ProfileScreen } from "./pages/ProfileScreen";
import { AppLoadingScreen } from "./pages/AppLoadingScreen";

// ─────────────────────────────────────────────────────────────────────────────
// Route Wrappers (Logic & Auth)
// ─────────────────────────────────────────────────────────────────────────────

function SplashRoute({ ready, user }: { ready: boolean; user: FirebaseUser | null }) {
  const navigate = useNavigate();

  useEffect(() => {
    if (!ready) return;

    if (user) {
      navigate("/home", { replace: true });
      return;
    }

    const timer = window.setTimeout(() => navigate("/landing", { replace: true }), 3400);
    return () => window.clearTimeout(timer);
  }, [navigate, ready, user]);

  if (ready && user) {
    return null;
  }

  return (
    <AppViewport background="#05090f">
      <SplashScreen onDone={() => navigate("/landing", { replace: true })} />
    </AppViewport>
  );
}

function LandingRoute({ ready, user }: { ready: boolean; user: FirebaseUser | null }) {
  const navigate = useNavigate();

  if (ready && user) {
    return <Navigate to="/home" replace />;
  }

  return (
    <AppViewport>
      <LandingScreen onStart={() => navigate("/login")} onSignIn={() => navigate("/login")} />
    </AppViewport>
  );
}

function LoginRoute({ ready, user }: { ready: boolean; user: FirebaseUser | null }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (ready && user && !loading) {
    return <Navigate to="/home" replace />;
  }

  const handleLogin = async () => {
    console.log("[TravelLens][UI] Login button clicked");
    setLoading(true);
    setError(null);

    try {
      const signedInUser = await loginWithGoogle();

      console.log("[TravelLens][UI] User object received", {
        uid: signedInUser.uid,
        email: signedInUser.email,
        displayName: signedInUser.displayName,
        photoURL: signedInUser.photoURL,
      });

      navigate("/home", { replace: true });
    } catch (loginError) {
      if (loginError && typeof loginError === "object") {
        const firebaseError = loginError as {
          code?: string;
          message?: string;
          name?: string;
          customData?: unknown;
        };

        console.error("[TravelLens][UI] Login flow failed", {
          code: firebaseError.code,
          message: firebaseError.message,
          name: firebaseError.name,
          customData: firebaseError.customData,
          raw: loginError,
        });
        setError(firebaseError.message ?? "Google sign-in failed.");
      } else {
        console.error("[TravelLens][UI] Login flow failed", { raw: loginError });
        setError("Google sign-in failed.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppViewport background={T.navy}>
      <LoginScreen onLogin={handleLogin} loading={loading} error={error} />
    </AppViewport>
  );
}

function HomeRoute({ ready, user }: { ready: boolean; user: FirebaseUser | null }) {
  const navigate = useNavigate();

  if (!ready) {
    return <AppLoadingScreen />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <AppViewport>
      <HomeScreen
        user={user}
        onCreateTrip={(loc) => navigate("/create-trip", { state: { location: loc } })}
        onOpenTrip={(tripId) => navigate(`/trip/${tripId}`)}
      />
    </AppViewport>
  );
}


function CreateTripRoute({ ready, user }: { ready: boolean; user: FirebaseUser | null }) {
  const navigate = useNavigate();

  if (!ready) {
    return <AppLoadingScreen />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <AppViewport>
      <CreateTripScreen
        onBack={() => navigate("/home")}
        onDone={(tripId) => navigate(`/trip/${tripId}`, { replace: true })}
      />
    </AppViewport>
  );
}

function TripDashboardRoute({ ready, user }: { ready: boolean; user: FirebaseUser | null }) {
  const navigate = useNavigate();
  const { tripId } = useParams<{ tripId: string }>();

  if (!ready) {
    return <AppLoadingScreen />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!tripId) {
    return <Navigate to="/trips" replace />;
  }

  return (
    <AppViewport>
      <TripDashboardScreen tripId={tripId} onBack={() => navigate("/trips")} />
    </AppViewport>
  );
}

function TripsRoute({ ready, user }: { ready: boolean; user: FirebaseUser | null }) {
  const navigate = useNavigate();

  if (!ready) {
    return <AppLoadingScreen />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <AppViewport>
      <TripsScreen
        onCreateTrip={() => navigate("/create-trip")}
        onSelectTrip={(trip) => navigate(`/trip/${trip.id}`)}
      />
    </AppViewport>
  );
}

function ExpensesRoute({ ready, user }: { ready: boolean; user: FirebaseUser | null }) {
  if (!ready) {
    return <AppLoadingScreen />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <AppViewport>
      <ExpensesScreen />
    </AppViewport>
  );
}

function ProfileRoute({ ready, user }: { ready: boolean; user: FirebaseUser | null }) {
  const navigate = useNavigate();

  if (!ready) {
    return <AppLoadingScreen />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <AppViewport>
      <ProfileScreen user={user} onLogout={async () => { await signOut(auth); navigate("/login", { replace: true }); }} />
    </AppViewport>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main App Component
// ─────────────────────────────────────────────────────────────────────────────

export default function App() {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, user => {

      setCurrentUser(user);
      setAuthReady(true);
    });

    return () => unsubscribe();
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SplashRoute ready={authReady} user={currentUser} />} />
        <Route path="/landing" element={<LandingRoute ready={authReady} user={currentUser} />} />
        <Route path="/login" element={<LoginRoute ready={authReady} user={currentUser} />} />
        <Route path="/home" element={<HomeRoute ready={authReady} user={currentUser} />} />
        <Route path="/create-trip" element={<CreateTripRoute ready={authReady} user={currentUser} />} />
        <Route path="/trip/:tripId" element={<TripDashboardRoute ready={authReady} user={currentUser} />} />
        <Route path="/trips" element={<TripsRoute ready={authReady} user={currentUser} />} />
        <Route path="/expenses" element={<ExpensesRoute ready={authReady} user={currentUser} />} />
        <Route path="/profile" element={<ProfileRoute ready={authReady} user={currentUser} />} />
        <Route path="*" element={<Navigate to="/landing" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

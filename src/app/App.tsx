import { useState, useEffect } from "react";
import { BrowserRouter, Navigate, Route, Routes, useNavigate, useParams } from "react-router-dom";
import { onAuthStateChanged, signOut, type User as FirebaseUser } from "firebase/auth";
import { auth } from "../firebase/config";
import {
  loginWithEmail,
  loginWithGoogle,
  registerWithEmail,
  resetPassword
} from "../services/authService";

// Infrastructure
import { T } from "./theme";
import { AppViewport } from "./components/SharedComponents";
import toast, { Toaster } from "react-hot-toast";

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
import { PaymentMethodsScreen } from "./pages/PaymentMethodsScreen";

import { SettingsScreen } from "./pages/SettingsScreen";
import { TravelerVerificationScreen } from "./pages/TravelerVerificationScreen";
import { EditProfileScreen } from "./pages/EditProfileScreen";


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
const handleEmailLogin = async (
  email: string,
  password: string
) => {
  try {
    setError(null);
    setLoading(true);

    await loginWithEmail(email, password);

    navigate("/home", {
      replace: true,
    });
  } catch (error: any) {
  console.error(error);

  switch (error.code) {
    case "auth/invalid-credential":
      setError("Incorrect email or password.");
      break;

    case "auth/user-not-found":
      setError("No account found with this email.");
      break;

    case "auth/wrong-password":
      setError("Incorrect password.");
      break;

    case "auth/too-many-requests":
      setError(
        "Too many attempts. Try again later."
      );
      break;

    default:
      setError(
        error?.message ??
        "Unable to sign in."
      );
  }
} finally {
    setLoading(false);
  }
};
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
    } catch (error: any) {
  console.error(error);

  switch (error.code) {
    case "auth/invalid-credential":
      setError("Incorrect email or password.");
      break;

    case "auth/user-not-found":
      setError("No account exists with this email.");
      break;

    case "auth/wrong-password":
      setError("Incorrect password.");
      break;

    case "auth/invalid-email":
      setError("Please enter a valid email address.");
      break;

    case "auth/too-many-requests":
      setError(
        "Too many failed login attempts. Please try again later."
      );
      break;

    default:
      setError(
        error?.message ??
        "Unable to sign in."
      );
  }
} finally {
      setLoading(false);
    }
  };
  const handleForgotPassword = async (
  email: string
) => {
  if (!email) {
    setError(
      "Please enter your email address first."
    );
    return;
  }

  try {
    await resetPassword(email);

    toast.success("Password reset email sent.");
  } catch (error: any) {
    setError(
      error?.message ??
      "Failed to send reset email."
    );
  }
};

  const handlePhoneLogin = () => {
    setError(
  "Phone authentication is coming soon."
);
  };

const handleEmailSignup = async (
  name: string,
  email: string,
  password: string
) => {
  
  try {
    setLoading(true);
    setError(null);
    await registerWithEmail(
      name,
      email,
      password
    );

    toast.success(
      "Verification email sent. Please verify your email before signing in."
    );

  } catch (error: any) {
  console.error(error);

  switch (error.code) {
    case "auth/email-already-in-use":
      setError(
        "An account with this email already exists."
      );
      break;

    case "auth/invalid-email":
      setError(
        "Please enter a valid email address."
      );
      break;

    case "auth/weak-password":
      setError(
        "Password is too weak."
      );
      break;

    default:
      setError(
        error?.message ??
        "Failed to create account."
      );
  }
} finally {
    setLoading(false);
  }
};

  return (
    <AppViewport background={T.navy}>
      <LoginScreen
  onLogin={handleLogin}
  onPhoneLogin={handlePhoneLogin}
  onEmailSignup={handleEmailSignup}
  onEmailLogin={handleEmailLogin}
  onForgotPassword={handleForgotPassword}
  loading={loading}
  error={error}
/>
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
  <Toaster
    position="bottom-center"
    toastOptions={{
      duration: 3000,
    }}
  />
      <Routes>
        <Route path="/" element={<SplashRoute ready={authReady} user={currentUser} />} />
        <Route path="/landing" element={<LandingRoute ready={authReady} user={currentUser} />} />
        <Route path="/login" element={<LoginRoute ready={authReady} user={currentUser} />} />
        <Route path="/home" element={<HomeRoute ready={authReady} user={currentUser} />} />
        <Route path="/create-trip" element={<CreateTripRoute ready={authReady} user={currentUser} />} />
        <Route path="/trip/:tripId" element={<TripDashboardRoute ready={authReady} user={currentUser} />} />
        <Route path="/trips" element={<TripsRoute ready={authReady} user={currentUser} />} />
        <Route path="/expenses" element={<ExpensesRoute ready={authReady} user={currentUser} />} />
        <Route path="/settings" element={ <AppViewport> <SettingsScreen /> </AppViewport>}/>
        <Route path="/payments" element={ <AppViewport> <PaymentMethodsScreen /> </AppViewport>}/>
        <Route path="/verification" element={ <AppViewport> <TravelerVerificationScreen />  </AppViewport>}/>
        <Route path="/edit-profile" element={ <AppViewport> <EditProfileScreen /></AppViewport>}/>
        <Route path="/profile" element={<ProfileRoute ready={authReady} user={currentUser} />} />
        <Route path="*" element={<Navigate to="/landing" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

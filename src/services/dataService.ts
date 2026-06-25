import { 
  collection, 
  query, 
  where, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  Timestamp,
  orderBy,
} from "firebase/firestore";
import { db } from "../firebase/config";
import type { Trip } from "../types/trip";
import type { Expense } from "../types/expense";
import type { PlannedActivity } from "@/types/activity";
import { sortByNewest } from "../utils/firestore";
// Types
// ─────────────────────────────────────────────────────────────────────────────

export interface Destination {
  id: string;
  name: string;
  sub: string;
  tag: string;
  temp: string;
  from: string;
  img: string;
  rating: number;
  hrs: string;
}

export interface RealityInsight {
  id: string;
  icon: string;
  text: string;
  type: "warn" | "info";
}





// ─────────────────────────────────────────────────────────────────────────────
// Listeners
// ─────────────────────────────────────────────────────────────────────────────

export const subscribeToDestinations = (callback: (data: Destination[]) => void) => {
  const q = query(collection(db, "destinations"), orderBy("name"));
  return onSnapshot(q, (snapshot) => {
    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Destination));
    callback(data);
  });
};

export const subscribeToInsights = (
  callback: (data: RealityInsight[]) => void
) => {
  const q = collection(db, "insights");

  return onSnapshot(q, (snapshot) => {
    const data = snapshot.docs.map(
      doc => ({ id: doc.id, ...doc.data() } as RealityInsight)
    );

    callback(data);
  });
};

export const subscribeToTrips = (userId: string, callback: (data: Trip[]) => void) => {
  // Simple single-field query — no composite index needed.
  // We sort client-side to avoid requiring a Firestore composite index.
  const q = query(
  collection(db, "trips"),
  where("userId", "==", userId)
);
  return onSnapshot(q, (snapshot) => {
    const data = sortByNewest(
  snapshot.docs.map(
    doc => ({ id: doc.id, ...doc.data() } as Trip)
  )
);
    callback(data);
  }, (error) => {
    console.error("[TripLens] subscribeToTrips error:", error.code, error.message);
    callback([]);
  });
};

export const subscribeToTrip = (tripId: string, callback: (trip: Trip | null) => void) => {
  return onSnapshot(doc(db, "trips", tripId), (snapshot) => {
    if (!snapshot.exists()) {
      callback(null);
      return;
    }
    callback({ id: snapshot.id, ...snapshot.data() } as Trip);
  }, (error) => {
    console.error("[TripLens] subscribeToTrip error:", error.code, error.message);
    callback(null);
  });
};

export const subscribeToTripExpenses = (tripId: string,userId: string, callback: (data: Expense[]) => void) => {
  const q = query(collection(db, "expenses"), where("tripId", "==", tripId),where("userId", "==", userId));
  return onSnapshot(q, (snapshot) => {
    const data = snapshot.docs
      .map(d => ({ id: d.id, ...d.data() } as Expense))
      .sort((a, b) => {
        const aTime = a.createdAt?.toMillis?.() ?? 0;
        const bTime = b.createdAt?.toMillis?.() ?? 0;
        return bTime - aTime;
      });
    callback(data);
  }, (error) => {
    console.error("[TripLens] subscribeToTripExpenses error:", error.code, error.message);
    callback([]);
  });
};
export const subscribeToPlannedActivities = (
  tripId: string,
  userId: string,
  callback: (data: PlannedActivity[]) => void
) => {
  const q = query(
    collection(db, "plannedActivities"),
    where("tripId", "==", tripId),
    where("userId", "==", userId)
  );

  return onSnapshot(q, snapshot => {
    callback(
      snapshot.docs.map(
  doc =>
    ({
      id: doc.id,
      ...doc.data(),
    }) as PlannedActivity
)
    );
  });
};

export const subscribeToExpenses = (userId: string, callback: (data: Expense[]) => void) => {
  const q = query(
    collection(db, "expenses"),
    where("userId", "==", userId)
  );
  return onSnapshot(q, (snapshot) => {
    const data = snapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data() } as Expense))
      .sort((a, b) => {
        const aTime = a.createdAt?.toMillis?.() ?? 0;
        const bTime = b.createdAt?.toMillis?.() ?? 0;
        return bTime - aTime;
      });
    callback(data);
  }, (error) => {
    console.error("[TripLens] subscribeToExpenses error:", error.code, error.message);
    callback([]);
  });
};

// ─────────────────────────────────────────────────────────────────────────────
// Mutations
// ─────────────────────────────────────────────────────────────────────────────

export const createTrip = async (trip: Omit<Trip, "id" | "createdAt">) => {
  const docRef = await addDoc(collection(db, "trips"), {
    ...trip,
    createdAt: Timestamp.now()
  });
  return docRef;
};
export const addPlannedActivity = async (
  data: {
    tripId: string;
    userId: string;
    day: string;
    activityId: string;
    name: string;
    price: string;
  }
) => {
  return addDoc(
    collection(db, "plannedActivities"),
    {
      ...data,
      createdAt: Timestamp.now(),
    }
  );
};

export const addExpense = async (expense: Omit<Expense, "id" | "createdAt">) => {
  return addDoc(collection(db, "expenses"), {
    ...expense,
    createdAt: Timestamp.now()
  });
};

export const updateTrip = async (tripId: string, updates: Partial<Trip>) => {
  const tripRef = doc(db, "trips", tripId);
  return updateDoc(tripRef, updates);
};

export const deleteTrip = async (tripId: string) => {
  return deleteDoc(doc(db, "trips", tripId));
};

export const deleteExpense = async (expenseId: string) => {
  return deleteDoc(doc(db, "expenses", expenseId));
};

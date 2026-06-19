import { useState, useEffect } from "react";
import { 
  subscribeToDestinations, 
  subscribeToInsights, 
  subscribeToTrips, 
  subscribeToTrip,
  subscribeToExpenses,
  subscribeToTripExpenses,
  Destination,
  RealityInsight,
  Trip,
  Expense
} from "../../services/dataService";

export function useDestinations() {
  const [data, setData] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeToDestinations((items) => {
      setData(items);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return { data, loading };
}

export function useInsights() {
  const [data, setData] = useState<RealityInsight[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeToInsights((items) => {
      setData(items);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return { data, loading };
}

export function useTrips(userId: string | undefined) {
  const [data, setData] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setData([]);
      setLoading(false);
      return;
    }

    const unsubscribe = subscribeToTrips(userId, (items) => {
      setData(items);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [userId]);

  return { data, loading };
}

export function useTrip(tripId: string | undefined) {
  const [data, setData] = useState<Trip | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!tripId) {
      setData(null);
      setLoading(false);
      return;
    }

    const unsubscribe = subscribeToTrip(tripId, (trip) => {
      setData(trip);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [tripId]);

  return { data, loading };
}

export function useTripExpenses(tripId: string | undefined, userId: string | undefined) {
  const [data, setData] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!tripId || !userId) {
      setData([]);
      setLoading(false);
      return;
    }

    const unsubscribe = subscribeToTripExpenses(tripId, (items) => {
      setData(items);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [tripId, userId]);

  return { data, loading };
}

export function useExpenses(userId: string | undefined) {
  const [data, setData] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setData([]);
      setLoading(false);
      return;
    }

    const unsubscribe = subscribeToExpenses(userId, (items) => {
      setData(items);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [userId]);

  return { data, loading };
}

import { Timestamp } from "firebase/firestore";
export interface Trip {
  id: string;
  userId: string;
  name: string;
  destination: string;
  startDate: string;
  endDate: string;
  adults: number;
  children: number;
  seniors: number;
  totalTravelers?: number;
  status: "Planning" | "Confirmed" | "Completed";
  progress: number;
  cost: string;
  type: string;
  createdAt: Timestamp;
  savedAt?: Timestamp;
}
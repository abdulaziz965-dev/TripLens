import { Timestamp } from "firebase/firestore";
export type ExpenseType =
  | "hotel"
  | "flight"
  | "train"
  | "bus"
  | "food"
  | "shopping"
  | "activities"
  | "transport"
  | "transfer"
  | "activity"
  | "miscellaneous";

export interface Expense {
  id: string;
  tripId: string;
  userId: string;
  label: string;
  amount: string;
  category: "Confirmed" | "Manual";
  expenseType?: ExpenseType;
  createdAt: Timestamp;
}
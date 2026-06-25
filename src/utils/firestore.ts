import { Timestamp } from "firebase/firestore";

type HasCreatedAt = {
  createdAt?: Timestamp;
};

export function sortByNewest<T extends HasCreatedAt>(
  items: T[]
): T[] {
  return [...items].sort((a, b) => {
    const aTime = a.createdAt?.toMillis() ?? 0;
    const bTime = b.createdAt?.toMillis() ?? 0;

    return bTime - aTime;
  });
}
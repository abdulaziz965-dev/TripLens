export interface Activity {
  id: string;

  name?: string;
  description?: string;
  image: string;
  imageLoading?: boolean;
  price?: string;
  rating?: string | number;
  duration?: string;
  category?: string;

  properties?: {
    name?: string;
    formatted?: string;
    categories?: string[];
  };
}

export interface PlannedActivity {
  id: string;
  tripId: string;
  userId: string;

  day: string;
  activityId: string;
  name: string;
  price: string;
}
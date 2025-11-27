
export type PriceLevel = '1-200' | '200-400' | '400-600' | '600-1500';
export type TravelTime = '5' | '10' | '15' | '20'; // 20 represents 20+

export interface TimeSlot {
  open: string; // Format "HH:mm" e.g., "11:00"
  close: string; // Format "HH:mm" e.g., "14:30"
}

// 0 = Sunday, 1 = Monday, ..., 6 = Saturday
export type WeeklySchedule = {
  [key in 0 | 1 | 2 | 3 | 4 | 5 | 6]?: TimeSlot[];
};

export interface Restaurant {
  id: string;
  name: string;
  emoji: string;
  priceRange: PriceLevel;
  travelTimeMinutes: number; // Raw minutes for calculation
  travelTimeCategory: TravelTime; // For UI matching
  address: string;
  googleMapsUrl: string;
  schedule: WeeklySchedule;
  description?: string;
}

export interface FilterCriteria {
  priceLevels: PriceLevel[];
  maxTravelTime: TravelTime;
  targetDate: Date;
  useCurrentTime: boolean;
}

export interface RestaurantAnalysis {
  positiveReviews: string[];
  negativeReviews: string[];
  atmosphere: string;
  diningAdvice: string; // "Suitable for Dine-in" or "Better for Takeout"
}

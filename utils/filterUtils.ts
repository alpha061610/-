
import { Restaurant, FilterCriteria, WeeklySchedule } from '../types';

/**
 * Checks if a restaurant is open at a specific date/time.
 */
export const isRestaurantOpen = (schedule: WeeklySchedule, targetDate: Date): boolean => {
  const day = targetDate.getDay() as 0 | 1 | 2 | 3 | 4 | 5 | 6;
  const timeSlots = schedule[day];

  if (!timeSlots || timeSlots.length === 0) {
    return false;
  }

  const currentHours = targetDate.getHours();
  const currentMinutes = targetDate.getMinutes();
  const currentTimeVal = currentHours * 60 + currentMinutes;

  return timeSlots.some(slot => {
    const [openH, openM] = slot.open.split(':').map(Number);
    const [closeH, closeM] = slot.close.split(':').map(Number);

    let openTimeVal = openH * 60 + openM;
    let closeTimeVal = closeH * 60 + closeM;

    // Handle times past midnight (e.g., closes at 02:00)
    // If close time is smaller than open time, it means it crosses midnight.
    // However, our logic checks a specific "Date" instance. 
    // For simplicity in this app context:
    // If close time < open time (e.g. 02:00 < 11:00), we treat the slot as spanning across midnight.
    // But accurately comparing "now" against "tomorrow 2am" requires more complex date math.
    // Simplified assumption: 
    // If closeTime < openTime, we assume the restaurant is open until end of day (23:59) OR 
    // check if current time is before closeTime (early morning hours).
    
    if (closeTimeVal < openTimeVal) {
       // Late night logic: Open if (Time >= Open) OR (Time < Close)
       return currentTimeVal >= openTimeVal || currentTimeVal < closeTimeVal;
    }

    return currentTimeVal >= openTimeVal && currentTimeVal < closeTimeVal;
  });
};

/**
 * Main filter function
 */
export const filterRestaurants = (
  allRestaurants: Restaurant[],
  criteria: FilterCriteria
): Restaurant[] => {
  return allRestaurants.filter(r => {
    // 1. Price Check
    // If no price selected, assume all. But UI usually forces selection or has "Any".
    // If criteria.priceLevels is empty, we allow all (safety check).
    const priceMatch = criteria.priceLevels.length === 0 || criteria.priceLevels.includes(r.priceRange);

    // 2. Distance Check (Cumulative)
    // 5 mins includes only <= 5
    // 10 mins includes <= 10
    // 20 mins includes all
    const maxMins = parseInt(criteria.maxTravelTime);
    // Special case: if user selected '20', it implies 20+ (basically everything in our list)
    // Our raw data has `travelTimeMinutes`.
    const distMatch = r.travelTimeMinutes <= maxMins || criteria.maxTravelTime === '20';

    // 3. Opening Hours Check
    const openMatch = isRestaurantOpen(r.schedule, criteria.targetDate);

    return priceMatch && distMatch && openMatch;
  });
};

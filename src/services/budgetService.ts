import type { Activity } from "../models.ts";
import { getTripFromDatabase } from "./dbService.ts";

export const getTotalCostForTrip = async (tripId: string): Promise<number> => {
  try {
    const trip = await getTripFromDatabase(tripId);

    if (!trip) {
      throw new Error(`Could not find a trip with id ${tripId}`);
    }

    return trip.activities.reduce(
      (sum: number, activity) => sum + activity.cost,
      0,
    );
  } catch (error: unknown) {
    throw new Error("Could not calculate the cost", { cause: error });
  }
};

export const getHighCostActivities = async (
  tripId: string,
  threshold: number,
): Promise<Activity[]> => {
  try {
    const trip = await getTripFromDatabase(tripId);

    if (!trip) {
      throw new Error(`Could not find a trip with id ${tripId}`);
    }

    return trip.activities.filter((activity) => activity.cost >= threshold);
  } catch (error: unknown) {
    throw new Error("Could not get high cost activities", { cause: error });
  }
};


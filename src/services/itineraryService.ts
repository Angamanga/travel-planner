import type {
  ActivityCategory,
  CountryInfo,
  Trip,
  Activity,
} from "../models.ts";
import {
  getTripFromDatabase,
  getTripsFromDatabase,
  saveTripToDatabase,
  updateTripInDatabase,
} from "./dbService.ts";

export const createTrip = async (
  destination: CountryInfo,
  startDate: Date,
): Promise<Trip> => {
  try {
    const trip = await saveTripToDatabase(destination, startDate);
    return trip;
  } catch (error: unknown) {
    throw new Error("Could not create trip", { cause: error });
  }
};

export const getTrips = async (): Promise<Trip[]> => {
  try {
    const trips = await getTripsFromDatabase();
    return trips;
  } catch (error: unknown) {
    throw new Error("Could not retrieve trips", { cause: error });
  }
};

export const addActivityToTrip = async (
  tripId: string,
  activity: {
    name: string;
    description: string;
    cost: number;
    category: ActivityCategory;
    startTime: Date;
  },
): Promise<Trip> => {
  try {
    const trip = await getTripFromDatabase(tripId);
    if (!trip) {
      throw new Error(`Trip with id ${tripId} not found`);
    }

    const activities = trip.activities;
    const newActivity = {
      id: String(activities.length + 1),
      name: activity.name,
      cost: activity.cost,
      category: activity.category,
      startTime: activity.startTime,
    };

    const updatedTrip: Trip = {
      ...trip,
      activities: [...trip.activities, newActivity],
    };

    await updateTripInDatabase(updatedTrip);
    return updatedTrip;
  } catch (error: unknown) {
    throw new Error("Could not add activity to trip", { cause: error });
  }
};

export const getActivitiesByDate = async (
  tripId: string,
  date: Date,
): Promise<Activity[]> => {
  try {
    const trip = await getTripFromDatabase(tripId);
    if (!trip) {
      throw new Error("Could not find a trip with that id");
    }
    const selectedDate = new Date(date).toDateString();

    const activities = trip.activities.filter((activity) => {
      const activityDate =
        activity.startTime instanceof Date
          ? activity.startTime
          : new Date(activity.startTime);
      return activityDate.toDateString() === selectedDate;
    });

    return activities;
  } catch (error: unknown) {
    throw new Error("Could find activities at the specific date", {
      cause: error,
    });
  }
};

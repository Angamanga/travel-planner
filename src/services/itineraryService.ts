import type { ActivityCategory, CountryInfo, Trip } from "../models.ts";
import {
    getActivitiesFromDatabase,
    getTripFromDatabase,
    getTripsFromDatabase,
    saveActivityToDatabase,
    saveTripToDatabase,
    updateTripInDatabase,
} from "./dbService.ts";

export const createTrip = async (destination: CountryInfo, startDate: Date): Promise<Trip> => {
    try {
        const trip = await saveTripToDatabase(destination, startDate);
        return trip;
    } catch (error: unknown) {
        throw new Error('Could not create trip', { cause: error });
    }
};

export const getTrips = async (): Promise<Trip[]> => {
    try {
        const trips = await getTripsFromDatabase();
        return trips;
    } catch (error: unknown) {
        throw new Error('Could not retrieve trips', { cause: error });
    }
};

export const addActivityToTrip = async (tripId: string, activity: { name: string; description: string; cost: number; category: ActivityCategory; startTime: Date }): Promise<Trip> => {
    try {
        const trip = await getTripFromDatabase(tripId);
        if (!trip) {
            throw new Error(`Trip with id ${tripId} not found`);
        }

        const activities = await getActivitiesFromDatabase();
        const newActivity = {
            id: String(activities.length + 1),
            name: activity.name,
            cost: activity.cost,
            category: activity.category,
            startTime: activity.startTime
        };

        await saveActivityToDatabase(newActivity);

        const updatedTrip: Trip = {
            ...trip,
            activities: [...trip.activities, newActivity.id]
        };

        await updateTripInDatabase(updatedTrip);
        return updatedTrip;

    } catch (error: unknown) {
        throw new Error('Could not add activity to trip', { cause: error });
    }
};



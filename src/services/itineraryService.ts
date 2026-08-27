import type { CountryInfo, Trip } from "../models.ts";
import { getTripsFromDatabase, saveTripToDatabase } from "./dbService.ts";

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


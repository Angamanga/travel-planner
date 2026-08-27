import { readFile, writeFile } from "fs/promises";
import type { CountryInfo, Trip } from "../models.ts";

const dbFileUrl = new URL("../db.json", import.meta.url);

export const saveTripToDatabase = async (
  destination: CountryInfo,
  startDate: Date,
): Promise<Trip> => {
  try {
    const raw = await readFile(dbFileUrl, "utf8");
    const data = JSON.parse(raw);
    const trips: Trip[] = data.trips;
    const newTrip: Trip = {
      id: String(trips.length + 1),
      destination,
      startDate,
      activities: [],
    };

    trips.push(newTrip);
    data.trips = trips;
    await writeFile(dbFileUrl, JSON.stringify(data, null, 2), "utf8");
    return newTrip;
  } catch (error: unknown) {
    throw new Error("Could not save trip to database", { cause: error });
  }
};

export const getTripsFromDatabase = async (): Promise<Trip[]> => {
  try {
    const raw = await readFile(dbFileUrl, "utf8");
    const data = JSON.parse(raw);
    return data.trips;
  } catch (error: unknown) {
    throw new Error("Could not retrieve trips from database", { cause: error });
  }
};

export const getTripFromDatabase = async (
  tripId: string,
): Promise<Trip | undefined> => {
  try {
    const raw = await readFile(dbFileUrl, "utf8");
    const data = JSON.parse(raw);
    const trips: Trip[] = data.trips;
    return trips.find((trip) => trip.id === tripId);
  } catch (error: unknown) {
    throw new Error("Could not retrieve trip from database", { cause: error });
  }
};

export const updateTripInDatabase = async (
  updatedTrip: Trip,
): Promise<void> => {
  try {
    const raw = await readFile(dbFileUrl, "utf8");
    const data = JSON.parse(raw);
    const trips: Trip[] = data.trips;
    const tripIndex = trips.findIndex((trip) => trip.id === updatedTrip.id);

    if (tripIndex !== -1) {
      trips[tripIndex] = updatedTrip;
      data.trips = trips;

      await writeFile(dbFileUrl, JSON.stringify(data, null, 2), "utf8");
    } else {
      throw new Error(`Trip with id ${updatedTrip.id} not found`);
    }
  } catch (error: unknown) {
    throw new Error("Could not update trip in database", { cause: error });
  }
};

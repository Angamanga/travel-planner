import { readFile, writeFile } from 'fs/promises';
import type { CountryInfo, Trip } from "../models.ts";

const dbFileUrl = new URL('../db.json', import.meta.url);

export async function saveTripToDatabase(destination: CountryInfo, startDate: Date): Promise<Trip> {
    try {
        const raw = await readFile(dbFileUrl, 'utf8');
        const data = JSON.parse(raw);
        const trips: Trip[] = data.trips;
        const newTrip: Trip = {
            id: String(trips.length + 1),
            destination,
            startDate,
            activities: []
        };

        trips.push(newTrip);
        data.trips = trips;
        await writeFile(dbFileUrl, JSON.stringify(data, null, 2), 'utf8');
        return newTrip;

    } catch (error: unknown) {
        throw new Error('Could not save trip to database', { cause: error });
    }
}

export async function getTripsFromDatabase(): Promise<Trip[]> {
    try {
        const raw = await readFile(dbFileUrl, 'utf8');
        const data = JSON.parse(raw);
        return data.trips;
    } catch (error: unknown) {
        throw new Error('Could not retrieve trips from database', { cause: error });
    }
}
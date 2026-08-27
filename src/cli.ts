import { getDestinationInfo } from './services/destinationService.ts';
import { createTrip, getTrips } from './services/itineraryService.ts';
export async function main() {
    const destinationInfo = await getDestinationInfo('Norway');
    console.log('Destination info about Norway fetched successfully');
    console.log(destinationInfo);

     const newTrip = await createTrip(destinationInfo, new Date('2024-07-01'));
     console.log('New trip created successfully');
     console.log(newTrip);

     const allTrips = await getTrips();
     console.log('All trips retrieved successfully');
     console.log(allTrips);
}

main();
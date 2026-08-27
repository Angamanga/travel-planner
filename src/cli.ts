import { getDestinationInfo } from './services/destinationService.ts';
import { addActivityToTrip, createTrip, getTrips } from './services/itineraryService.ts';

const main = async () => {
    const destinationInfo = await getDestinationInfo('Norway');
    console.log('Destination info about Norway fetched successfully');
    console.log(destinationInfo);

     const newTrip = await createTrip(destinationInfo, new Date('2026-10-01'));
     console.log('New trip created successfully');
     console.log(newTrip);

     const allTrips = await getTrips();
     console.log('All trips retrieved successfully');
     console.log(allTrips);

     const tripId = newTrip.id;
     const activity = {
         name: 'Visit the fjords',
         description: 'A very nice and scenic boat tour of the fjords',
         cost: 100,
         category: 'sightseeing' as const,
         startTime: new Date('2026-10-02T10:00:00')
     };

     const updatedTrip = await addActivityToTrip(tripId, activity);
     console.log('Activity added to trip successfully');
     console.log(updatedTrip);
}

main();
import { getDestinationInfo } from "./services/destinationService.ts";
import {
  addActivityToTrip,
  createTrip,
  getActivitiesByCategory,
  getActivitiesByDate,
  getTrips,
} from "./services/itineraryService.ts";
import {
  getHighCostActivities,
  getTotalCostForTrip,
} from "./services/budgetService.ts";

const main = async () => {
  const destinationInfo = await getDestinationInfo("Norway");
  console.log("Destination info about Norway fetched successfully");
  console.log(destinationInfo);

  const newTrip = await createTrip(destinationInfo, new Date("2026-10-01"));
  console.log("New trip created successfully");
  console.log(newTrip);

  const allTrips = await getTrips();
  console.log("All trips retrieved successfully");
  console.log(allTrips);

  const tripId = newTrip.id;
  const activity1 = {
    name: "Visit the fjords",
    description: "A very nice and scenic boat tour of the fjords",
    cost: 100,
    category: "sightseeing" as const,
    startTime: new Date("2026-10-02T10:00:00"),
  };

  let updatedTrip = await addActivityToTrip(tripId, activity1);
  console.log("Activity added to trip successfully");
  console.log(updatedTrip);

  const activity2 = {
    name: "Walk in the mountains",
    description: "A tough walk along the mountain",
    cost: 50,
    category: "sightseeing" as const,
    startTime: new Date("2026-10-05T10:00:00"),
  };

  updatedTrip = await addActivityToTrip(tripId, activity2);
  console.log("Activity added to trip successfully");
  console.log(updatedTrip);

  const activitiesOnDay = await getActivitiesByDate(
    tripId,
    new Date("2026-10-05T10:00:00"),
  );
  console.log("Activities found!");
  console.log(activitiesOnDay);

  const sightseeingActivities = await getActivitiesByCategory(
    tripId,
    "sightseeing",
  );
  console.log("Activities found!");
  console.log(sightseeingActivities);

  const foodActivities = await getActivitiesByCategory(tripId, "food");
  console.log("Activities found!");
  console.log(foodActivities);

  const totalCost = await getTotalCostForTrip(tripId);
  console.log(
    `The total cost for this trip is ${totalCost} ${updatedTrip.destination.currency}`,
  );

  const highCostActivities = await getHighCostActivities(tripId, 90);
  console.log("I found the following high-cost activities:");
  console.log(highCostActivities);
};

main();

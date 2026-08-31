import inquirer from "inquirer";

import { getDestinationInfo } from "./services/destinationService.ts";
import {
  addActivityToTrip,
  createTrip,
  getTrips,
} from "./services/itineraryService.ts";
import {
  getHighCostActivities,
  getTotalCostForTrip,
} from "./services/budgetService.ts";

const mainMenu = async () => {
  let running = true;
  while (running) {
    const answer = await inquirer.prompt([
      {
        type: "rawlist",
        name: "action",
        message: "What would you like to do?",
        choices: [
          "View Trips",
          "Add Trip",
          "Add Activity",
          "View Budget",
          "Exit",
        ],
      },
    ]);

    switch (answer.action) {
      case "View Trips": {
        const trips = await getTrips();
        console.log(trips);
        if (trips.length === 0) {
          console.log("No trips found.");
          break;
        }
        console.log("***These are your upcoming trips:***");
        trips.forEach((trip) => {
          console.log(`Trip ID: ${trip.id}`);
          console.log(`Destination: ${trip.destination.countryName}`);
          console.log(`Flag: ${trip.destination.flag}`);
          console.log(`Currency: ${trip.destination.currency}`);
          console.log(
            `Start Date: ${new Date(trip.startDate).toLocaleDateString()}`,
          );
          console.log(
            `Activities: ${trip.activities.map((a) => a.name).join(", ")}`,
          );
          console.log("-----------------------------");
        });
        break;
      }
      case "Add Trip": {
        const tripInfo: {
          destinationInfo: Awaited<
            ReturnType<typeof getDestinationInfo>
          > | null;
          startDate: string;
        } = { destinationInfo: null, startDate: "" };

        // Fetch destination info with validation
        while (!tripInfo.destinationInfo) {
          const { destination } = await inquirer.prompt([
            {
              type: "input",
              name: "destination",
              message: "Enter the destination name:",
            },
          ]);

          try {
            console.log(`Fetching information for destination: ${destination}`);
            tripInfo.destinationInfo = await getDestinationInfo(destination);
            console.log(
              `Destination Info: ${JSON.stringify(tripInfo.destinationInfo)}`,
            );
          } catch {
            console.error(
              "Error: Invalid destination. Please enter a valid destination.",
            );
          }
        }

        // Fetch start date with validation
        let startDate = "";
        while (!startDate) {
          const { startDate: enteredDate } = await inquirer.prompt([
            {
              type: "input",
              name: "startDate",
              message: "Enter the trip start date (YYYY-MM-DD):",
            },
          ]);

          if (!isNaN(new Date(enteredDate).getTime())) {
            startDate = enteredDate;
            break;
          }

          console.log(
            "Invalid date. Please enter a valid date in YYYY-MM-DD format.",
          );
        }

        tripInfo.startDate = startDate;

        // Create the trip
        const newTrip = await createTrip(
          tripInfo.destinationInfo,
          new Date(tripInfo.startDate),
        );
        console.log("New trip created successfully:", newTrip);
        break;
      }
      case "Add Activity": {
        let tripId = "";
        let tripExists = false;

        while (!tripExists) {
          const { tripId: enteredTripId } = await inquirer.prompt([
            {
              type: "input",
              name: "tripId",
              message: "Enter the trip ID to add an activity to:",
            },
          ]);

          if (!enteredTripId || !enteredTripId.trim()) {
            console.log("Trip ID cannot be empty.");
            continue;
          }

          tripId = enteredTripId.trim();
          const trips = await getTrips();
          tripExists = trips.some((trip) => trip.id === tripId);

          if (!tripExists) {
            console.log(
              `Trip with ID ${tripId} does not exist in the database. Please try again.`,
            );
          }
        }

        let activityName = "";
        while (!activityName) {
          const { name } = await inquirer.prompt([
            {
              type: "input",
              name: "name",
              message: "Enter the activity name:",
            },
          ]);

          if (name && name.trim()) {
            activityName = name.trim();
          } else {
            console.log("Activity name cannot be empty.");
          }
        }

        let description = "";
        while (!description) {
          const { description: enteredDescription } = await inquirer.prompt([
            {
              type: "input",
              name: "description",
              message: "Enter the activity description:",
            },
          ]);

          if (enteredDescription && enteredDescription.trim()) {
            description = enteredDescription.trim();
          } else {
            console.log("Description cannot be empty.");
          }
        }

        let cost = NaN;
        while (!Number.isFinite(cost) || cost < 0) {
          const { cost: enteredCost } = await inquirer.prompt([
            {
              type: "input",
              name: "cost",
              message: "Enter the activity cost:",
            },
          ]);

          const parsedCost = Number(enteredCost);
          if (Number.isFinite(parsedCost) && parsedCost >= 0) {
            cost = parsedCost;
          } else {
            console.log("Please enter a valid non-negative number for cost.");
          }
        }

        const { category } = await inquirer.prompt([
          {
            type: "rawlist",
            name: "category",
            message: "Select the activity category:",
            choices: ["sightseeing", "food", "transport"],
          },
        ]);

        let startTime = "";
        while (!startTime) {
          const { startTime: enteredStartTime } = await inquirer.prompt([
            {
              type: "input",
              name: "startTime",
              message: "Enter the activity start time (YYYY-MM-DDTHH:mm:ss):",
            },
          ]);

          const date = new Date(enteredStartTime);
          if (!isNaN(date.getTime())) {
            startTime = enteredStartTime;
          } else {
            console.log(
              "Please enter a valid date and time in YYYY-MM-DDTHH:mm:ss format.",
            );
          }
        }

        const newActivity = {
          name: activityName,
          description,
          cost,
          category,
          startTime: new Date(startTime),
        };

        const updatedTrip = await addActivityToTrip(tripId, newActivity);
        console.log("Activity added to trip successfully");
        console.log(updatedTrip);
        break;
      }
      case "View Budget": {
        let budgetTripId = "";
        let tripExists = false;

        while (!tripExists) {
          const { tripId: enteredTripId } = await inquirer.prompt([
            {
              type: "input",
              name: "tripId",
              message: "Enter the trip ID to view the budget for:",
            },
          ]);

          if (!enteredTripId || !enteredTripId.trim()) {
            console.log("Trip ID cannot be empty.");
            continue;
          }

          budgetTripId = enteredTripId.trim();
          const trips = await getTrips();
          tripExists = trips.some((trip) => trip.id === budgetTripId);

          if (!tripExists) {
            console.log(
              `Trip with ID ${budgetTripId} does not exist in the database. Please try again.`,
            );
          }
        }

        const budgetChoice = await inquirer.prompt([
          {
            type: "rawlist",
            name: "budgetAction",
            message: "What would you like to view?",
            choices: ["Total cost", "High-cost activities"],
          },
        ]);

        if (budgetChoice.budgetAction === "Total cost") {
          const totalCost = await getTotalCostForTrip(budgetTripId);
          console.log(`The total cost for this trip is ${totalCost}`);
        } else {
          const threshold = await inquirer.prompt([
            {
              type: "number",
              name: "threshold",
              message:
                "Enter the minimum cost to treat an activity as high-cost:",
            },
          ]);
          const highCostActivities = await getHighCostActivities(
            budgetTripId,
            threshold.threshold,
          );
          console.log("High cost activities:");
          console.log(highCostActivities);
        }
        break;
      }
      case "Exit": {
        console.log("Exiting...");
        running = false;
        break;
      }
      default: {
        console.log("Invalid choice");
      }
    }
  }
};

mainMenu();

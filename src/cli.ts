import inquirer from 'inquirer';

import { getDestinationInfo } from "./services/destinationService.ts";
import {
  addActivityToTrip,
  createTrip,
  getTrips
} from "./services/itineraryService.ts";
import {
  getHighCostActivities,
  getTotalCostForTrip,
} from "./services/budgetService.ts";


const mainMenu = async () => {
  let running = true;
  while (running) {
    const answer = await inquirer.prompt([{ 
      type: 'rawlist',
      name: 'action',
      message: 'What would you like to do?',
      choices: ['View Trips', 'Add Trip', 'Add Activity', 'View Budget', 'Exit']
    }]);

    switch(answer.action) {
      case 'View Trips': {
        const trips = await getTrips();
        console.log(trips);
        if(trips.length === 0) {
          console.log("No trips found.");
          break;
        }
        console.log("***These are your upcoming trips:***");
        trips.forEach((trip) => {
          console.log(`Trip ID: ${trip.id}`);
          console.log(`Destination: ${trip.destination.countryName}`);
          console.log(`Flag: ${trip.destination.flag}`);
          console.log(`Currency: ${trip.destination.currency}`);
          console.log(`Start Date: ${new Date(trip.startDate).toLocaleDateString()}`);
          console.log(`Activities: ${trip.activities.map((a) => a.name).join(", ")}`);
          console.log('-----------------------------');          
        });
        break;
      }
      case 'Add Trip': {
        const tripInfo = await inquirer.prompt([
          {
            type: 'input',
            name: 'destination',
            message: 'Enter the destination name:'
          },
          {
            type: 'input',
            name: 'startDate',
            message: 'Enter the trip start date (YYYY-MM-DD):',
            validate: (input) => {
              const date = new Date(input);
              console.log("Validating date input:", input, "Parsed date:", date);
              return !isNaN(date.getTime()) || 'Please enter a valid date in YYYY-MM-DD format';
            } 
          }
        ]);
        const destinationInfo = await getDestinationInfo(tripInfo.destination);
        const newTrip = await createTrip(destinationInfo, new Date(tripInfo.startDate));
        console.log('New trip created successfully');
        console.log(newTrip);
        break;
      }
      case 'Add Activity': {
        const tripId = await inquirer.prompt([{
          type: 'input',
          name: 'tripId',
          message: 'Enter the trip ID to add an activity to:'
        }]);
        const activityDetails = await inquirer.prompt([
          {
            type: 'input',
            name: 'name',
            message: 'Enter the activity name:'
          },
          {
            type: 'input',
            name: 'description',
            message: 'Enter the activity description:'
          },
          {
            type: 'number',
            name: 'cost',
            message: 'Enter the activity cost:'
          },
          {
            type: 'rawlist',
            name: 'category', 
            message: 'Select the activity category:',
            choices: ['sightseeing', 'food', 'transport']
          },
          {
            type: 'input',
            name: 'startTime',
            message: 'Enter the activity start time (YYYY-MM-DDTHH:mm:ss):'
          }
        ]);
        const newActivity = {
          name: activityDetails.name,
          description: activityDetails.description,
          cost: activityDetails.cost,
          category: activityDetails.category,
          startTime: new Date(activityDetails.startTime)
        };
        const updatedTrip = await addActivityToTrip(tripId.tripId, newActivity);
        console.log("Activity added to trip successfully");
        console.log(updatedTrip);
        break;
      }
      case 'View Budget': {
        const budgetTripId = await inquirer.prompt([{
          type: 'input',
          name: 'tripId',
          message: 'Enter the trip ID to view the budget for:'
        }]);

        const budgetChoice = await inquirer.prompt([{
          type: 'rawlist',
          name: 'budgetAction',
          message: 'What would you like to view?',
          choices: ['Total cost', 'High-cost activities']
        }]);

        if (budgetChoice.budgetAction === 'Total cost') {
          const totalCost = await getTotalCostForTrip(budgetTripId.tripId);
          console.log(`The total cost for this trip is ${totalCost}`);
        } else {
          const threshold = await inquirer.prompt([{
            type: 'number',
            name: 'threshold',
            message: 'Enter the minimum cost to treat an activity as high-cost:'
          }]);
          const highCostActivities = await getHighCostActivities(budgetTripId.tripId, threshold.threshold);
          console.log("High cost activities:");
          console.log(highCostActivities);
        }
        break;
      }
      case 'Exit': {
        console.log('Exiting...');
        running = false;
        break;
      }
      default: {
        console.log('Invalid choice');
      }
    }
  }
};

mainMenu();

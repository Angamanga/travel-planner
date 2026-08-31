# travel-planner

## Getting Started

The application uses the REST Countries API. To use it, you need to:

1. Get an API key from [REST Countries](https://restcountries.com/)
2. Create a `.env` file in the project root
3. Add your API key:
   ```
   RESTCOUNTRIES_BEARER=your_api_key_here
   ```

See `.env.example` for the required format.

To start the application, run:
```bash
npm install
npm run dev
```


## User Stories
The application was developed with these userstories in mind:

- As a traveler, I want to create a new trip with a destination and
  start date so that I can begin planning my journey.
- As a traveler, I want to add activities to my trip with details
  like name, cost, category, and time so that I can organize my
  itinerary.
- As a traveler, I want to view all activities for a specific day
  so that I can see my daily schedule.
- As a traveler, I want to calculate the total cost of my trip so
  that I can manage my budget.
- As a traveler, I want to filter activities by category (food,
  transport, sightseeing) so that I can easily find specific types
  of activities.
- As a traveler, I want to get country information (currency, flag)
  for my destination so that I can better prepare for my trip.
- As a traveler, I want to identify high-cost activities that
  exceed a certain threshold so that I can review my expenses.
- As a traveler, I want to view my trip activities sorted
  chronologically so that I can follow my itinerary in order.

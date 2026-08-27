export type ActivityCategory = "food" | "transport" | "sightseeing";

export interface Activity {
  id: string;
  name: string;
  cost: number;
  category: ActivityCategory;
  startTime: Date;
}

export interface Trip {
  id: string;
  destination: CountryInfo;
  startDate: Date;
  activities: Activity[];
}

export interface CountryInfo {
  currency: string;
  flag: string;
}

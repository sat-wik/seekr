export type TravelerType = 
  | 'adventure'
  | 'relaxation'
  | 'culture'
  | 'foodie'
  | 'budget'
  | 'luxury';

export type TravelPreference = {
  type: TravelerType;
  interests: string[];
  budget: {
    min: number;
    max: number;
  };
  duration: {
    minDays: number;
    maxDays: number;
  };
};

export type Location = {
  id: string;
  name: string;
  city: string;
  country: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  priceIndex: number;
  image?: string; // Optional image URL
};

export type Activity = {
  id: string;
  name: string;
  description: string;
  locationId: string;
  price: number;
  category: string;
  rating: number;
};

export type TravelPlan = {
  id: string;
  name: string;
  description: string;
  locations: Location[];
  activities: Activity[];
  preferences: TravelPreference;
  totalPrice: {
    flights: number;
    accommodation: number;
    activities: number;
    total: number;
  };
  createdAt: Date;
  updatedAt: Date;
};
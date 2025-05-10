import { TravelPlan, Location, Activity } from '../types/travel';
import { supabase } from '../services/supabase';

/**
 * Service class for managing travel plans and related operations.
 * Provides methods for creating, retrieving, updating, and calculating prices for travel plans.
 */
export class TravelPlanService {
  /**
   * Creates a new travel plan in the database.
   * @param plan - The travel plan data to create, excluding id and timestamps
   * @returns The created travel plan with id and timestamps
   */
  async createPlan(plan: Omit<TravelPlan, 'id' | 'createdAt' | 'updatedAt'>): Promise<TravelPlan> {
    const { data, error } = await supabase
      .from('travel_plans')
      .insert([plan])
      .select()
      .single();

    if (error) throw error;
    return data as TravelPlan;
  }

  /**
   * Retrieves all travel plans for a specific user.
   * @param userId - The ID of the user to retrieve plans for
   * @returns An array of travel plans
   */
  async getPlans(userId: string): Promise<TravelPlan[]> {
    const { data, error } = await supabase
      .from('travel_plans')
      .select('*')
      .eq('user_id', userId);

    if (error) throw error;
    return data as TravelPlan[];
  }

  /**
   * Retrieves a specific travel plan by its ID.
   * @param planId - The ID of the travel plan to retrieve
   * @returns The travel plan object
   */
  async getPlanById(planId: string): Promise<TravelPlan> {
    const { data, error } = await supabase
      .from('travel_plans')
      .select('*')
      .eq('id', planId)
      .single();

    if (error) throw error;
    return data as TravelPlan;
  }

  /**
   * Updates an existing travel plan with new data.
   * @param planId - The ID of the travel plan to update
   * @param updates - The partial data to update in the plan
   * @returns The updated travel plan
   */
  async updatePlan(planId: string, updates: Partial<TravelPlan>): Promise<TravelPlan> {
    const { data, error } = await supabase
      .from('travel_plans')
      .update(updates)
      .eq('id', planId)
      .select()
      .single();

    if (error) throw error;
    return data as TravelPlan;
  }

  /**
   * Calculates the total price for a travel plan.
   * @param plan - The travel plan to calculate price for
   * @returns The travel plan with calculated price
   */
  async calculatePrice(plan: TravelPlan): Promise<TravelPlan> {
    const totalFlights = plan.locations.reduce((acc, loc) => acc + loc.priceIndex, 0);
    const totalAccommodation = plan.locations.length * 100; // Example calculation
    const totalActivities = plan.activities.reduce((acc, act) => acc + act.price, 0);

    const totalPrice = totalFlights + totalAccommodation + totalActivities;
    
    return {
      ...plan,
      totalPrice: {
        flights: totalFlights,
        accommodation: totalAccommodation,
        activities: totalActivities,
        total: totalPrice
      }
    };
  }

  /**
   * Gets AI-generated activity recommendations for a travel plan.
   * @param plan - The travel plan to get recommendations for
   * @returns An array of recommended activities
   */
  async getAIRecommendations(plan: TravelPlan): Promise<Activity[]> {
    // TODO: Implement AI recommendations
    return [];
  }

  /**
   * Retrieves detailed information about a specific location.
   * @param locationId - The ID of the location to retrieve
   * @returns The location details
   */
  async getLocationDetails(locationId: string): Promise<Location> {
    const { data, error } = await supabase
      .from('locations')
      .select('*')
      .eq('id', locationId)
      .single();

    if (error) throw error;
    return data as Location;
  }
}

// Singleton instance
export const travelPlanService = new TravelPlanService();
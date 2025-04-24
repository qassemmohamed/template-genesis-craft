
import { api } from "./api";

export interface Feature {
  _id: string;
  code: string;
  name: string;
  description: string;
  isActive: boolean;
  icon: string;
  requiredRole: string;
  createdAt: string;
  updatedAt: string;
}

export interface FeatureAssignment {
  userId: string;
  featureCode: string;
}

export const featureApi = {
  // Get all features
  getAllFeatures: async () => {
    try {
      const response = await api.get("/features");
      return response.data;
    } catch (error) {
      console.error("Error getting features:", error);
      throw error;
    }
  },

  // Get features for a specific user
  getUserFeatures: async (userId?: string) => {
    try {
      const url = userId ? `/features/user/${userId}` : "/features/user";
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      console.error("Error getting user features:", error);
      throw error;
    }
  },

  // Create a new feature (admin only)
  createFeature: async (feature: Omit<Feature, "_id" | "createdAt" | "updatedAt">) => {
    try {
      const response = await api.post("/features", feature);
      return response.data;
    } catch (error) {
      console.error("Error creating feature:", error);
      throw error;
    }
  },

  // Update a feature (admin only)
  updateFeature: async (featureId: string, feature: Partial<Feature>) => {
    try {
      const response = await api.put(`/features/${featureId}`, feature);
      return response.data;
    } catch (error) {
      console.error(`Error updating feature ${featureId}:`, error);
      throw error;
    }
  },

  // Delete a feature (admin only)
  deleteFeature: async (featureId: string) => {
    try {
      const response = await api.delete(`/features/${featureId}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting feature ${featureId}:`, error);
      throw error;
    }
  },

  // Assign a feature to a user (admin only)
  assignFeatureToUser: async (assignment: FeatureAssignment) => {
    try {
      const response = await api.post("/features/assign", assignment);
      return response.data;
    } catch (error) {
      console.error("Error assigning feature to user:", error);
      throw error;
    }
  },

  // Remove a feature from a user (admin only)
  removeFeatureFromUser: async (assignment: FeatureAssignment) => {
    try {
      const response = await api.post("/features/remove", assignment);
      return response.data;
    } catch (error) {
      console.error("Error removing feature from user:", error);
      throw error;
    }
  }
};

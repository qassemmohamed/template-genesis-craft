
import { api } from "./api";

export interface ProfileData {
  fullName?: string;
  bio?: string;
  phoneNumber?: string;
  address?: string;
  username?: string;
  email?: string;
}

export interface PasswordChangeData {
  currentPassword: string;
  newPassword: string;
}

export const profileApi = {
  // Get user profile
  getProfile: async () => {
    try {
      const response = await api.get("/profile/me");
      return response.data;
    } catch (error) {
      console.error("Error getting profile:", error);
      throw error;
    }
  },

  // Update user profile
  updateProfile: async (data: ProfileData) => {
    try {
      const response = await api.put("/profile/me", data);
      return response.data;
    } catch (error) {
      console.error("Error updating profile:", error);
      throw error;
    }
  },

  // Change password
  changePassword: async (data: PasswordChangeData) => {
    try {
      const response = await api.post("/profile/change-password", data);
      return response.data;
    } catch (error) {
      console.error("Error changing password:", error);
      throw error;
    }
  },

  // Upload avatar
  uploadAvatar: async (file: File) => {
    try {
      const formData = new FormData();
      formData.append("avatar", file);

      const response = await api.post("/profile/avatar", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error uploading avatar:", error);
      throw error;
    }
  },

  // Check if username exists
  checkUsername: async (username: string) => {
    try {
      const response = await api.get(`/profile/check-username/${username}`);
      return response.data;
    } catch (error) {
      console.error("Error checking username:", error);
      throw error;
    }
  },

  // Request password reset
  requestPasswordReset: async (email: string) => {
    try {
      const response = await api.post("/profile/forgot-password", { email });
      return response.data;
    } catch (error) {
      console.error("Error requesting password reset:", error);
      throw error;
    }
  },

  // Reset password with token
  resetPassword: async (token: string, password: string) => {
    try {
      const response = await api.post("/profile/reset-password", {
        token,
        password,
      });
      return response.data;
    } catch (error) {
      console.error("Error resetting password:", error);
      throw error;
    }
  },
};

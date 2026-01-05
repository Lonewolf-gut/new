import { api } from "@/lib/api";
import type { UserProfile, UserRole } from "@/types/interfaces";
import { create } from "zustand";

interface UserStore {
  user: {
    id: string;
    role: UserRole
    email: string;
    profile: UserProfile;
  } | null;
  loading: boolean;
  error: string | any | null;
  fetchUser: () => Promise<void>;
}

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  loading: false,
  error: null,
  fetchUser: async () => {
    try {
      set({ loading: true, error: null });
      const token = localStorage.getItem("auth_token");
      console.log("fetchUser: Starting fetch, token exists:", !!token);
      const response = await api.profiles.get();
      console.log("fetchUser: Success, response structure:", {
        responseData: response.data,
        hasUser: !!response.data.user,
        responseKeys: Object.keys(response.data)
      });
      
      // Handle both wrapped and unwrapped responses
      const userData = response.data.user || response.data.data?.user || response.data;
      if (!userData || !userData.id) {
        throw new Error("Invalid user data structure in response");
      }
      
      console.log("fetchUser: Setting user data:", userData);
      set({ user: userData, loading: false, error: null });
    } catch (error: any) {
      console.error("fetchUser: ERROR -", {
        message: error?.message,
        status: error?.response?.status,
        statusText: error?.response?.statusText,
        data: error?.response?.data,
        fullError: error
      });
      set({ error: error, loading: false });
      throw error; // Re-throw so callers can handle it
    }
  },
}));

import { useQuery } from "@tanstack/react-query";
import {  useUserStore } from "@/stores/userStore";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import { ROUTES, STORAGE_KEYS } from "@/utils/constants";
import type { UserProfile, UserRole } from "@/types/interfaces";

export function useAuth() {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    fetchUser,
    user: storeUser,
    loading: storeLoading,
    error: storeError,
  } = useUserStore();

  // Check if we have user data and token immediately (before query runs)
  const hasToken = !!localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
  const hasUserInStore = !!storeUser;
  
  // If we have user data from signup, use it immediately - no need to fetch
  // This prevents the loading state when we already have valid data

  const {
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["user"],
    queryFn: async (): Promise<UserProfile | null> => {
      try {
        await fetchUser();
        return useUserStore.getState().user?.profile || null;
      } catch (error: any) {
        console.error("useQuery fetchUser error:", {
          message: error?.message,
          status: error?.response?.status,
          data: error?.response?.data,
          hasToken: !!localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN),
          hasCachedUser: !!useUserStore.getState().user
        });
        // If we have a user in store and a token, don't fail completely
        const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
        const existingUser = useUserStore.getState().user;
        if (token && existingUser) {
          console.log("fetchUser failed but we have cached user, returning cached profile");
          // Return existing profile to maintain authentication state
          return existingUser.profile || null;
        }
        // If it's a 401/403, the token is invalid - clear it
        if (error?.response?.status === 401 || error?.response?.status === 403) {
          console.error("Token is invalid, clearing authentication");
          localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
          useUserStore.setState({ user: null, error: null });
        }
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: false, // Don't retry - if it fails and we have cached data, use that
    refetchOnWindowFocus: false,
    // Only fetch if we have a token AND don't already have user data
    // If we have user data from signup, use it immediately
    enabled: hasToken && !hasUserInStore,
  });

  // Use user from store - this is the source of truth
  // If we have user data from signup, use it immediately
  const currentUser = storeUser;
  
  // If we have user in store, don't show loading from query
  // This prevents infinite loading when we already have user data from signup
  const currentLoading = hasUserInStore ? false : (isLoading || storeLoading);
  
  // If we have user in store, ignore query errors - we have valid cached data
  const currentError = hasUserInStore ? null : (error || storeError);
  
  console.log("useAuth: Current state check", {
    hasUserInStore,
    hasToken,
    storeUser: !!storeUser,
    isLoading,
    storeLoading,
    currentLoading,
    queryEnabled: hasToken && !hasUserInStore
  });

  // User is authenticated if we have a token
  // If we have a token but no user yet, we're still authenticated (user data is being fetched)
  // This allows ProtectedRoute to show loading while fetching user data instead of redirecting
  const isAuthenticated = hasToken;
  
  // Debug logging
  if (typeof window !== 'undefined') {
    console.log("useAuth state:", {
      hasToken,
      hasUserInStore,
      currentUser: !!currentUser,
      isAuthenticated,
      isLoading: currentLoading,
      error: currentError?.message || currentError,
      userRole: currentUser?.role,
      tokenExists: !!localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN)
    });
  }
  
  const logout = () => {
    useUserStore.setState({ user: null, error: null });
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    navigate("/auth");
  };

  // Auto-redirect based on authentication and role
  useEffect(() => {
    if (currentLoading) return;

    const currentPath = location.pathname;
    const isOnPublicRoute = ["/", "/auth", "/about", "/terms","/privacy", "/payment" ,"/contact","/onboarding"].includes(currentPath);

    console.log("useAuth useEffect - redirect check:", {
      currentPath,
      isOnPublicRoute,
      hasToken: !!localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN),
      hasUser: !!currentUser,
      isAuthenticated,
      currentLoading
    });

    // Only redirect if we don't have a user AND don't have a token
    // If we have a token but fetchUser failed, we should still allow access (token might be valid)
    const hasToken = !!localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    if (!currentUser && !hasToken) {
      if (!isOnPublicRoute) {
        console.log("useAuth: Redirecting unauthenticated user to /auth");
        navigate("/auth");
      }
      return;
    }

    // DISABLED: Don't auto-redirect authenticated users from landing page
    // Users should be able to visit the landing page even when logged in
    // Only redirect from /auth if authenticated (they shouldn't see login page when logged in)
    if (isAuthenticated && currentUser && currentPath === "/auth") {
      console.log("useAuth: Redirecting authenticated user away from /auth to dashboard");
      redirectToDashboard(currentUser.role as UserRole);
      return;
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    currentUser,
    isAuthenticated,
    currentError,
    currentLoading,
    location.pathname,
    navigate,
  ]);

  const redirectToDashboard = (role: UserRole) => {
    let dashboardRoute: string | undefined;
    
    if (role === "PATIENT") {
      dashboardRoute = ROUTES.PATIENT.DASHBOARD;
    } else if (role === "DOCTOR") {
      dashboardRoute = ROUTES.DOCTOR.DASHBOARD;
    } else if (role === "HOSPITAL_ADMIN") {
      dashboardRoute = ROUTES.HOSPITAL_ADMIN;
    }
    
    if (dashboardRoute) {
      navigate(dashboardRoute);
    } else {
      console.error(`No dashboard route found for role: ${role}`);
      navigate("/auth");
    }
  };

  return {
    user: currentUser,
    isLoading: currentLoading,
    isError: currentError,
    error: currentError,
    isAuthenticated,
    logout,
    refetch,
    redirectToDashboard,
  };
}

import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router";
import { ProductionErrorBoundary } from "@/shared/components/ProductionErrorBoundary";
import { AppRouter } from "./routes/AppRouter";
import { Toaster } from "./components/ui/sonner";
import { GoogleOAuthProvider } from "@react-oauth/google";

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || "";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error: unknown) => {
        if (
          typeof error === "object" &&
          error !== null &&
          "isAxiosError" in error &&
          (error as any).status !== undefined &&
          ((error as any).status === 401 || (error as any).status === 403)
        ) {
          return false;
        }
        return failureCount < 2;
      },
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
    },
  },
});

const App = () => (
  <ProductionErrorBoundary>
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster
            position="top-right"
            style={{
              fontFamily: "Raleway, sans-serif",
            }} toastOptions={{
              classNames: {
                description: "!text-gray-900 !text-xs"
              }
            }} />
          <BrowserRouter
          >
            <AppRouter />
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </GoogleOAuthProvider>
  </ProductionErrorBoundary>
);

export default App;

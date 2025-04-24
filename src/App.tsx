
import { I18nextProvider } from "react-i18next";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import "../app/css/globals.css";
import "./index.css";
import i18n from "./i18n";
import AppRoutes from "./routes/__routes";
import { AuthProvider } from "./context/AuthContext";
import { Toaster } from "./components/ui/sonner";
import { ScrollToTop } from "./components/ui/ScrollToTop";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <I18nextProvider i18n={i18n}>
          <div className="flex h-max min-h-screen w-full flex-col bg-[var(--background)] text-[var(--foreground)]">
            <div className="flex-1">
              <ScrollToTop />
              <AppRoutes />
              <Toaster
                position="bottom-right"
                toastOptions={{
                  className:
                    "bg-[var(--card)] text-[var(--card-foreground)] border border-[var(--border)]",
                }}
              />
            </div>
          </div>
        </I18nextProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;

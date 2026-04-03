import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { PhoneStep } from "@/components/auth/PhoneStep";
import { CodeStep } from "@/components/auth/CodeStep";
import { ProfileStep } from "@/components/auth/ProfileStep";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

/** Renders the correct screen based on the current auth step. */
function AuthGate() {
  const { step } = useAuth();

  if (step === 'phone') return <PhoneStep />;
  if (step === 'code') return <CodeStep />;
  if (step === 'profile') return <ProfileStep />;

  // step === 'done' — user is authenticated, show the app.
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <AuthGate />
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

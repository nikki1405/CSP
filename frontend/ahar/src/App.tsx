import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./hooks/useAuth";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

// Pages
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import DonorDashboard from "./pages/DonorDashboard";
import NGODashboard from "./pages/NGODashboard";
import PostFood from "./pages/PostFood";
import EditDonation from "./pages/EditDonation";
import ClaimFood from "./pages/ClaimFood";
import MoneyDonation from "./pages/MoneyDonation";
import MoneyReceived from "./pages/MoneyReceived";
import Events from "./pages/Events";
import Resources from "./pages/Resources";
import NotFound from "./pages/NotFound";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import CompleteClaim from "@/pages/CompleteClaim";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <Router>
        <AuthProvider>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/events" element={<Events />} />
            <Route path="/resources" element={<Resources />} />
            <Route path="/money-donation" element={<MoneyDonation />} />
            <Route path="/money-received" element={<MoneyReceived />} />

            {/* Protected routes */}
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              }
            />

            {/* Protected Donor routes */}
            <Route
              path="/donor-dashboard"
              element={
                <ProtectedRoute allowedRoles={["donor"]}>
                  <DonorDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/edit-donation/:id"
              element={
                <ProtectedRoute allowedRoles={["donor"]}>
                  <EditDonation />
                </ProtectedRoute>
              }
            />
            <Route
              path="/post-food"
              element={
                <ProtectedRoute allowedRoles={["donor"]}>
                  <PostFood />
                </ProtectedRoute>
              }
            />

            {/* Protected NGO routes */}
            <Route
              path="/ngo-dashboard"
              element={
                <ProtectedRoute allowedRoles={["ngo"]}>
                  <NGODashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/claim-food"
              element={
                <ProtectedRoute allowedRoles={["ngo"]}>
                  <ClaimFood />
                </ProtectedRoute>
              }
            />
            <Route path="/complete-claim/:donationId" element={<CompleteClaim />} />

            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </Router>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

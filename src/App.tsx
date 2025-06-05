
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/contexts/AuthContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

// Public pages
import Index from "@/pages/Index";
import Login from "@/pages/Login";
import Signup from "@/pages/Signup";
import InviteAccept from "@/pages/InviteAccept";
import NotFound from "@/pages/NotFound";

// Protected pages
import Dashboard from "@/pages/Dashboard";
import WorkOrders from "@/pages/WorkOrders";
import Assets from "@/pages/Assets";
import Inventory from "@/pages/Inventory";
import Procedures from "@/pages/Procedures";
import Organization from "@/pages/Organization";
import TranslationManagement from "@/pages/TranslationManagement";

// Placeholder components for other routes
import { ModulePlaceholder } from "@/components/ModulePlaceholder";

import "./App.css";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <LanguageProvider>
          <Router>
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/invite/:token" element={<InviteAccept />} />
              
              {/* Protected routes */}
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              
              <Route path="/dashboard/work-orders" element={
                <ProtectedRoute>
                  <WorkOrders />
                </ProtectedRoute>
              } />
              
              <Route path="/dashboard/assets" element={
                <ProtectedRoute>
                  <Assets />
                </ProtectedRoute>
              } />
              
              <Route path="/dashboard/inventory" element={
                <ProtectedRoute>
                  <Inventory />
                </ProtectedRoute>
              } />
              
              <Route path="/dashboard/procedures" element={
                <ProtectedRoute>
                  <Procedures />
                </ProtectedRoute>
              } />
              
              <Route path="/dashboard/purchase-orders" element={
                <ProtectedRoute>
                  <ModulePlaceholder 
                    title="Purchase Orders" 
                    description="Manage purchase orders and procurement requests" 
                    icon="💰"
                  />
                </ProtectedRoute>
              } />
              
              <Route path="/dashboard/requests" element={
                <ProtectedRoute>
                  <ModulePlaceholder 
                    title="Requests" 
                    description="Submit and track maintenance requests" 
                    icon="📝"
                  />
                </ProtectedRoute>
              } />
              
              <Route path="/dashboard/meters" element={
                <ProtectedRoute>
                  <ModulePlaceholder 
                    title="Meters" 
                    description="Monitor equipment meters and readings" 
                    icon="📊"
                  />
                </ProtectedRoute>
              } />
              
              <Route path="/dashboard/locations" element={
                <ProtectedRoute>
                  <ModulePlaceholder 
                    title="Locations" 
                    description="Manage facility locations and areas" 
                    icon="📍"
                  />
                </ProtectedRoute>
              } />
              
              <Route path="/dashboard/reporting" element={
                <ProtectedRoute>
                  <ModulePlaceholder 
                    title="Reporting" 
                    description="Generate reports and analytics" 
                    icon="📈"
                  />
                </ProtectedRoute>
              } />
              
              <Route path="/dashboard/messages" element={
                <ProtectedRoute>
                  <ModulePlaceholder 
                    title="Messages" 
                    description="Team communication and notifications" 
                    icon="💬"
                  />
                </ProtectedRoute>
              } />
              
              <Route path="/dashboard/organization" element={
                <ProtectedRoute>
                  <Organization />
                </ProtectedRoute>
              } />
              
              <Route path="/dashboard/translations" element={
                <ProtectedRoute>
                  <TranslationManagement />
                </ProtectedRoute>
              } />

              {/* Catch all route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Toaster />
          </Router>
        </LanguageProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;

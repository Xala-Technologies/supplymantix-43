
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
                    features={[
                      "Create and manage purchase orders",
                      "Vendor management and selection",
                      "Approval workflow automation",
                      "Budget tracking and cost control",
                      "Integration with inventory management"
                    ]}
                  />
                </ProtectedRoute>
              } />
              
              <Route path="/dashboard/requests" element={
                <ProtectedRoute>
                  <ModulePlaceholder 
                    title="Requests" 
                    description="Submit and track maintenance requests" 
                    icon="📝"
                    features={[
                      "Easy request submission form",
                      "Request prioritization system",
                      "Real-time status tracking",
                      "Automatic work order generation",
                      "Mobile-friendly interface"
                    ]}
                  />
                </ProtectedRoute>
              } />
              
              <Route path="/dashboard/meters" element={
                <ProtectedRoute>
                  <ModulePlaceholder 
                    title="Meters" 
                    description="Monitor equipment meters and readings" 
                    icon="📊"
                    features={[
                      "Digital meter reading capture",
                      "Automated reading schedules",
                      "Trend analysis and reporting",
                      "Threshold alerts and notifications",
                      "Historical data visualization"
                    ]}
                  />
                </ProtectedRoute>
              } />
              
              <Route path="/dashboard/locations" element={
                <ProtectedRoute>
                  <ModulePlaceholder 
                    title="Locations" 
                    description="Manage facility locations and areas" 
                    icon="📍"
                    features={[
                      "Hierarchical location structure",
                      "Interactive facility maps",
                      "Asset location tracking",
                      "QR code generation for locations",
                      "Location-based reporting"
                    ]}
                  />
                </ProtectedRoute>
              } />
              
              <Route path="/dashboard/reporting" element={
                <ProtectedRoute>
                  <ModulePlaceholder 
                    title="Reporting" 
                    description="Generate reports and analytics" 
                    icon="📈"
                    features={[
                      "Pre-built report templates",
                      "Custom report builder",
                      "Automated report scheduling",
                      "KPI dashboards and metrics",
                      "Export to multiple formats"
                    ]}
                  />
                </ProtectedRoute>
              } />
              
              <Route path="/dashboard/messages" element={
                <ProtectedRoute>
                  <ModulePlaceholder 
                    title="Messages" 
                    description="Team communication and notifications" 
                    icon="💬"
                    features={[
                      "Real-time team messaging",
                      "Work order collaboration",
                      "File sharing and attachments",
                      "Push notifications",
                      "Message history and search"
                    ]}
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

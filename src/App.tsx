
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
import PurchaseOrders from "@/pages/PurchaseOrders";
import CreatePurchaseOrder from "@/pages/CreatePurchaseOrder";
import Requests from "@/pages/Requests";
import Meters from "@/pages/Meters";
import Locations from "@/pages/Locations";
import Reporting from "@/pages/Reporting";
import Messages from "@/pages/Messages";
import Organization from "@/pages/Organization";
import TranslationManagement from "@/pages/TranslationManagement";

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
                  <PurchaseOrders />
                </ProtectedRoute>
              } />

              <Route path="/dashboard/purchase-orders/new" element={
                <ProtectedRoute>
                  <CreatePurchaseOrder />
                </ProtectedRoute>
              } />
              
              <Route path="/dashboard/requests" element={
                <ProtectedRoute>
                  <Requests />
                </ProtectedRoute>
              } />
              
              <Route path="/dashboard/meters" element={
                <ProtectedRoute>
                  <Meters />
                </ProtectedRoute>
              } />
              
              <Route path="/dashboard/locations" element={
                <ProtectedRoute>
                  <Locations />
                </ProtectedRoute>
              } />
              
              <Route path="/dashboard/reporting" element={
                <ProtectedRoute>
                  <Reporting />
                </ProtectedRoute>
              } />
              
              <Route path="/dashboard/messages" element={
                <ProtectedRoute>
                  <Messages />
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

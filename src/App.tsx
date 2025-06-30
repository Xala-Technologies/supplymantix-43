import React from "react";
import { Toaster } from "sonner";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/react-query";
import ProtectedRoute from "@/components/ProtectedRoute";
import Dashboard from "@/pages/Dashboard";
import WorkOrders from "@/pages/WorkOrders";
import PurchaseOrders from "@/pages/PurchaseOrders";
import Requests from "@/pages/Requests";
import Assets from "@/pages/Assets";
import Inventory from "@/pages/Inventory";
import Procedures from "@/pages/Procedures";
import Meters from "@/pages/Meters";
import Locations from "@/pages/Locations";
import Reporting from "@/pages/Reporting";
import Messages from "@/pages/Messages";
import Organization from "@/pages/Organization";
import Translations from "@/pages/Translations";
import Categories from "@/pages/Categories";

function App() {
  return (
    <div className="min-h-screen bg-background font-sans antialiased">
      <Toaster />
      <BrowserRouter>
        <AuthProvider>
          <LanguageProvider>
            <QueryClientProvider client={queryClient}>
              <Routes>
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
                <Route path="/dashboard/purchase-orders" element={
                  <ProtectedRoute>
                    <PurchaseOrders />
                  </ProtectedRoute>
                } />
                <Route path="/dashboard/requests" element={
                  <ProtectedRoute>
                    <Requests />
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
                <Route path="/dashboard/categories" element={
                  <ProtectedRoute>
                    <Categories />
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
                    <Translations />
                  </ProtectedRoute>
                } />
              </Routes>
            </QueryClientProvider>
          </LanguageProvider>
        </AuthProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;

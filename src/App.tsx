import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/contexts/AuthContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import Index from "@/pages/Index";
import Login from "@/pages/Login";
import Signup from "@/pages/Signup";
import Dashboard from "@/pages/Dashboard";
import WorkOrders from "@/pages/WorkOrders";
import Assets from "@/pages/Assets";
import Inventory from "@/pages/Inventory";
import InventoryEnhanced from "@/pages/InventoryEnhanced";
import Locations from "@/pages/Locations";
import Categories from "@/pages/Categories";
import Procedures from "@/pages/Procedures";
import Organization from "@/pages/Organization";
import Messages from "@/pages/Messages";
import Requests from "@/pages/Requests";
import PurchaseOrders from "@/pages/PurchaseOrders";
import CreatePurchaseOrder from "@/pages/CreatePurchaseOrder";
import PurchaseOrderDetail from "@/pages/PurchaseOrderDetail";
import Reporting from "@/pages/Reporting";
import Meters from "@/pages/Meters";
import TranslationManagement from "@/pages/TranslationManagement";
import InviteAccept from "@/pages/InviteAccept";
import Clients from "@/pages/Clients";
import Vendors from "@/pages/Vendors";
import NotFound from "@/pages/NotFound";

// Create a single query client instance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
      refetchOnWindowFocus: false,
      retry: (failureCount, error) => {
        // Don't retry auth errors
        if (error instanceof Error && error.message.includes('not authenticated')) {
          return false;
        }
        return failureCount < 2;
      },
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <AuthProvider>
          <Router>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/invite/:token" element={<InviteAccept />} />
              
              {/* Protected dashboard routes */}
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
              <Route path="/dashboard/inventory-enhanced" element={
                <ProtectedRoute>
                  <InventoryEnhanced />
                </ProtectedRoute>
              } />
              <Route path="/dashboard/locations" element={
                <ProtectedRoute>
                  <Locations />
                </ProtectedRoute>
              } />
              <Route path="/dashboard/categories" element={
                <ProtectedRoute>
                  <Categories />
                </ProtectedRoute>
              } />
              <Route path="/dashboard/procedures" element={
                <ProtectedRoute>
                  <Procedures />
                </ProtectedRoute>
              } />
              <Route path="/dashboard/organization" element={
                <ProtectedRoute>
                  <Organization />
                </ProtectedRoute>
              } />
              <Route path="/dashboard/messages" element={
                <ProtectedRoute>
                  <Messages />
                </ProtectedRoute>
              } />
              <Route path="/dashboard/requests" element={
                <ProtectedRoute>
                  <Requests />
                </ProtectedRoute>
              } />
              <Route path="/dashboard/purchase-orders" element={
                <ProtectedRoute>
                  <PurchaseOrders />
                </ProtectedRoute>
              } />
              <Route path="/dashboard/purchase-orders/create" element={
                <ProtectedRoute>
                  <CreatePurchaseOrder />
                </ProtectedRoute>
              } />
              <Route path="/dashboard/purchase-orders/:id" element={
                <ProtectedRoute>
                  <PurchaseOrderDetail />
                </ProtectedRoute>
              } />
              <Route path="/dashboard/reporting" element={
                <ProtectedRoute>
                  <Reporting />
                </ProtectedRoute>
              } />
              <Route path="/dashboard/meters" element={
                <ProtectedRoute>
                  <Meters />
                </ProtectedRoute>
              } />
              <Route path="/dashboard/translations" element={
                <ProtectedRoute>
                  <TranslationManagement />
                </ProtectedRoute>
              } />
              
              <Route path="/dashboard/clients" element={
                <ProtectedRoute>
                  <Clients />
                </ProtectedRoute>
              } />
              <Route path="/dashboard/vendors" element={
                <ProtectedRoute>
                  <Vendors />
                </ProtectedRoute>
              } />
              
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Toaster />
          </Router>
        </AuthProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
}

export default App;

// Application routing with license-aware navigation
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import { ProtectedRoute } from '@features/auth/components/ProtectedRoute';
import { DashboardLayout } from '@layouts/DashboardLayout';

// Pages - only composition, no logic
import { DashboardPage } from '@pages/DashboardPage';
import { WorkOrdersPage } from '@pages/WorkOrdersPage';
import { AssetsPage } from '@pages/AssetsPage';
import { InventoryPage } from '@pages/InventoryPage';
import { MaintenancePage } from '@pages/MaintenancePage';
import { LoginPage } from '@pages/LoginPage';
import { NotFoundPage } from '@pages/NotFoundPage';

export const AppRouter: React.FC = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<LoginPage />} />
      
      {/* Protected routes with layout */}
      <Route path="/" element={<ProtectedRoute><Navigate to="/dashboard" replace /></ProtectedRoute>} />
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <DashboardLayout>
            <DashboardPage />
          </DashboardLayout>
        </ProtectedRoute>
      } />
      
      {/* Feature routes */}
      <Route path="/work-orders" element={
        <ProtectedRoute>
          <DashboardLayout>
            <WorkOrdersPage />
          </DashboardLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/assets" element={
        <ProtectedRoute>
          <DashboardLayout>
            <AssetsPage />
          </DashboardLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/inventory" element={
        <ProtectedRoute>
          <DashboardLayout>
            <InventoryPage />
          </DashboardLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/maintenance" element={
        <ProtectedRoute>
          <DashboardLayout>
            <MaintenancePage />
          </DashboardLayout>
        </ProtectedRoute>
      } />
      
      {/* Catch all */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};
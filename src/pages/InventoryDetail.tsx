import { DashboardLayout } from "@/components/Layout/DashboardLayout";
import { StandardPageLayout, StandardPageContent } from "@/components/Layout/StandardPageLayout";
import { InventoryDetailCard } from "@/components/inventory/InventoryDetailCard";
import { AdvancedPartForm } from "@/components/inventory/AdvancedPartForm";
import { useParams, useNavigate } from "react-router-dom";
import { useInventoryEnhanced } from '@/hooks/useInventoryEnhanced';
import { Button } from '@/components/ui/button';
import React, { useState } from 'react';

export default function InventoryDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, isLoading, error, refetch } = useInventoryEnhanced({});
  const item = data?.items.find((i) => i.id === id);
  const [editMode, setEditMode] = useState(false);

  // Map InventoryItemWithStats to InventoryDetailCard expected props
  const mapToInventoryItem = (item) => ({
    id: item.id,
    name: item.name,
    sku: item.sku,
    description: item.description,
    category: item.location || 'General',
    quantity: item.quantity,
    minQuantity: item.min_quantity,
    unitCost: item.unit_cost,
    totalValue: item.total_value,
    location: item.location,
    supplier: 'N/A',
    partNumber: 'N/A',
    lastOrdered: 'N/A',
    leadTime: 'N/A',
    reorderPoint: item.min_quantity,
    maxStock: item.min_quantity * 3,
    transactions: [],
    status: item.is_low_stock ? 'low_stock' : item.quantity === 0 ? 'out_of_stock' : 'in_stock',
    qr_code: item.qr_code || '',
    barcode: item.barcode || '',
    picture_url: item.picture_url || '',
    assets: item.assets || [],
    teams: item.teams || [],
    vendor: item.vendor_id || '',
    part_type: item.part_type || '',
    area: item.area || '',
    documents: item.documents || [],
  });

  return (
    <DashboardLayout>
      <StandardPageLayout>
        <StandardPageContent>
          <Button variant="outline" onClick={() => navigate('/dashboard/inventory')} className="mb-4">Back to Inventory</Button>
          {item ? (
            editMode ? (
              <AdvancedPartForm part={item} onSuccess={() => { setEditMode(false); refetch(); }} />
            ) : (
              <>
                <div className="flex justify-end mb-4">
                  <Button onClick={() => setEditMode(true)} variant="default">Edit</Button>
                </div>
                <InventoryDetailCard item={mapToInventoryItem(item)} />
              </>
            )
          ) : isLoading ? (
            <div>Loading...</div>
          ) : error ? (
            <div>Error loading part details.</div>
          ) : (
            <div>Part not found.</div>
          )}
        </StandardPageContent>
      </StandardPageLayout>
    </DashboardLayout>
  );
} 
import { DashboardLayout } from "@/components/Layout/DashboardLayout";
import { StandardPageLayout, StandardPageContent } from "@/components/Layout/StandardPageLayout";
import { AdvancedPartForm } from "@/components/inventory/AdvancedPartForm";
import { useNavigate } from "react-router-dom";

export default function InventoryNew() {
  const navigate = useNavigate();
  return (
    <DashboardLayout>
      <StandardPageLayout>
        <StandardPageContent>
          <AdvancedPartForm 
            onSuccess={() => navigate('/dashboard/inventory')}
          />
        </StandardPageContent>
      </StandardPageLayout>
    </DashboardLayout>
  );
} 
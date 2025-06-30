
import { useState, useEffect } from "react";
import { useOrganizations, useUpdateOrganization } from "./useOrganizations";
import { toast } from "sonner";

export const useOrganizationSettingsForm = (organizationId: string) => {
  const { data: organizations, isLoading: organizationsLoading } = useOrganizations();
  const updateOrganizationMutation = useUpdateOrganization();
  
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    website: "",
    contact_email: "",
    contact_phone: "",
    contact_fax: "",
    default_language: "en",
  });

  const currentOrganization = Array.isArray(organizations) 
    ? organizations.find((org: any) => org.id === organizationId)
    : null;

  useEffect(() => {
    if (currentOrganization) {
      setFormData({
        name: currentOrganization.name || "",
        address: currentOrganization.address || "",
        website: currentOrganization.website || "",
        contact_email: currentOrganization.contact_email || "",
        contact_phone: currentOrganization.contact_phone || "",
        contact_fax: currentOrganization.contact_fax || "",
        default_language: currentOrganization.default_language || "en",
      });
    }
  }, [currentOrganization]);

  const handleSave = async () => {
    if (!currentOrganization) {
      toast.error("Organization not found");
      return;
    }

    try {
      await updateOrganizationMutation.mutateAsync({
        id: organizationId,
        updates: formData
      });
      toast.success("Organization settings updated successfully");
    } catch (error) {
      console.error("Failed to update organization:", error);
      toast.error("Failed to update organization settings");
    }
  };

  return { 
    formData, 
    setFormData, 
    handleSave,
    currentOrganization,
    isLoading: organizationsLoading || updateOrganizationMutation.isPending
  };
};

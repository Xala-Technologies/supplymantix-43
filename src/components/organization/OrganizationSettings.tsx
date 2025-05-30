
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useOrganizationSettingsForm } from "@/hooks/useOrganizationSettingsForm";
import { OrganizationBasicInfo } from "./OrganizationBasicInfo";
import { OrganizationContactInfo } from "./OrganizationContactInfo";
import { OrganizationLanguageSettings } from "./OrganizationLanguageSettings";
import { Save, Loader2 } from "lucide-react";

interface OrganizationSettingsProps {
  organizationId: string;
}

export const OrganizationSettings = ({ organizationId }: OrganizationSettingsProps) => {
  const {
    formData,
    setFormData,
    handleSave,
    currentOrganization,
    isLoading,
  } = useOrganizationSettingsForm(organizationId);

  if (!currentOrganization) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center space-x-2 text-muted-foreground">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span className="text-lg">Loading organization settings...</span>
        </div>
      </div>
    );
  }

  const updateFormData = (updates: Partial<typeof formData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  return (
    <div className="w-full p-6 space-y-6">
      <Card className="shadow-sm border-0 bg-gray-50/30">
        <CardHeader className="pb-4 text-left">
          <CardTitle className="text-lg font-medium text-gray-900 text-left">
            Basic Information
          </CardTitle>
          <p className="text-sm text-muted-foreground text-left">
            Update your organization's core details and public information
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <OrganizationBasicInfo
            formData={{
              name: formData.name,
              website: formData.website,
              address: formData.address,
            }}
            onFormDataChange={updateFormData}
          />
        </CardContent>
      </Card>

      <Card className="shadow-sm border-0 bg-gray-50/30">
        <CardHeader className="pb-4 text-left">
          <CardTitle className="text-lg font-medium text-gray-900 text-left">
            Contact Information
          </CardTitle>
          <p className="text-sm text-muted-foreground text-left">
            Provide contact details for your organization
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <OrganizationContactInfo
            formData={{
              email: formData.email,
              phone: formData.phone,
              fax: formData.fax,
            }}
            onFormDataChange={updateFormData}
          />
        </CardContent>
      </Card>

      <Card className="shadow-sm border-0 bg-gray-50/30">
        <CardHeader className="pb-4 text-left">
          <CardTitle className="text-lg font-medium text-gray-900 text-left">
            Language & Localization
          </CardTitle>
          <p className="text-sm text-muted-foreground text-left">
            Set your organization's default language and regional preferences
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <OrganizationLanguageSettings
            defaultLanguage={formData.defaultLanguage}
            onLanguageChange={(language) => updateFormData({ defaultLanguage: language })}
          />
        </CardContent>
      </Card>

      <div className="flex items-center justify-between pt-6 border-t bg-gray-50/50 -mx-6 px-6 py-4 rounded-b-lg">
        <div className="text-sm text-muted-foreground">
          Changes will be saved immediately and applied to all organization members.
        </div>
        <Button 
          onClick={handleSave} 
          disabled={isLoading}
          className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm min-w-[120px]"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

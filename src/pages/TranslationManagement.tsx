import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { translations } from "@/lib/translations";
import { Language, TranslationKeys } from "@/types/i18n";
import { toast } from "sonner";
import { DashboardLayout } from "@/components/Layout/DashboardLayout";
import { TranslationFilters } from "@/components/translations/TranslationFilters";
import { TranslationList } from "@/components/translations/TranslationList";

const TranslationManagement = () => {
  const { t, language, updateTranslation } = useLanguage();
  const [selectedLanguage, setSelectedLanguage] = useState<Language>(language);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [currentTranslations, setCurrentTranslations] = useState(translations[selectedLanguage]);

  useEffect(() => {
    // Load custom translations from localStorage if they exist
    const customTranslations = localStorage.getItem(`translations_${selectedLanguage}`);
    if (customTranslations) {
      try {
        const parsed = JSON.parse(customTranslations);
        setCurrentTranslations({ ...translations[selectedLanguage], ...parsed });
      } catch (error) {
        console.error('Failed to parse custom translations:', error);
        setCurrentTranslations(translations[selectedLanguage]);
      }
    } else {
      setCurrentTranslations(translations[selectedLanguage]);
    }
  }, [selectedLanguage]);

  const filteredTranslations = Object.entries(currentTranslations)
    .filter(([key, value]) => {
      const stringValue = String(value);
      const matchesSearch = key.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          stringValue.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = categoryFilter === "all" || key.startsWith(categoryFilter + ".");
      return matchesSearch && matchesCategory;
    })
    .map(([key, value]) => [key, String(value)] as [string, string]);

  const handleSave = (editingKey: string, editValue: string) => {
    // Update the current translations state
    const updatedTranslations = {
      ...currentTranslations,
      [editingKey]: editValue
    };
    setCurrentTranslations(updatedTranslations);

    // Save custom translations to localStorage
    const existingCustom = localStorage.getItem(`translations_${selectedLanguage}`);
    let customTranslations = {};
    if (existingCustom) {
      try {
        customTranslations = JSON.parse(existingCustom);
      } catch (error) {
        console.error('Failed to parse existing custom translations:', error);
      }
    }

    const newCustomTranslations = {
      ...customTranslations,
      [editingKey]: editValue
    };

    localStorage.setItem(`translations_${selectedLanguage}`, JSON.stringify(newCustomTranslations));

    // Update the language context if we're editing the current language
    if (selectedLanguage === language && updateTranslation) {
      updateTranslation(editingKey as keyof TranslationKeys, editValue);
    }

    toast.success(t('admin.translations.updated'));
  };

  const exportTranslations = () => {
    const data = JSON.stringify(currentTranslations, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `translations-${selectedLanguage}.json`;
    a.click();
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">{t('admin.translations.title')}</h1>
          <p className="text-gray-600 mt-2">{t('admin.translations.subtitle')}</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{t('admin.translations')}</CardTitle>
            <CardDescription>
              Manage and customize translations for your application
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <TranslationFilters
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              selectedLanguage={selectedLanguage}
              setSelectedLanguage={setSelectedLanguage}
              categoryFilter={categoryFilter}
              setCategoryFilter={setCategoryFilter}
              onExport={exportTranslations}
            />

            <TranslationList
              filteredTranslations={filteredTranslations}
              onSave={handleSave}
            />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default TranslationManagement;

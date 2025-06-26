
import React from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { ArrowLeft, Eye } from 'lucide-react';

interface ProcedureBuilderHeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  scoringEnabled: boolean;
  setScoringEnabled: (enabled: boolean) => void;
  onCancel: () => void;
  onPreview: () => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
  hasTitle: boolean;
}

export const ProcedureBuilderHeader: React.FC<ProcedureBuilderHeaderProps> = ({
  activeTab,
  setActiveTab,
  scoringEnabled,
  setScoringEnabled,
  onCancel,
  onPreview,
  onSubmit,
  isLoading,
  hasTitle
}) => {
  const handleContinue = () => {
    if (activeTab === 'fields') {
      setActiveTab('settings');
    } else {
      onSubmit(new Event('submit') as any);
    }
  };

  return (
    <div className="bg-white border-b border-gray-200">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={onCancel} className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
          </div>
          
          <div className="flex items-center gap-6">
            {/* Tabs Navigation */}
            <nav className="flex space-x-8">
              <button
                onClick={() => setActiveTab('fields')}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'fields'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Procedure Fields
              </button>
              <button
                onClick={() => setActiveTab('settings')}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'settings'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Settings
              </button>
            </nav>
            
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Label className="text-sm text-gray-500">Scoring</Label>
                <Switch
                  checked={scoringEnabled}
                  onCheckedChange={setScoringEnabled}
                />
              </div>
              
              <Button 
                variant="outline" 
                onClick={onPreview}
                className="gap-2"
                disabled={!hasTitle}
              >
                <Eye className="h-4 w-4" />
                Preview
              </Button>
              
              <Button 
                onClick={handleContinue} 
                disabled={isLoading || !hasTitle}
                className="bg-blue-600 hover:bg-blue-700 gap-2"
              >
                {isLoading ? 'Saving...' : activeTab === 'settings' ? 'Save Template' : 'Continue'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

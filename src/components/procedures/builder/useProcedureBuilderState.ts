
import { useState } from 'react';
import { ProcedureField } from '@/lib/database/procedures-enhanced';

interface ProcedureData {
  title: string;
  description: string;
  category: string;
  tags: string[];
  is_global: boolean;
  fields: ProcedureField[];
}

interface UseProcedureBuilderStateProps {
  initialData?: {
    id?: string;
    title: string;
    description: string;
    category: string;
    tags: string[];
    is_global: boolean;
    fields: ProcedureField[];
  };
}

export const useProcedureBuilderState = ({ initialData }: UseProcedureBuilderStateProps = {}) => {
  const [activeTab, setActiveTab] = useState('fields');
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [scoringEnabled, setScoringEnabled] = useState(false);
  const [selectedFieldIndex, setSelectedFieldIndex] = useState<number | null>(null);
  const [formData, setFormData] = useState<ProcedureData>({
    title: initialData?.title || 'Fire Extinguisher Inspection',
    description: initialData?.description || 'Routine fire extinguisher inspection form to ensure operability.',
    category: initialData?.category || 'Inspection',
    tags: initialData?.tags || [],
    is_global: initialData?.is_global || false,
    fields: initialData?.fields || [{
      id: '1',
      procedure_id: '',
      label: 'Confirm the extinguisher is visible, unobstructed, and in its designated location.',
      field_type: 'checkbox' as const,
      is_required: false,
      order_index: 0,
      options: {},
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }, {
      id: '2',
      procedure_id: '',
      label: 'Examine the extinguisher for obvious physical damage, corrosion, leakage, or clogged nozzle.',
      field_type: 'checkbox' as const,
      is_required: false,
      order_index: 1,
      options: {},
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }, {
      id: '3',
      procedure_id: '',
      label: 'Make sure the operating instructions on the nameplate are legible and facing outward.',
      field_type: 'checkbox' as const,
      is_required: false,
      order_index: 2,
      options: {},
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }, {
      id: '4',
      procedure_id: '',
      label: 'Confirm the pressure gauge is in the operable range.',
      field_type: 'checkbox' as const,
      is_required: false,
      order_index: 3,
      options: {},
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }, {
      id: '5',
      procedure_id: '',
      label: 'Lift the fire extinguisher to ensure that it is full.',
      field_type: 'checkbox' as const,
      is_required: false,
      order_index: 4,
      options: {},
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }, {
      id: '6',
      procedure_id: '',
      label: 'Verify the locking pin is intact and the tamper seal is unbroken.',
      field_type: 'checkbox' as const,
      is_required: false,
      order_index: 5,
      options: {},
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }]
  });

  return {
    activeTab,
    setActiveTab,
    isPreviewMode,
    setIsPreviewMode,
    scoringEnabled,
    setScoringEnabled,
    selectedFieldIndex,
    setSelectedFieldIndex,
    formData,
    setFormData
  };
};

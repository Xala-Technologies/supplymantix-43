
import { useEffect } from 'react';
import { useCreateCategory } from './useCategories';

const predefinedCategories = [
  { name: 'Inspection', description: 'Inspection-related procedures and tasks' },
  { name: 'Safety', description: 'Safety protocols and procedures' },
  { name: 'Calibration', description: 'Equipment calibration procedures' },
  { name: 'Reactive Maintenance', description: 'Reactive maintenance and repair tasks' },
  { name: 'Preventive Maintenance', description: 'Preventive maintenance procedures' },
  { name: 'Quality Control', description: 'Quality control and assurance procedures' },
  { name: 'Training', description: 'Training materials and procedures' },
];

export const usePredefinedCategories = () => {
  const createCategory = useCreateCategory();

  useEffect(() => {
    // Create predefined categories one by one
    predefinedCategories.forEach((category) => {
      createCategory.mutate(category);
    });
  }, []);

  return { isCreating: createCategory.isPending };
};

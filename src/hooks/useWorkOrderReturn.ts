import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface WorkOrderReturnData {
  formData: any;
  searchValue: string;
  fieldType: 'asset' | 'parts' | 'categories' | 'vendors';
}

export const useWorkOrderReturn = () => {
  const navigate = useNavigate();
  const [returnData, setReturnData] = useState<WorkOrderReturnData | null>(null);

  useEffect(() => {
    const storedData = localStorage.getItem('workOrderReturnData');
    if (storedData) {
      try {
        const data = JSON.parse(storedData);
        setReturnData(data);
      } catch (error) {
        console.error('Error parsing work order return data:', error);
        localStorage.removeItem('workOrderReturnData');
      }
    }
  }, []);

  const returnToWorkOrder = (newItemId?: string) => {
    // Clear the stored data
    localStorage.removeItem('workOrderReturnData');
    
    // Navigate back to work orders and trigger the new work order dialog
    navigate('/dashboard/work-orders', { 
      state: { 
        openNewWorkOrder: true,
        returnData: returnData,
        newItemId: newItemId
      }
    });
  };

  const clearReturnData = () => {
    localStorage.removeItem('workOrderReturnData');
    setReturnData(null);
  };

  return {
    returnData,
    returnToWorkOrder,
    clearReturnData
  };
};
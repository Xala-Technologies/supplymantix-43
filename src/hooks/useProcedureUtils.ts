
export const useProcedureUtils = () => {
  const categories = [
    "Inspection",
    "Safety", 
    "Calibration",
    "Reactive Maintenance",
    "Preventive Maintenance",
    "Quality Control",
    "Training",
    "Other"
  ];

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      "Inspection": "bg-blue-100 text-blue-700",
      "Safety": "bg-green-100 text-green-700", 
      "Calibration": "bg-purple-100 text-purple-700",
      "Reactive Maintenance": "bg-red-100 text-red-700",
      "Preventive Maintenance": "bg-orange-100 text-orange-700",
      "Quality Control": "bg-indigo-100 text-indigo-700",
      "Training": "bg-yellow-100 text-yellow-700",
      "Other": "bg-gray-100 text-gray-700"
    };
    return colors[category] || "bg-gray-100 text-gray-700";
  };

  const canExecuteProcedure = (procedure: any, executingProcedures?: Set<string>): { canExecute: boolean; reason?: string } => {
    if (!procedure.fields || procedure.fields.length === 0) {
      return { canExecute: false, reason: "No fields configured" };
    }
    if (executingProcedures && executingProcedures.has(procedure.id)) {
      return { canExecute: false, reason: "Currently executing" };
    }
    return { canExecute: true };
  };

  const formatAnswerValue = (answer: any): string => {
    if (answer.value === null || answer.value === undefined || answer.value === '') {
      return 'Not answered';
    }
    
    switch (answer.fieldType) {
      case 'checkbox':
        return answer.value ? 'Yes' : 'No';
      case 'multiselect':
        return Array.isArray(answer.value) ? answer.value.join(', ') : answer.value;
      case 'file':
        return typeof answer.value === 'object' ? answer.value.name || 'File uploaded' : answer.value;
      case 'date':
        return new Date(answer.value).toLocaleDateString();
      default:
        return String(answer.value);
    }
  };

  return {
    categories,
    getCategoryColor,
    canExecuteProcedure,
    formatAnswerValue
  };
};

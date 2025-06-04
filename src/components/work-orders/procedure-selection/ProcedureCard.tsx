
import { Badge } from "@/components/ui/badge";

interface ProcedureCardProps {
  procedure: {
    id: string;
    title: string;
    description?: string;
    steps?: any[];
    estimated_duration?: number;
  };
  isSelected: boolean;
  onSelect: (procedureId: string) => void;
}

export const ProcedureCard = ({
  procedure,
  isSelected,
  onSelect,
}: ProcedureCardProps) => {
  const getProcedureIcon = (title: string) => {
    if (title.toLowerCase().includes('compressor')) return '🔧';
    if (title.toLowerCase().includes('scale')) return '⚖️';
    if (title.toLowerCase().includes('fire')) return '🧯';
    if (title.toLowerCase().includes('forklift')) return '🚛';
    if (title.toLowerCase().includes('safety')) return '👷';
    if (title.toLowerCase().includes('inspection')) return '🔍';
    if (title.toLowerCase().includes('maintenance')) return '🛠️';
    if (title.toLowerCase().includes('calibration')) return '📏';
    return '📋';
  };

  const getProcedureFieldCount = (procedure: any) => {
    if (procedure.steps && Array.isArray(procedure.steps)) {
      return `${procedure.steps.length} step${procedure.steps.length !== 1 ? 's' : ''}`;
    }
    return '0 steps';
  };

  return (
    <div
      className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
      onClick={() => onSelect(procedure.id)}
    >
      <div className="text-2xl">{getProcedureIcon(procedure.title)}</div>
      <div className="flex-1">
        <h4 className="font-medium text-gray-900">{procedure.title}</h4>
        <p className="text-sm text-gray-500 mb-1">
          {procedure.description || "No description"}
        </p>
        <p className="text-xs text-gray-400">
          {getProcedureFieldCount(procedure)} • {procedure.estimated_duration || 30} min
        </p>
      </div>
      {isSelected && (
        <Badge variant="secondary">Added</Badge>
      )}
    </div>
  );
};

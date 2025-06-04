
import { ProcedureCard } from "./ProcedureCard";

interface ProcedureListProps {
  procedures: any[];
  selectedProcedures: string[];
  onProcedureSelect: (procedureId: string) => void;
  isLoading: boolean;
  searchQuery: string;
}

export const ProcedureList = ({
  procedures,
  selectedProcedures,
  onProcedureSelect,
  isLoading,
  searchQuery,
}: ProcedureListProps) => {
  const filteredProcedures = procedures.filter(procedure =>
    procedure.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (procedure.description && procedure.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  if (isLoading) {
    return (
      <div className="text-center py-8 text-gray-500">
        Loading procedures...
      </div>
    );
  }

  if (filteredProcedures.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        {searchQuery 
          ? "No procedures found matching your search." 
          : "No procedures available. Create your first procedure!"
        }
      </div>
    );
  }

  return (
    <div className="space-y-2 max-h-96 overflow-y-auto">
      {filteredProcedures.map((procedure) => (
        <ProcedureCard
          key={procedure.id}
          procedure={procedure}
          isSelected={selectedProcedures.includes(procedure.id)}
          onSelect={onProcedureSelect}
        />
      ))}
    </div>
  );
};

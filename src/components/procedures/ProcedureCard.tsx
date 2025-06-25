
import React from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { 
  Edit, 
  Trash2, 
  Copy, 
  Play, 
  MoreVertical,
  CheckCircle,
  Globe,
  Square,
  Activity,
  Loader2
} from "lucide-react";

interface ProcedureCardProps {
  procedure: any;
  onExecute: (procedure: any) => void;
  onEdit: (procedure: any) => void;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
  canExecuteProcedure: (procedure: any) => { canExecute: boolean; reason?: string };
  getCategoryColor: (category: string) => string;
  executingProcedures: Set<string>;
}

export const ProcedureCard: React.FC<ProcedureCardProps> = ({
  procedure,
  onExecute,
  onEdit,
  onDuplicate,
  onDelete,
  canExecuteProcedure,
  getCategoryColor,
  executingProcedures
}) => {
  const renderExecuteButton = (variant: 'primary' | 'secondary' = 'primary') => {
    const { canExecute, reason } = canExecuteProcedure(procedure);
    const isExecuting = executingProcedures.has(procedure.id);
    
    if (variant === 'primary') {
      return (
        <Button 
          size="sm" 
          className={`flex-1 transition-all duration-300 transform hover:scale-105 ${
            canExecute 
              ? 'bg-white text-gray-900 border-2 border-gray-200 hover:border-blue-300 hover:bg-blue-50 shadow-sm hover:shadow-md' 
              : 'bg-gray-50 text-gray-400 cursor-not-allowed shadow-none border border-gray-200'
          }`}
          onClick={() => onExecute(procedure)}
          disabled={!canExecute || isExecuting}
          title={!canExecute ? reason : 'Execute this procedure'}
        >
          {isExecuting ? (
            <>
              <div className="w-4 h-4 mr-2 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
              Starting...
            </>
          ) : !canExecute ? (
            <>
              <Square className="h-4 w-4 mr-2" />
              {reason === "No fields configured" ? "No Fields" : "Cannot Execute"}
            </>
          ) : (
            <>
              <div className="flex items-center">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-2">
                  <Play className="h-4 w-4 text-blue-600" />
                </div>
                <span className="font-semibold">Execute</span>
              </div>
            </>
          )}
        </Button>
      );
    }

    return (
      <DropdownMenuItem 
        onClick={() => onExecute(procedure)}
        disabled={!canExecute || isExecuting}
        className={`${!canExecute ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
      >
        {isExecuting ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Starting...
          </>
        ) : (
          <>
            <Play className="h-4 w-4 mr-2" />
            Execute
          </>
        )}
      </DropdownMenuItem>
    );
  };

  return (
    <div className="group relative">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-xl opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
      <div className="relative bg-white rounded-xl p-6 shadow-sm border border-gray-100 group-hover:shadow-lg transition-all duration-300 group-hover:border-blue-200">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-900 transition-colors">
              {procedure.title}
            </h3>
            <p className="text-sm text-gray-600 line-clamp-2 mb-3">
              {procedure.description}
            </p>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-white border shadow-lg">
              {renderExecuteButton('secondary')}
              <DropdownMenuItem onClick={() => onEdit(procedure)}>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDuplicate(procedure.id)}>
                <Copy className="h-4 w-4 mr-2" />
                Duplicate
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => onDelete(procedure.id)}
                className="text-red-600"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex items-center justify-between mb-4">
          <div className="flex flex-wrap gap-2">
            <Badge className={`${getCategoryColor(procedure.category || 'Other')} text-xs`}>
              {procedure.category}
            </Badge>
            {procedure.is_global && (
              <Badge variant="outline" className="text-blue-600 border-blue-600 text-xs">
                <Globe className="h-3 w-3 mr-1" />
                Global
              </Badge>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between text-sm text-gray-500 mb-6">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <CheckCircle className="h-4 w-4" />
              {procedure.fields?.length || 0} steps
            </span>
            <span className="flex items-center gap-1">
              <Activity className="h-4 w-4" />
              {procedure.executions_count || 0} runs
            </span>
          </div>
        </div>

        <div className="flex gap-3">
          {renderExecuteButton('primary')}
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => onEdit(procedure)}
            className="px-4 hover:bg-gray-50 hover:border-gray-300"
          >
            <Edit className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

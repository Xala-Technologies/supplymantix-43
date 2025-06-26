
import { format, addMonths, subMonths } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CalendarHeaderProps {
  currentDate: Date;
  onNavigateMonth: (direction: 'prev' | 'next') => void;
  onGoToToday: () => void;
}

export const CalendarHeader = ({ currentDate, onNavigateMonth, onGoToToday }: CalendarHeaderProps) => {
  return (
    <div className="flex items-center justify-between p-6 bg-white/80 backdrop-blur-sm border-b border-slate-200 shadow-sm">
      <div className="flex items-center gap-4">
        <h2 className="text-xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
          {format(currentDate, 'MMMM yyyy')}
        </h2>
        <div className="flex items-center gap-2 bg-white rounded-lg p-1 shadow-sm border border-slate-200">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => onNavigateMonth('prev')}
            className="hover:bg-slate-100"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => onNavigateMonth('next')}
            className="hover:bg-slate-100"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
      <Button 
        variant="outline" 
        size="sm" 
        onClick={onGoToToday}
        className="bg-white/80 backdrop-blur-sm border-slate-300 hover:bg-white hover:border-primary"
      >
        Today
      </Button>
    </div>
  );
};

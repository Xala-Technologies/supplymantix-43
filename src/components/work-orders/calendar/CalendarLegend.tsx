
export const CalendarLegend = () => {
  return (
    <div className="bg-white/80 backdrop-blur-sm border-t border-slate-200 p-4 shadow-sm">
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-l-4 border-l-slate-500 bg-white rounded"></div>
            <span className="text-slate-600 font-medium">Open</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-l-4 border-l-blue-500 bg-white rounded"></div>
            <span className="text-slate-600 font-medium">In Progress</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-l-4 border-l-green-500 bg-white rounded"></div>
            <span className="text-slate-600 font-medium">Completed</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-l-4 border-l-yellow-500 bg-white rounded"></div>
            <span className="text-slate-600 font-medium">On Hold</span>
          </div>
        </div>
        <div className="text-slate-500 font-medium">
          💡 Drag work orders to change due dates
        </div>
      </div>
    </div>
  );
};

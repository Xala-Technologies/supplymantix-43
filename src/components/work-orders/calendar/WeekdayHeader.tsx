
export const WeekdayHeader = () => {
  const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  
  return (
    <div className="grid grid-cols-7 gap-2 mb-4">
      {weekdays.map(day => (
        <div key={day} className="p-3 text-center text-sm font-semibold text-slate-700 bg-white/80 backdrop-blur-sm rounded-lg border border-slate-200">
          {day}
        </div>
      ))}
    </div>
  );
};

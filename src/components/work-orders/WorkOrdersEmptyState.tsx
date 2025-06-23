
export const WorkOrdersEmptyState = () => {
  return (
    <div className="flex-1 flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl flex items-center justify-center mx-auto">
          <span className="text-2xl">📋</span>
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-gray-900">No work orders found</h3>
          <p className="text-sm text-gray-500">Create your first work order to get started</p>
        </div>
      </div>
    </div>
  );
};

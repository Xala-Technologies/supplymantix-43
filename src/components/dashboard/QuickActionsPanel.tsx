
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Wrench, Calendar, Package, Users } from "lucide-react";

interface QuickActionsPanelProps {
  onCreateWorkOrder: () => void;
  onScheduleProcedure: () => void;
  onAddAsset: () => void;
  onInviteUser: () => void;
}

export const QuickActionsPanel = ({
  onCreateWorkOrder,
  onScheduleProcedure,
  onAddAsset,
  onInviteUser
}: QuickActionsPanelProps) => {
  const actions = [
    {
      label: "Create Work Order",
      icon: Plus,
      onClick: onCreateWorkOrder,
      className: "bg-blue-600 hover:bg-blue-700"
    },
    {
      label: "Schedule Procedure",
      icon: Calendar,
      onClick: onScheduleProcedure,
      className: "bg-green-600 hover:bg-green-700"
    },
    {
      label: "Add Asset",
      icon: Package,
      onClick: onAddAsset,
      className: "bg-purple-600 hover:bg-purple-700"
    },
    {
      label: "Invite User",
      icon: Users,
      onClick: onInviteUser,
      className: "bg-orange-600 hover:bg-orange-700"
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {actions.map((action) => (
            <Button
              key={action.label}
              onClick={action.onClick}
              className={`w-full h-14 flex items-center justify-start gap-3 px-4 text-left ${action.className}`}
            >
              <div className="flex-shrink-0">
                <action.icon className="h-5 w-5" />
              </div>
              <span className="text-sm font-medium">{action.label}</span>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

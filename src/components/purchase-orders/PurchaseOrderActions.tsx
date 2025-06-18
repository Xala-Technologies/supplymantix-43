
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, FileText } from "lucide-react";
import { PurchaseOrder } from "@/types/purchaseOrder";
import { useExportPOCsv, useGeneratePOPdf } from "@/hooks/usePurchaseOrdersEnhanced";

interface PurchaseOrderActionsProps {
  purchaseOrder: PurchaseOrder;
}

export const PurchaseOrderActions = ({ purchaseOrder }: PurchaseOrderActionsProps) => {
  const exportCsv = useExportPOCsv();
  const generatePdf = useGeneratePOPdf();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Actions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <Button
          variant="outline"
          className="w-full"
          onClick={() => generatePdf.mutate(purchaseOrder.id)}
          disabled={generatePdf.isPending}
        >
          <FileText className="h-4 w-4 mr-2" />
          Generate PDF
        </Button>
        <Button
          variant="outline"
          className="w-full"
          onClick={() => exportCsv.mutate(purchaseOrder.id)}
          disabled={exportCsv.isPending}
        >
          <Download className="h-4 w-4 mr-2" />
          Export CSV
        </Button>
      </CardContent>
    </Card>
  );
};

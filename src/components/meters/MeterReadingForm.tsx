
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCreateMeterReading } from "@/hooks/useMetersEnhanced";
import { X, BarChart3 } from "lucide-react";

interface MeterReadingFormProps {
  meterId: string;
  meterName: string;
  unit: string;
  onClose: () => void;
}

export const MeterReadingForm = ({ meterId, meterName, unit, onClose }: MeterReadingFormProps) => {
  const [value, setValue] = useState("");
  const [comment, setComment] = useState("");
  
  const createReading = useCreateMeterReading();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!value || isNaN(Number(value))) {
      return;
    }

    try {
      await createReading.mutateAsync({
        meter_id: meterId,
        value: Number(value),
        comment: comment || null,
      });
      onClose();
    } catch (error) {
      console.error("Error creating reading:", error);
    }
  };

  return (
    <Dialog open onOpenChange={() => onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
              <BarChart3 className="h-4 w-4 text-white" />
            </div>
            <div>
              <DialogTitle className="text-lg font-semibold">Record Reading</DialogTitle>
              <p className="text-sm text-muted-foreground">{meterName}</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="value">Reading Value *</Label>
            <div className="relative">
              <Input
                id="value"
                type="number"
                step="0.01"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="Enter reading value"
                required
                className="pr-16"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                {unit}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="comment">Notes (Optional)</Label>
            <Textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Add any relevant notes about this reading..."
              rows={3}
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={createReading.isPending || !value}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              {createReading.isPending ? "Recording..." : "Record Reading"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

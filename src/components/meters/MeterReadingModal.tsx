import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Upload, X } from "lucide-react";
import { useCreateMeterReading } from "@/hooks/useMetersEnhanced";

interface MeterReadingModalProps {
  open: boolean;
  onClose: () => void;
  meter: {
    id: string;
    name: string;
    unit: string;
  };
}

export const MeterReadingModal = ({ open, onClose, meter }: MeterReadingModalProps) => {
  const [value, setValue] = useState("");
  const [notes, setNotes] = useState("");
  const [attachments, setAttachments] = useState<File[]>([]);

  const createReading = useCreateMeterReading();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!value || isNaN(Number(value))) {
      return;
    }

    try {
      await createReading.mutateAsync({
        meter_id: meter.id,
        value: Number(value),
        recorded_at: new Date().toISOString(),
        notes: notes.trim() || undefined,
        attachments: [], // For now, we'll handle file uploads later
      });

      // Reset form and close
      setValue("");
      setNotes("");
      setAttachments([]);
      onClose();
    } catch (error) {
      console.error("Error submitting reading:", error);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setAttachments(prev => [...prev, ...files]);
  };

  const removeFile = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Record Meter Reading</DialogTitle>
          <p className="text-sm text-muted-foreground">
            {meter.name}
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="value">Reading Value</Label>
            <div className="flex items-center gap-2">
              <Input
                id="value"
                type="number"
                step="any"
                placeholder="Enter value"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="flex-1"
                required
              />
              <span className="text-sm font-medium text-muted-foreground min-w-fit">
                {meter.unit}
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              placeholder="Add any notes about this reading..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label>Attachments (Optional)</Label>
            <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-4">
              <div className="text-center">
                <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground mb-2">
                  Upload images or documents
                </p>
                <input
                  type="file"
                  multiple
                  accept="image/*,.pdf,.doc,.docx"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => document.getElementById('file-upload')?.click()}
                >
                  Choose Files
                </Button>
              </div>

              {attachments.length > 0 && (
                <div className="mt-4 space-y-2">
                  {attachments.map((file, index) => (
                    <div key={index} className="flex items-center justify-between bg-muted/50 rounded p-2">
                      <span className="text-sm truncate">{file.name}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={!value || isNaN(Number(value)) || createReading.isPending}
              className="flex-1"
            >
              {createReading.isPending ? "Recording..." : "Submit Reading"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
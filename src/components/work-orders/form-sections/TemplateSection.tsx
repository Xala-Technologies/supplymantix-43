
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface TemplateSectionProps {
  selectedTemplate: string;
  setSelectedTemplate: (value: string) => void;
  applyTemplate: (templateId: string) => void;
}

export const TemplateSection = ({ selectedTemplate, setSelectedTemplate, applyTemplate }: TemplateSectionProps) => {
  return (
    <div className="space-y-2">
      <Label>Start from Template (Optional)</Label>
      <Select value={selectedTemplate} onValueChange={(value) => {
        setSelectedTemplate(value);
        applyTemplate(value);
      }}>
        <SelectTrigger>
          <SelectValue placeholder="Choose a template..." />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="maintenance">Routine Maintenance</SelectItem>
          <SelectItem value="repair">Equipment Repair</SelectItem>
          <SelectItem value="inspection">Safety Inspection</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

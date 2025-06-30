
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

interface VisibilitySectionProps {
  isGlobal: boolean;
  onVisibilityChange: (isGlobal: boolean) => void;
}

export const VisibilitySection: React.FC<VisibilitySectionProps> = ({
  isGlobal,
  onVisibilityChange
}) => {
  return (
    <Card className="shadow-sm border-gray-200 bg-white">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-semibold text-gray-900">Procedure Visibility</CardTitle>
      </CardHeader>
      <CardContent>
        <RadioGroup
          value={isGlobal ? "public" : "private"}
          onValueChange={(value) => onVisibilityChange(value === "public")}
          className="space-y-4"
        >
          <div className="flex items-start space-x-4 p-4 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 transition-colors">
            <RadioGroupItem value="private" id="private" className="mt-1" />
            <div className="space-y-2 flex-1">
              <Label htmlFor="private" className="font-medium text-gray-900 cursor-pointer">
                Keep Private
              </Label>
              <p className="text-sm text-gray-600">
                This Procedure will only be visible to your teammates at MaintainX.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-4 p-4 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 transition-colors">
            <RadioGroupItem value="public" id="public" className="mt-1" />
            <div className="space-y-2 flex-1">
              <Label htmlFor="public" className="font-medium text-gray-900 cursor-pointer">
                Make Public
              </Label>
              <p className="text-sm text-gray-600">
                Publish this Procedure to the Global Procedure Library for everyone in the MaintainX Community to see.
              </p>
            </div>
          </div>
        </RadioGroup>
      </CardContent>
    </Card>
  );
};

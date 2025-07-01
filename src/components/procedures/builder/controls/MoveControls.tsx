
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronUp, ChevronDown } from 'lucide-react';

interface MoveControlsProps {
  index: number;
  fieldsLength: number;
  onMove?: (index: number, direction: 'up' | 'down') => void;
}

export const MoveControls: React.FC<MoveControlsProps> = ({
  index,
  fieldsLength,
  onMove
}) => {
  const handleMoveUp = () => {
    console.log('Move up clicked for field index:', index);
    if (onMove) {
      onMove(index, 'up');
    } else {
      console.warn('onMove handler not provided');
    }
  };

  const handleMoveDown = () => {
    console.log('Move down clicked for field index:', index);
    if (onMove) {
      onMove(index, 'down');
    } else {
      console.warn('onMove handler not provided');
    }
  };

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        onClick={handleMoveUp}
        disabled={index === 0}
        className="h-8 w-8 p-0 text-gray-400 hover:text-gray-600"
        title="Move field up"
      >
        <ChevronUp className="h-4 w-4" />
      </Button>
      
      <Button
        variant="ghost"
        size="sm"
        onClick={handleMoveDown}
        disabled={index === fieldsLength - 1}
        className="h-8 w-8 p-0 text-gray-400 hover:text-gray-600"
        title="Move field down"
      >
        <ChevronDown className="h-4 w-4" />
      </Button>
    </>
  );
};

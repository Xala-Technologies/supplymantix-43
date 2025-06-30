
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { QrCode, Barcode, Keyboard } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface BarcodeGeneratorProps {
  qrCode?: string;
  barcode?: string;
  onQrCodeChange: (value: string) => void;
  onBarcodeChange: (value: string) => void;
}

export const BarcodeGenerator: React.FC<BarcodeGeneratorProps> = ({
  qrCode,
  barcode,
  onQrCodeChange,
  onBarcodeChange
}) => {
  const [manualInput, setManualInput] = useState(false);

  const generateQrCode = () => {
    const code = `ASSET-${Date.now()}`;
    onQrCodeChange(code);
  };

  const generateBarcode = () => {
    const code = Math.random().toString().slice(2, 14);
    onBarcodeChange(code);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* QR Code Section */}
        <div className="space-y-2">
          <Label>QR Code</Label>
          <div className="flex items-center gap-2">
            <Input
              value={qrCode || ''}
              onChange={(e) => onQrCodeChange(e.target.value)}
              placeholder="QR Code value"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={generateQrCode}
            >
              <QrCode className="h-4 w-4" />
            </Button>
          </div>
          {qrCode && (
            <div className="p-2 border rounded-lg text-center">
              <div className="w-24 h-24 bg-gray-100 rounded border-2 border-dashed border-gray-300 mx-auto flex items-center justify-center">
                <QrCode className="h-8 w-8 text-gray-400" />
              </div>
              <p className="text-xs text-gray-500 mt-1">QR Code Preview</p>
            </div>
          )}
        </div>

        {/* Barcode Section */}
        <div className="space-y-2">
          <Label>Barcode</Label>
          <div className="flex items-center gap-2">
            <Input
              value={barcode || ''}
              onChange={(e) => onBarcodeChange(e.target.value)}
              placeholder="Barcode value"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={generateBarcode}
            >
              <Barcode className="h-4 w-4" />
            </Button>
          </div>
          {barcode && (
            <div className="p-2 border rounded-lg text-center">
              <div className="w-full h-12 bg-gray-100 rounded border-2 border-dashed border-gray-300 flex items-center justify-center">
                <Barcode className="h-6 w-6 text-gray-400" />
              </div>
              <p className="text-xs text-gray-500 mt-1">Barcode Preview</p>
            </div>
          )}
        </div>
      </div>

      <Dialog>
        <DialogTrigger asChild>
          <Button type="button" variant="outline" className="w-full">
            <Keyboard className="h-4 w-4 mr-2" />
            Manual Input
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Manual Barcode/QR Code Input</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="manual-qr">QR Code</Label>
              <Input
                id="manual-qr"
                value={qrCode || ''}
                onChange={(e) => onQrCodeChange(e.target.value)}
                placeholder="Enter QR code manually"
              />
            </div>
            <div>
              <Label htmlFor="manual-barcode">Barcode</Label>
              <Input
                id="manual-barcode"
                value={barcode || ''}
                onChange={(e) => onBarcodeChange(e.target.value)}
                placeholder="Enter barcode manually"
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

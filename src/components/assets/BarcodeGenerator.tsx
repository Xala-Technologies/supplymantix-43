
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { QrCode, Barcode, Keyboard } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import QRCode from 'qrcode';

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
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');
  const [barcodeDataUrl, setBarcodeDataUrl] = useState<string>('');

  // Generate QR Code image when qrCode value changes
  useEffect(() => {
    if (qrCode) {
      QRCode.toDataURL(qrCode, { width: 96, margin: 1 })
        .then(url => setQrCodeDataUrl(url))
        .catch(err => console.error('Error generating QR code:', err));
    } else {
      setQrCodeDataUrl('');
    }
  }, [qrCode]);

  // Generate simple barcode representation
  useEffect(() => {
    if (barcode) {
      // Create a simple barcode representation using canvas
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (ctx) {
        canvas.width = 200;
        canvas.height = 60;
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'black';
        
        // Generate simple bars based on barcode digits
        const barWidth = 2;
        let x = 10;
        for (let i = 0; i < barcode.length; i++) {
          const digit = parseInt(barcode[i]) || 0;
          const height = 30 + (digit * 2);
          ctx.fillRect(x, 10, barWidth, height);
          x += barWidth + 1;
        }
        
        setBarcodeDataUrl(canvas.toDataURL());
      }
    } else {
      setBarcodeDataUrl('');
    }
  }, [barcode]);

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
              <div className="w-24 h-24 bg-white rounded border mx-auto flex items-center justify-center">
                {qrCodeDataUrl ? (
                  <img 
                    src={qrCodeDataUrl} 
                    alt="QR Code" 
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <QrCode className="h-8 w-8 text-gray-400" />
                )}
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
              <div className="w-full h-12 bg-white rounded border flex items-center justify-center">
                {barcodeDataUrl ? (
                  <img 
                    src={barcodeDataUrl} 
                    alt="Barcode" 
                    className="h-full object-contain"
                  />
                ) : (
                  <Barcode className="h-6 w-6 text-gray-400" />
                )}
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

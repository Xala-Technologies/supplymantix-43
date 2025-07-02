
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { QrCode, Barcode, Keyboard } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
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
  const [selectedType, setSelectedType] = useState<'qr' | 'barcode'>('qr');
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');
  const [barcodeDataUrl, setBarcodeDataUrl] = useState<string>('');

  // Determine which type is currently selected based on existing values
  useEffect(() => {
    if (qrCode && !barcode) {
      setSelectedType('qr');
    } else if (barcode && !qrCode) {
      setSelectedType('barcode');
    }
  }, [qrCode, barcode]);

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
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (ctx) {
        canvas.width = 200;
        canvas.height = 60;
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'black';
        
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

  const handleTypeChange = (type: 'qr' | 'barcode') => {
    setSelectedType(type);
    // Clear the other type when switching
    if (type === 'qr') {
      onBarcodeChange('');
    } else {
      onQrCodeChange('');
    }
  };

  const generateQrCode = () => {
    const code = `ASSET-${Date.now()}`;
    onQrCodeChange(code);
    onBarcodeChange(''); // Clear barcode
  };

  const generateBarcode = () => {
    const code = Math.random().toString().slice(2, 14);
    onBarcodeChange(code);
    onQrCodeChange(''); // Clear QR code
  };

  const currentValue = selectedType === 'qr' ? qrCode : barcode;

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        <Label>Identification Type</Label>
        <RadioGroup
          value={selectedType}
          onValueChange={(value: 'qr' | 'barcode') => handleTypeChange(value)}
          className="flex gap-6"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="qr" id="qr" />
            <Label htmlFor="qr">QR Code</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="barcode" id="barcode" />
            <Label htmlFor="barcode">Barcode</Label>
          </div>
        </RadioGroup>
      </div>

      <div className="space-y-2">
        <Label>{selectedType === 'qr' ? 'QR Code' : 'Barcode'}</Label>
        <div className="flex items-center gap-2">
          <Input
            value={currentValue || ''}
            onChange={(e) => {
              if (selectedType === 'qr') {
                onQrCodeChange(e.target.value);
              } else {
                onBarcodeChange(e.target.value);
              }
            }}
            placeholder={`${selectedType === 'qr' ? 'QR Code' : 'Barcode'} value`}
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={selectedType === 'qr' ? generateQrCode : generateBarcode}
          >
            {selectedType === 'qr' ? <QrCode className="h-4 w-4" /> : <Barcode className="h-4 w-4" />}
          </Button>
        </div>
        
        {currentValue && (
          <div className="p-2 border rounded-lg text-center">
            <div className={`${selectedType === 'qr' ? 'w-24 h-24' : 'w-full h-12'} bg-white rounded border mx-auto flex items-center justify-center`}>
              {selectedType === 'qr' && qrCodeDataUrl ? (
                <img 
                  src={qrCodeDataUrl} 
                  alt="QR Code" 
                  className="w-full h-full object-contain"
                />
              ) : selectedType === 'barcode' && barcodeDataUrl ? (
                <img 
                  src={barcodeDataUrl} 
                  alt="Barcode" 
                  className="h-full object-contain"
                />
              ) : (
                selectedType === 'qr' ? <QrCode className="h-8 w-8 text-gray-400" /> : <Barcode className="h-6 w-6 text-gray-400" />
              )}
            </div>
            <p className="text-xs text-gray-500 mt-1">{selectedType === 'qr' ? 'QR Code' : 'Barcode'} Preview</p>
          </div>
        )}
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
            <DialogTitle>Manual {selectedType === 'qr' ? 'QR Code' : 'Barcode'} Input</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor={`manual-${selectedType}`}>{selectedType === 'qr' ? 'QR Code' : 'Barcode'}</Label>
              <Input
                id={`manual-${selectedType}`}
                value={currentValue || ''}
                onChange={(e) => {
                  if (selectedType === 'qr') {
                    onQrCodeChange(e.target.value);
                  } else {
                    onBarcodeChange(e.target.value);
                  }
                }}
                placeholder={`Enter ${selectedType === 'qr' ? 'QR code' : 'barcode'} manually`}
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

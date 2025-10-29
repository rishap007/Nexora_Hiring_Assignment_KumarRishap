import { CheckCircle2, Download, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { Receipt } from "@shared/schema";

interface ReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  receipt: Receipt | null;
}

export function ReceiptModal({ isOpen, onClose, receipt }: ReceiptModalProps) {
  if (!isOpen || !receipt || !receipt.items || !Array.isArray(receipt.items)) return null;

  const handleDownload = () => {
    const receiptText = `
VIBE COMMERCE - Order Receipt
================================
Order Number: ${receipt.orderNumber}
Date: ${new Date(receipt.timestamp).toLocaleString()}

Customer Information:
Name: ${receipt.customerName}
Email: ${receipt.customerEmail}

Items:
${receipt.items.map(item => `- ${item.productName} x${item.quantity} - $${item.price}`).join('\n')}

Total: $${receipt.total}

Thank you for shopping with Vibe Commerce!
    `.trim();

    const blob = new Blob([receiptText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `vibe-commerce-receipt-${receipt.orderNumber}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 animate-in fade-in-0"
        onClick={onClose}
        data-testid="overlay-receipt-modal"
      />
      
      <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md animate-in zoom-in-95 fade-in-0 duration-300" data-testid="modal-receipt">
        <Card className="p-8 relative">
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-4"
            onClick={onClose}
            data-testid="button-close-receipt"
          >
            <X className="w-4 h-4" />
          </Button>

          <div className="flex flex-col items-center text-center mb-6">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4 animate-in zoom-in-50 duration-500">
              <CheckCircle2 className="w-10 h-10 text-primary animate-in zoom-in-0 duration-700 delay-200" />
            </div>
            
            <h2 className="font-display text-2xl font-bold mb-2" data-testid="text-receipt-title">
              Order Confirmed!
            </h2>
            
            <p className="text-sm text-muted-foreground">
              Thank you for your purchase
            </p>
          </div>

          <div className="space-y-4 mb-6">
            <div className="bg-muted/50 rounded-lg p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Order Number</span>
                <span className="font-mono font-semibold" data-testid="text-order-number">
                  {receipt.orderNumber}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Date</span>
                <span data-testid="text-order-date">
                  {new Date(receipt.timestamp).toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Time</span>
                <span data-testid="text-order-time">
                  {new Date(receipt.timestamp).toLocaleTimeString()}
                </span>
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">
                Customer Details
              </h3>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Name</span>
                  <span data-testid="text-customer-name">{receipt.customerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Email</span>
                  <span className="font-mono text-xs" data-testid="text-customer-email">
                    {receipt.customerEmail}
                  </span>
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">
                Order Summary
              </h3>
              <div className="space-y-2">
                {receipt.items.map((item, index) => (
                  <div key={index} className="flex justify-between text-sm" data-testid={`receipt-item-${index}`}>
                    <span className="text-muted-foreground">
                      {item.productName} x{item.quantity}
                    </span>
                    <span className="font-medium">${item.price}</span>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            <div className="flex justify-between items-center pt-2">
              <span className="font-semibold text-lg">Total</span>
              <span className="font-bold text-2xl font-mono tabular-nums bg-gradient-to-r from-primary to-chart-3 bg-clip-text text-transparent" data-testid="text-receipt-total">
                ${receipt.total}
              </span>
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1 gap-2"
              onClick={handleDownload}
              data-testid="button-download-receipt"
            >
              <Download className="w-4 h-4" />
              Download
            </Button>
            <Button
              className="flex-1"
              onClick={onClose}
              data-testid="button-close-receipt-confirm"
            >
              Close
            </Button>
          </div>
        </Card>
      </div>
    </>
  );
}

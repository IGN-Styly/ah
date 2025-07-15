"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { NBTDisplay } from "./nbt";
import { Doc } from "@convex/_generated/dataModel";
import AppConfig from "@/lib/config";
import { formatPrice, formatCurrency } from "@/lib/price";
interface BuyNowModalProps {
  isOpen: boolean;
  onClose: () => void;
  auction: Doc<"auctions">;
}

export function BuyNowModal({ isOpen, onClose, auction }: BuyNowModalProps) {
  const itemPrice = auction.buyNowPrice || 0;
  const processingFee = Math.round(itemPrice * AppConfig.TAX); // 2.5% processing fee
  const totalPrice = itemPrice + processingFee;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="rounded-none max-w-md">
        <DialogHeader>
          <DialogTitle className="font-bold uppercase tracking-wider text-center">
            Buy Now
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {/* Item Info */}
          <div className="bg-muted p-4 border rounded-none">
            <h4 className="font-bold text-sm uppercase tracking-wider text-muted-foreground mb-2">
              Item Details
            </h4>
            <p className="font-semibold text-base">{auction.title}</p>
          </div>
          {/* Price Breakdown */}
          <div className="bg-muted p-4 border rounded-none">
            <h4 className="font-bold text-sm uppercase tracking-wider text-muted-foreground mb-3">
              Order Summary
            </h4>

            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Item Price</span>
                <span className="font-semibold">{formatPrice(itemPrice)}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-sm">Processing Fee</span>
                <span className="font-semibold">
                  {formatPrice(processingFee)}
                </span>
              </div>

              <Separator className="my-2" />

              <div className="flex justify-between">
                <span className="font-bold uppercase tracking-wider">
                  Total
                </span>
                <span className="font-bold text-lg text-primary">
                  {formatPrice(totalPrice)}
                </span>
              </div>
            </div>
          </div>

          {/* Payment Info */}
          <div className="bg-muted/50 p-3 border rounded-none">
            <p className="text-xs text-muted-foreground text-center">
              By clicking "Buy Now", you agree to purchase this item immediately
              at the listed price.
            </p>
          </div>

          <div className="flex gap-2 pt-2">
            <Button
              onClick={onClose}
              variant="outline"
              className="flex-1 rounded-none bg-transparent font-black font-mono"
            >
              Cancel
            </Button>
            <Button
              onClick={onClose}
              className="flex-1 rounded-none font-black font-mono"
            >
              Buy Now
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

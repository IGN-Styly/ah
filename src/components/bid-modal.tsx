"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Doc } from "@convex/_generated/dataModel";
import { formatCurrency, parsePrice } from "@/lib/price";
import { useMutation } from "convex/react";
import { api } from "@convex/_generated/api";
import { toast } from "sonner";

interface BidModalProps {
  isOpen: boolean;
  onClose: () => void;
  auction: Doc<"auctions">;
}

function getQuickBidIncrements(currentBid: number): number[] {
  if (currentBid < 100) return [5, 10, 25, 50];
  if (currentBid < 500) return [10, 25, 50, 100];
  if (currentBid < 1000) return [25, 50, 100, 250];
  if (currentBid < 5000) return [100, 250, 500, 1000];
  if (currentBid < 10000) return [250, 500, 1000, 2500];
  if (currentBid < 50000) return [500, 1000, 2500, 5000];
  if (currentBid < 100000) return [1000, 2500, 5000, 10000];
  if (currentBid < 500000) return [5000, 10000, 25000, 50000];
  if (currentBid < 1000000) return [10000, 25000, 50000, 100000];
  if (currentBid < 5000000) return [50000, 100000, 250000, 500000];
  if (currentBid < 10000000) return [100000, 250000, 500000, 1000000];
  return [500000, 1000000, 2500000, 5000000];
}

function formatIncrement(increment: number): string {
  if (increment >= 1000000) return `+$${(increment / 1000000).toFixed(1)}m`;
  if (increment >= 1000) return `+$${(increment / 1000).toFixed(0)}k`;
  return `+$${increment}`;
}

export function BidModal({ isOpen, onClose, auction }: BidModalProps) {
  const [bidAmount, setBidAmount] = useState("");
  const placebid = useMutation(api.auction.bid);

  const minBid = (auction.currentBid as number) + 1;
  const increments = getQuickBidIncrements(auction.currentBid as number);
  const quickBidAmounts = increments.map((increment) => minBid + increment);

  const handleQuickBid = (amount: number) => {
    setBidAmount(amount.toString());
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="rounded-none max-w-md">
        <DialogHeader>
          <DialogTitle className="font-bold uppercase tracking-wider text-center">
            Place Bid
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="bg-muted p-4 border rounded-none">
            <p className="text-sm text-muted-foreground uppercase tracking-wider">
              Current Bid
            </p>
            <p className="font-bold text-2xl">
              {formatCurrency(auction.currentBid as number)}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Minimum bid: {formatCurrency(minBid)}
            </p>
          </div>

          <div>
            <Label
              htmlFor="bid-amount"
              className="text-sm font-medium text-muted-foreground uppercase tracking-wider"
            >
              Your Bid Amount
            </Label>
            <Input
              id="bid-amount"
              type=""
              value={bidAmount}
              onChange={(e) => setBidAmount(e.target.value)}
              placeholder={formatCurrency(minBid)}
              className="rounded-none mt-2"
            />
          </div>

          <div>
            <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-3">
              Quick Bid
            </p>
            <div className="grid grid-cols-2 gap-2">
              {quickBidAmounts.map((amount, index) => (
                <Button
                  key={amount}
                  variant="outline"
                  className="rounded-none bg-transparent font-medium flex flex-col items-center py-3 h-auto"
                  onClick={() => handleQuickBid(amount)}
                >
                  <span className="font-bold">{formatCurrency(amount)}</span>
                  <span className="text-xs text-muted-foreground">
                    {formatIncrement(increments[index])}
                  </span>
                </Button>
              ))}
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              onClick={onClose}
              variant="outline"
              className="flex-1 rounded-none bg-transparent"
            >
              Cancel
            </Button>
            <Button
              disabled={
                !bidAmount ||
                //@ts-expect-error
                isNaN(parsePrice(bidAmount)) ||
                //@ts-expect-error
                parsePrice(bidAmount) < minBid
              }
              onClick={async () => {
                onClose;
                const { ok, message } = await placebid({
                  amt: parsePrice(bidAmount) as number,
                  id: auction._id,
                });
                ok
                  ? toast.success("Bid Sent", {
                      description: message,
                    })
                  : toast.error("Error", {
                      description: message,
                    });
              }}
              className="flex-1 rounded-none"
            >
              Place Bid
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

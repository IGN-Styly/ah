"use client";
import { formatPrice, formatCurrency, formatPriceBNK } from "@/lib/price";
import { useState, useRef, useEffect, MouseEvent, useCallback } from "react";
import Image from "next/image";
import { Clock, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { BidModal } from "@/components/bid-modal";
import { BuyNowModal } from "@/components/buy-now-modal";
import type { AuctionCardProps } from "@/types/auction";
import { NBTDisplay, parseNBT } from "./nbt";
import { formatDistanceToNow, intervalToDuration, format } from "date-fns";
import { useMutation, useQuery } from "convex/react";
import { api } from "@convex/_generated/api";
import { ItemImage } from "./ItemImage";
import { toast } from "sonner";

export function AuctionCard({ auction }: AuctionCardProps) {
  const claimSeller = useMutation(api.auction.claimSellerAuction);
  const cancel = useMutation(api.auction.cancelAuction);
  const user = useQuery(api.auth.getCurrentUser);
  const [isHovered, setIsHovered] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hoverPosition, setHoverPosition] = useState({ x: 0, y: 0 });
  const [showBidModal, setShowBidModal] = useState(false);
  const [showBuyNowModal, setShowBuyNowModal] = useState(false);
  const [showCancelConfirmModal, setShowCancelConfirmModal] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const hoverRef = useRef<HTMLDivElement>(null);
  let name = useQuery(api.users.getUsername, { id: auction.seller })?.name;

  // Treat as ended if currentBid >= buyNowPrice and buyNowPrice is set
  const isBuyNowEnded =
    auction.buyNowPrice !== undefined &&
    auction.buyNowPrice !== null &&
    auction.currentBid !== undefined &&
    auction.currentBid !== null &&
    auction.currentBid >= auction.buyNowPrice;

  // Calculate auction time remaining
  const getAuctionTimes = useCallback(() => {
    // Auction end time in ms (from schema)
    const endTimeMs = auction.end;
    const endTime = new Date(endTimeMs);

    // Current time in ms
    const nowMs = Date.now();

    // If auction has ended
    if (nowMs >= endTimeMs || isBuyNowEnded) {
      return {
        timeRemaining: "ENDED",
        endTimeFormatted: format(endTime, "MMM d, yyyy 'at' h:mm a"),
        isEnded: true,
        endTime,
      };
    }

    // Calculate remaining duration
    const remainingMs = endTimeMs - nowMs;
    const duration = intervalToDuration({ start: 0, end: remainingMs });

    // Format compact time remaining
    let compactRemaining;
    if (duration.days && duration.days > 0) {
      compactRemaining = `${duration.days}d ${duration.hours || 0}h`;
    } else if (duration.hours && duration.hours > 0) {
      compactRemaining = `${duration.hours}h ${duration.minutes || 0}m`;
    } else if (duration.minutes && duration.minutes > 0) {
      compactRemaining = `${duration.minutes}m ${duration.seconds || 0}s`;
    } else {
      compactRemaining = `${duration.seconds || 0}s`;
    }

    return {
      timeRemaining: compactRemaining,
      endTimeFormatted: format(endTime, "MMM d, yyyy 'at' h:mm a"),
      isEnded: false,
      endTime,
    };
  }, [auction.end, isBuyNowEnded]);

  const [auctionTimes, setAuctionTimes] = useState(getAuctionTimes());
  const { timeRemaining, endTimeFormatted, isEnded } = auctionTimes;

  // Update timer every second
  useEffect(() => {
    if (isEnded) return; // Don't update if auction has ended

    const timer = setInterval(() => {
      setAuctionTimes(getAuctionTimes());
    }, 1000);

    return () => clearInterval(timer);
  }, [getAuctionTimes, isEnded]);

  useEffect(() => {
    if (isHovered && cardRef.current && hoverRef.current) {
      const cardRect = cardRef.current.getBoundingClientRect();
      const hoverRect = hoverRef.current.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      // Center horizontally over the card
      const x = cardRect.left + cardRect.width / 2 - hoverRect.width / 2;

      // Position the hover to appear directly on top of the card
      const y = cardRect.top + 20; // Small offset from the top of the card

      // Handle edge cases where hover might go off-screen
      const adjustedX = Math.max(
        16,
        Math.min(x, viewportWidth - hoverRect.width - 16),
      );

      setHoverPosition({ x: adjustedX, y });
    }
  }, [isHovered]);

  return (
    <>
      <Card
        ref={cardRef}
        className="w-full overflow-hidden rounded-none group transition-all duration-200 py-1 gap-0"
      >
        <div className="relative -mt-1">
          <div
            className="cursor-pointer"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={(e: MouseEvent) => {
              e.preventDefault();
              setIsModalOpen(true);
            }}
          >
            <ItemImage image={auction.image} title={auction.title} />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
          </div>

          {/* Listing type badge */}
          <div className="absolute top-2 right-2 flex flex-col gap-1 items-end">
            {auction.buyNowPrice !== undefined &&
              auction.buyNowPrice !== null && (
                <Badge className="rounded-none text-xs bg-yellow-500 text-yellow-950 font-bold px-2 py-1 border border-yellow-600 shadow-[2px_2px_0_0_rgba(0,0,0,0.5)] uppercase tracking-wider flex items-center">
                  <Zap className="w-3 h-3 mr-1" />
                  BIN
                </Badge>
              )}
          </div>
        </div>

        <CardContent className="p-3 space-y-3">
          <h3 className="font-semibold text-sm leading-tight uppercase tracking-wider text-center line-clamp-2">
            {auction.title}
          </h3>

          <div className="grid grid-cols-2 gap-2">
            <div className="bg-muted p-2 border rounded-none text-center">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                BID
              </span>
              <div className="font-semibold text-base text-primary">
                {auction.currentBid !== undefined && !isNaN(auction.currentBid)
                  ? formatPriceBNK(auction.currentBid)
                  : "N/A"}
              </div>
            </div>
            <div className="bg-muted p-2 border rounded-none text-center">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                BIN
              </span>
              <div className="font-semibold text-base text-primary">
                {auction.buyNowPrice !== undefined &&
                auction.buyNowPrice !== null
                  ? formatPriceBNK(auction.buyNowPrice)
                  : "N/A"}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs bg-muted p-2 border rounded-none">
            <div
              className="flex items-center gap-1"
              title={`Ends ${endTimeFormatted}`}
            >
              <Clock className="h-3 w-3 text-muted-foreground" />
              <span
                className={`font-semibold uppercase tracking-wider ${isEnded ? "text-red-500" : ""}`}
              >
                {timeRemaining}
              </span>
            </div>
            <span className="font-semibold uppercase tracking-wider">
              {formatPrice(auction.bidcount, 0)} BIDS
            </span>
          </div>

          <div className="flex gap-2">
            {auction.seller === user?._id ? (
              isEnded ? (
                <Button
                  size="sm"
                  className="w-full rounded-none text-sm font-mono font-black bg-green-500 text-white"
                  disabled={auction.seller_claim}
                  onClick={async () => {
                    if (auction.seller_claim) return;
                    let { ok, message } = await claimSeller({
                      id: auction._id,
                    });
                    ok
                      ? toast.success("Auction Claimed", {
                          description: message,
                        })
                      : toast.error("Error", {
                          description: message,
                        });
                  }}
                >
                  {auction.seller_claim ? "Already Claimed" : "CLAIM"}
                </Button>
              ) : (
                <Button
                  size="sm"
                  className="w-full rounded-none text-sm font-mono font-black bg-red-500 text-white"
                  onClick={() => setShowCancelConfirmModal(true)}
                >
                  CANCEL
                </Button>
              )
            ) : (
              <>
                {isBuyNowEnded ? (
                  <Button
                    size="sm"
                    className="w-full rounded-none text-sm font-mono font-black"
                    disabled
                  >
                    N/A
                  </Button>
                ) : (
                  <>
                    {auction.currentBid !== undefined &&
                      !isNaN(auction.currentBid) && (
                        <Button
                          size="sm"
                          className="flex-1 rounded-none text-sm font-mono font-black"
                          onClick={() => setShowBidModal(true)}
                        >
                          BID
                        </Button>
                      )}
                    {auction.buyNowPrice && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 rounded-none font-black font-mono bg-transparent text-sm"
                        onClick={() => setShowBuyNowModal(true)}
                      >
                        BUY
                      </Button>
                    )}
                  </>
                )}
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Hover Details */}
      {isHovered && !isModalOpen && (
        <div
          ref={hoverRef}
          className="fixed z-50 w-[25rem] bg-background/95 backdrop-blur-sm border-4 border-border shadow-[0px_0px_16px_0px_rgba(0,0,0,0.4)] rounded-none"
          style={{
            left: `${hoverPosition.x}px`,
            top: `${hoverPosition.y}px`,
            transform: "translateZ(0)", // Force GPU acceleration for smoother positioning
            pointerEvents: "none", // Allow interaction with elements underneath
          }}
        >
          <div className="p-4 border-2 border-muted m-2 rounded-none">
            <h4 className="font-bold text-foreground uppercase tracking-wider mb-2 text-center border-b-2 border-border pb-2 text-sm">
              ITEM DETAILS
            </h4>
            <div className="space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="font-medium text-muted-foreground uppercase">
                  SELLER:
                </span>
                <span className="font-bold text-foreground">{name}</span>
              </div>

              <div className="flex justify-between">
                <NBTDisplay nbtData={auction.lore}></NBTDisplay>
              </div>
              <div className="flex justify-between"></div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Details */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="bg-background border-4 border-border shadow-[0px_0px_32px_0px_rgba(0,0,0,0.5)] rounded-none max-w-4xl w-full max-h-[90vh] overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-2 border-muted m-4 rounded-none">
              <div className="flex justify-between items-center mb-4 border-b-2 border-border pb-2">
                <h3 className="font-bold text-foreground uppercase tracking-wider text-lg">
                  ITEM DETAILS
                </h3>
                <Button
                  variant="ghost"
                  className="h-8 w-8 p-0 rounded-full"
                  onClick={() => setIsModalOpen(false)}
                >
                  ✕
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:min-h-[600px]">
                <div className="space-y-4">
                  <ItemImage
                    title={auction.title}
                    image={auction.image}
                    size={400}
                    border={true}
                  />

                  <h4 className="font-semibold text-lg uppercase tracking-wider">
                    {auction.title}
                  </h4>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-muted p-3 border rounded-none text-center">
                      <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        CURRENT BID
                      </span>
                      <div className="font-semibold text-lg text-primary">
                        {auction.currentBid
                          ? formatCurrency(auction.currentBid, "USD", 0)
                          : "N/A"}
                      </div>
                    </div>
                    <div className="bg-muted p-3 border rounded-none text-center">
                      <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        BUY NOW
                      </span>
                      <div className="font-semibold text-lg text-primary">
                        {auction.buyNowPrice
                          ? formatCurrency(auction.buyNowPrice, "USD", 0)
                          : "N/A"}
                      </div>
                    </div>
                  </div>

                  <div className="bg-muted p-3 border rounded-none">
                    <div className="flex justify-between mb-2">
                      <span className="font-medium text-muted-foreground uppercase text-sm">
                        SELLER:
                      </span>
                      <span className="font-bold text-foreground">{name}</span>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <div
                        className="flex items-center gap-1"
                        title={`Ends ${endTimeFormatted}`}
                      >
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span
                          className={`font-semibold uppercase tracking-wider ${isEnded ? "text-red-500" : ""}`}
                        >
                          {timeRemaining}
                        </span>
                      </div>
                      <span className="font-semibold uppercase tracking-wider">
                        {formatPrice(auction.bidcount, 0)} BIDS
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2 mt-4">
                    {isBuyNowEnded ? (
                      <Button
                        disabled
                        className={`rounded-none text-sm font-mono font-black ${auction.buyNowPrice ? "flex-1" : "w-full"}`}
                      >
                        N/A
                      </Button>
                    ) : (
                      <>
                        {auction.currentBid ? (
                          <Button
                            className={`rounded-none text-sm font-mono font-black ${auction.buyNowPrice ? "flex-1" : "w-full"}`}
                            onClick={() => {
                              setIsModalOpen(false);
                              setShowBidModal(true);
                            }}
                          >
                            PLACE BID
                          </Button>
                        ) : (
                          <></>
                        )}
                        {auction.buyNowPrice && (
                          <Button
                            variant="outline"
                            className="flex-1 rounded-none font-black font-mono bg-transparent text-sm"
                            onClick={() => {
                              setIsModalOpen(false);
                              setShowBuyNowModal(true);
                            }}
                          >
                            BUY NOW
                          </Button>
                        )}
                      </>
                    )}
                  </div>
                </div>

                <div className="bg-muted p-4 border rounded-none flex flex-col h-full">
                  <h4 className="font-semibold text-base uppercase tracking-wider mb-4 pb-2 border-b border-border">
                    ITEM DETAILS
                  </h4>
                  <div className="space-y-2">
                    <NBTDisplay nbtData={auction.lore}></NBTDisplay>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Only show BidModal and BuyNowModal if not ended */}
      {!isBuyNowEnded && (
        <BidModal
          isOpen={showBidModal}
          onClose={() => setShowBidModal(false)}
          auction={auction}
        />
      )}

      {!isBuyNowEnded && (
        <BuyNowModal
          isOpen={showBuyNowModal}
          onClose={() => setShowBuyNowModal(false)}
          auction={auction}
        />
      )}

      {/* Cancel Confirmation Modal */}
      {showCancelConfirmModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          onClick={() => !isCancelling && setShowCancelConfirmModal(false)}
        >
          <div
            className="bg-background border-4 border-border shadow-[0px_0px_32px_0px_rgba(0,0,0,0.5)] rounded-none max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-2 border-muted m-4 rounded-none">
              <div className="flex justify-between items-center mb-4 border-b-2 border-border pb-2">
                <h3 className="font-bold text-foreground uppercase tracking-wider text-lg">
                  Confirm Cancel Auction
                </h3>
                <Button
                  variant="ghost"
                  className="h-8 w-8 p-0 rounded-full"
                  onClick={() =>
                    !isCancelling && setShowCancelConfirmModal(false)
                  }
                  disabled={isCancelling}
                >
                  ✕
                </Button>
              </div>
              <div className="mb-6">
                <p className="text-base text-foreground mb-2">
                  Are you sure you want to cancel this auction?
                </p>
                <p className="text-sm text-red-600 font-semibold">
                  You will <span className="underline">not</span> get any tax
                  back if you cancel.
                </p>
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  className="rounded-none"
                  onClick={() =>
                    !isCancelling && setShowCancelConfirmModal(false)
                  }
                  disabled={isCancelling}
                >
                  No, go back
                </Button>
                <Button
                  className="rounded-none"
                  onClick={async () => {
                    setIsCancelling(true);
                    const { message, ok } = await cancel({ id: auction._id });
                    setIsCancelling(false);
                    setShowCancelConfirmModal(false);
                    if (ok) {
                      toast.success("Auction Cancelled", {
                        description: message,
                      });
                    } else {
                      toast.error("Error", {
                        description: message,
                      });
                    }
                  }}
                  disabled={isCancelling}
                >
                  {isCancelling ? "Cancelling..." : "Yes, Cancel Auction"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

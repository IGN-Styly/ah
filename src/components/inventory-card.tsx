"use client";
import Image from "next/image";
import { Card } from "./ui/card";
import { useEffect, useRef, useState, MouseEvent, ReactNode } from "react";
import { Doc } from "@convex/_generated/dataModel";
import { NBTDisplay } from "./nbt";
import { ItemImage } from "./ItemImage";
import { Button } from "./ui/button";
import { formatPrice, formatCurrency, parsePrice } from "@/lib/price";
import AppConfig from "@/lib/config";

const InventoryCard = ({ item }: { item: Doc<"items"> }) => {
  const [modalState, setModalState] = useState({
    isSellModalOpen: false,
    isReceiptModalOpen: false,
    isItemModalOpen: false,
  });

  const [hoverState, setHoverState] = useState({
    isHovered: false,
    position: { x: 0, y: 0 },
  });

  const [prices, setPrices] = useState({
    binPriceRaw: "",
    bidPriceRaw: "",
    binPrice: null as number | null,
    bidPrice: null as number | null,
  });
  const cardRef = useRef<HTMLDivElement>(null);
  const hoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (hoverState.isHovered && cardRef.current && hoverRef.current) {
      const cardRect = cardRef.current.getBoundingClientRect();
      const hoverRect = hoverRef.current.getBoundingClientRect();
      const viewportWidth = window.innerWidth;

      const x = Math.max(
        16,
        Math.min(
          cardRect.left + cardRect.width / 2 - hoverRect.width / 2,
          viewportWidth - hoverRect.width - 16,
        ),
      );
      const y = cardRect.top + 20;

      setHoverState((prev) => ({ ...prev, position: { x, y } }));
    }
  }, [hoverState.isHovered]);

  return (
    <>
      <Card
        ref={cardRef}
        className="w-full overflow-hidden rounded-none group transition-all duration-200 py-1"
      >
        <div className="relative -mt-1">
          <div
            className="cursor-pointer"
            onMouseEnter={() =>
              setHoverState({ ...hoverState, isHovered: true })
            }
            onMouseLeave={() =>
              setHoverState({ ...hoverState, isHovered: false })
            }
            onClick={(e: MouseEvent) => {
              e.preventDefault();
              setModalState({ ...modalState, isItemModalOpen: true });
            }}
          >
            <ItemImage image={item.image} title={item.title} />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
          </div>
        </div>
        <div className="p-3">
          <h3 className="font-semibold text-sm leading-tight uppercase tracking-wider text-center line-clamp-2">
            {item.title}
          </h3>
        </div>
      </Card>

      {/* Hover Details */}
      {hoverState.isHovered && (
        <div
          ref={hoverRef}
          className="fixed z-50 w-[25rem] bg-background/95 backdrop-blur-sm border-4 border-border shadow-lg rounded-none"
          style={{
            left: `${hoverState.position.x}px`,
            top: `${hoverState.position.y}px`,
            pointerEvents: "none",
          }}
        >
          <div className="p-4 border-2 border-muted m-2 rounded-none">
            <h4 className="font-bold text-foreground uppercase tracking-wider mb-2 text-center border-b-2 border-border pb-2 text-sm">
              ITEM DETAILS
            </h4>
            <div className="space-y-1 text-xs">
              <NBTDisplay nbtData={item.lore} />
            </div>
          </div>
        </div>
      )}
      {/* Modal Details */}
      {modalState.isItemModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          onClick={() =>
            setModalState({ ...modalState, isItemModalOpen: false })
          }
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
                  onClick={() =>
                    setModalState({ ...modalState, isItemModalOpen: false })
                  }
                >
                  ✕
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:min-h-[400px]">
                <div className="flex flex-col h-full">
                  <ItemImage
                    title={item.title}
                    image={item.image}
                    size={400}
                    border={true}
                    classNameTop="flex-grow flex items-center justify-center overflow-hidden"
                  />

                  <h4 className="font-semibold text-lg uppercase tracking-wider pt-4 text-center">
                    {item.title}
                  </h4>

                  <div className="flex gap-2 mt-4">
                    <Button
                      className="w-full rounded-none text-sm font-mono font-black"
                      onClick={() =>
                        setModalState({
                          isSellModalOpen: true,
                          isReceiptModalOpen: false,
                          isItemModalOpen: false,
                        })
                      }
                    >
                      SELL ITEM
                    </Button>
                  </div>
                </div>

                <div className="bg-muted p-4 border rounded-none flex flex-col h-full">
                  <h4 className="font-semibold text-base uppercase tracking-wider mb-4 pb-2 border-b border-border">
                    ITEM DETAILS
                  </h4>
                  <div className="space-y-2">
                    <NBTDisplay nbtData={item.lore} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {modalState.isSellModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          onClick={() =>
            setModalState({ ...modalState, isSellModalOpen: false })
          }
        >
          <div
            className="bg-background border-4 border-border shadow-[0px_0px_32px_0px_rgba(0,0,0,0.5)] rounded-none max-w-lg w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-bold text-foreground uppercase tracking-wider text-lg mb-4">
              Set Prices for Selling
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">
                  Buy It Now (BIN) Price
                </label>
                <input
                  type="text"
                  className="w-full border border-border p-2 rounded-none"
                  value={prices.binPriceRaw}
                  onChange={(e) =>
                    setPrices((prev) => ({
                      ...prev,
                      binPriceRaw: e.target.value,
                    }))
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">
                  Starting Bid Price
                </label>
                <input
                  type="text"
                  className="w-full border border-border p-2 rounded-none"
                  value={prices.bidPriceRaw}
                  onChange={(e) =>
                    setPrices((prev) => ({
                      ...prev,
                      bidPriceRaw: e.target.value,
                    }))
                  }
                />
              </div>
              <Button
                className="w-full rounded-none text-sm font-mono font-black"
                onClick={() => {
                  const parsedBinPrice = parsePrice(prices.binPriceRaw);
                  const parsedBidPrice = parsePrice(prices.bidPriceRaw);
                  setPrices((prev) => ({
                    ...prev,
                    binPrice: parsedBinPrice,
                    bidPrice: parsedBidPrice,
                  }));
                  if (parsedBinPrice !== null || parsedBidPrice !== null) {
                    setModalState({
                      isSellModalOpen: false,
                      isReceiptModalOpen: true,
                      isItemModalOpen: false,
                    });
                  }
                }}
                disabled={
                  (parsePrice(prices.binPriceRaw) === null ||
                    parsePrice(prices.binPriceRaw) === 0) &&
                  (parsePrice(prices.bidPriceRaw) === null ||
                    parsePrice(prices.bidPriceRaw) === 0)
                }
              >
                CONFIRM PRICES
              </Button>
            </div>
          </div>
        </div>
      )}
      {modalState.isReceiptModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          onClick={() =>
            setModalState({ ...modalState, isReceiptModalOpen: false })
          }
        >
          <div
            className="bg-background border-4 border-border shadow-[0px_0px_32px_0px_rgba(0,0,0,0.5)] rounded-none max-w-lg w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-bold text-foreground uppercase tracking-wider text-lg mb-4">
              Confirm Sale Details
            </h3>
            <div className="space-y-4 text-sm font-mono">
              <div className="flex justify-between">
                <span>Buy It Now (BIN) Price:</span>
                <span>
                  {prices.binPrice !== null
                    ? `$${formatPrice(prices.binPrice)}`
                    : prices.binPriceRaw
                      ? prices.binPriceRaw
                      : "N/A"}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Starting Bid Price:</span>
                <span>
                  {prices.bidPrice !== null
                    ? `$${formatPrice(prices.bidPrice)}`
                    : prices.bidPriceRaw
                      ? prices.bidPriceRaw
                      : "N/A"}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Tax:</span>
                <span>{`$${formatPrice(
                  ((prices.binPrice || 0) + (prices.bidPrice || 0)) *
                    AppConfig.TAX,
                )}`}</span>
              </div>
              <div className="flex justify-between font-bold">
                <span>Total:</span>
                <span>{`$${formatPrice(
                  (prices.binPrice || 0) +
                    (prices.bidPrice || 0) -
                    ((prices.binPrice || 0) + (prices.bidPrice || 0)) *
                      AppConfig.TAX,
                )}`}</span>
              </div>
              <Button
                className="w-full rounded-none text-sm font-mono font-black mt-4"
                onClick={() => {
                  console.log("Item listed for sale!");
                  setModalState({ ...modalState, isReceiptModalOpen: false });
                }}
              >
                CONFIRM SALE
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
export { InventoryCard };

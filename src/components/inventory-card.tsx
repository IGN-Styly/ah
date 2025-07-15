"use client";
import Image from "next/image";
import { Card } from "./ui/card";
import { useEffect, useRef, useState, MouseEvent } from "react";
import { Doc } from "@convex/_generated/dataModel";
import { NBTDisplay } from "./nbt";
import { ItemImage } from "./ItemImage";
import { Button } from "./ui/button";

const InventoryCard = ({ item }: { item: Doc<"items"> }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [hoverPosition, setHoverPosition] = useState({ x: 0, y: 0 });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const hoverRef = useRef<HTMLDivElement>(null);

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
        className="w-full overflow-hidden rounded-none group transition-all duration-200 py-1"
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
      {isHovered && (
        <div
          ref={hoverRef}
          className="fixed z-50 w-[25rem] bg-background/95 backdrop-blur-sm border-4 border-border shadow-[0px_0px_16px_0px_rgba(0,0,0,0.4)] rounded-none"
          style={{
            left: `${hoverPosition.x}px`,
            top: `${hoverPosition.y}px`,
            transform: "translateZ(0)",
            pointerEvents: "none",
          }}
        >
          <div className="p-4 border-2 border-muted m-2 rounded-none">
            <h4 className="font-bold text-foreground uppercase tracking-wider mb-2 text-center border-b-2 border-border pb-2 text-sm">
              ITEM DETAILS
            </h4>
            <div className="space-y-1 text-xs">
              <NBTDisplay nbtData={item.lore}></NBTDisplay>
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
                      onClick={() => {
                        console.log(
                          "Sell functionality triggered for",
                          item.title,
                        );
                        setIsModalOpen(false);
                      }}
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
                    <NBTDisplay nbtData={item.lore}></NBTDisplay>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
export { InventoryCard };

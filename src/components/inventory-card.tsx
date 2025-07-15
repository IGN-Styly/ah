"use client";
import Image from "next/image";
import { Card } from "./ui/card";
import { useEffect, useRef, useState } from "react";
import { Doc } from "@convex/_generated/dataModel";
import { NBTDisplay } from "./nbt";

const InventoryCard = ({ item }: { item: Doc<"items"> }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [hoverPosition, setHoverPosition] = useState({ x: 0, y: 0 });
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
          >
            <Image
              src={item.image || "/placeholder.svg?height=200&width=200"}
              alt={item.title}
              width={200}
              height={200}
              style={{ imageRendering: "pixelated" }}
              className="w-full aspect-square object-cover border-b-2 border-border"
            />
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
    </>
  );
};
export { InventoryCard };

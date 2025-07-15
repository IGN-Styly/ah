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
import { Skeleton } from "./ui/skeleton";
const LoadingInventoryCard = () => {
  return (
    <>
      <Card className="w-full overflow-hidden rounded-none group transition-all duration-200 gap-0 py-1">
        <div className="relative -mt-1">
          <div className="cursor-pointer">
            <Skeleton className="rounded-none">
              <ItemImage
                image={
                  "/assets/prism_all/assets/minecraft/textures/items/barrier.png"
                }
                title={""}
              />
            </Skeleton>

            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
          </div>
        </div>
        <div className="pb-3 pt-4">
          <h3 className="font-semibold text-sm leading-tight uppercase tracking-wider text-center line-clamp-2">
            Loading ...
          </h3>
        </div>
      </Card>

      {/* Hover Details */}
    </>
  );
};
export { LoadingInventoryCard };

"use client";
import { AuctionCard } from "./auction-card";
import { example, jsonexample, parseNBT } from "./nbt";
import { api } from "@convex/_generated/api";
import { useQuery } from "convex/react";

import { Button } from "./ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { SortOptions } from "../../convex/auction";
import { ArrowDownUp } from "lucide-react";
import { LoadingCard } from "./loading-card";
import { InventoryCard } from "./inventory-card";
import { Doc } from "@convex/_generated/dataModel";
import { LoadingInventoryCard } from "./loading-item-card";

// Props for the AuctionGrid component
export interface ItemGridProps {
  filter?: ItemFilter;
  className?: string;
}

interface ItemFilter {
  search?: string;
  categories:
    | "weapons"
    | "armor"
    | "accessories"
    | "consumables"
    | "blocks"
    | "tools"
    | "misc"
    | "all";
}
export default function ItemGrid({ ...props }: ItemGridProps) {
  const items = useQuery(api.item.getItems, {
    category: props.filter?.categories,
    search: props.filter?.search,
  });
  console.log(items);
  const loading = Array.from({ length: 24 }, (_, i) => i + 1);
  return (
    <main className="p-4">
      <div className="max-w-[1600px] mx-auto">
        <div className="grid grid-cols-2 sm:grid-cols-d:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
          {items
            ? items.map((item) => (
                <InventoryCard key={item!._id} item={item!} />
              ))
            : loading.map((c) => <LoadingInventoryCard key={c} />)}
        </div>
      </div>
    </main>
  );
}

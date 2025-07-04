import { AuctionCard } from "./auction-card";
import { example, jsonexample, parseNBT } from "./nbt";
import { api } from "@convex/_generated/api";
import { useQuery } from "convex/react";
import { useState } from "react";
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

// Props for the AuctionGrid component
interface AuctionGridProps {
  filter?: AuctionFilter;
  className?: string;
}

interface AuctionFilter {
  listingType?: "all" | "bin" | "bid";
  ended?: boolean;
  categories:
    | "weapons"
    | "armor"
    | "accessories"
    | "consumables"
    | "blocks"
    | "toolsnequipment"
    | "misc"
    | "all";
  sort: "highlow" | "lowhigh" | "soon" | "new" | "bids";
}
export default function AuctionGrid({ ...props }: AuctionGridProps) {
  const auctions = useQuery(api.auction.get, {
    listingType: props.filter?.listingType,
    category: props.filter?.categories,
    sort: props.filter?.sort,
    includeEnded: false,
  });

  return (
    <main className=" p-4">
      <div className="max-w-[1600px] mx-auto">
        <div className="grid grid-cols-2 sm:grid-cols-d:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
          {auctions ? (
            auctions.map((auction) => (
              <AuctionCard key={auction._id} auction={auction} />
            ))
          ) : (
            <></>
          )}
        </div>
      </div>
    </main>
  );
}

import { AuctionCard } from "./auction-card";
import { example, jsonexample, parseNBT } from "./nbt";
import { api } from "@convex/_generated/api";
import { usePaginatedQuery, useQuery } from "convex/react";
import { useState } from "react";
import { LoadingCard } from "./loading-card";
import { Id } from "@convex/_generated/dataModel";
import { useNextPrevPaginatedQuery } from "./hooks/usePagePagination";

// Props for the AuctionGrid component
export interface AuctionGridProps {
  filter?: AuctionFilter;
  className?: string;
}

interface AuctionFilter {
  search?: string;
  listingType?: "all" | "bin" | "bid";
  ended?: boolean;
  categories:
    | "weapons"
    | "armor"
    | "accessories"
    | "consumables"
    | "blocks"
    | "tools"
    | "misc"
    | "all";
  sort: "highlow" | "lowhigh" | "soon" | "new" | "bids";
  seller?: Id<"users">;
}
export default function AuctionGrid({ ...props }: AuctionGridProps) {
  const auctions = useNextPrevPaginatedQuery(
    api.auction.get,
    {
      listingType: props.filter?.listingType,
      category: props.filter?.categories,
      sort: props.filter?.sort,
      includeEnded: props.filter?.ended,
      search: props.filter?.search,
      own: props.filter?.seller,
    },
    { initialNumItems: 100 },
  );

  const loading = Array.from({ length: 24 }, (_, i) => i + 1);
  console.log(auctions);
  return (
    <main className="p-4">
      <div className="max-w-[1600px] mx-auto">
        <div className="grid grid-cols-2 sm:grid-cols-d:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
          {auctions._tag == "Loaded"
            ? auctions.page.map((auction) => (
                <AuctionCard key={auction._id} auction={auction} />
              ))
            : loading.map((c) => <LoadingCard key={c} />)}
        </div>
      </div>
    </main>
  );
}

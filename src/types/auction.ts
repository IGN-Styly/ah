import { StructuredNBTData } from "@/components/nbt";
import type { Doc } from "@convex/_generated/dataModel";

export interface AuctionCardProps {
  auction: Doc<"auctions">;
}

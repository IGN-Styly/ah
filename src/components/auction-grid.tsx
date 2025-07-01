import { AuctionCard } from "./auction-card";
import { example, jsonexample, parseNBT } from "./nbt";
import { api } from "@convex/_generated/api";
import { useQuery } from "convex/react";

export default function Page() {
  const auctions = useQuery(api.auction.get);
  return (
    <main className=" p-4">
      <div className="max-w-[1600px] mx-auto">
        <h1 className="text-3xl font-bold text-center mb-6 uppercase tracking-wider">
          Live Auctions
        </h1>
        <div className="grid grid-cols-2 sm:grid-cols-d:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-3">
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
